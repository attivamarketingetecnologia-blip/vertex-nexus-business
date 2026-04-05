const cron = require('node-cron');
const axios = require('axios');
const db = require('../config/database');

class MonitorService {
  constructor() {
    this.isRunning = false;
    this.checkInterval = '*/5 * * * *'; // Every 5 minutes
    this.job = null;
  }

  start() {
    if (this.isRunning) {
      console.log('Monitor service is already running');
      return;
    }

    console.log('Starting monitor service...');
    
    // Schedule periodic checks
    this.job = cron.schedule(this.checkInterval, async () => {
      await this.checkAllEndpoints();
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    this.isRunning = true;
    console.log(`Monitor service started. Checking endpoints every 5 minutes.`);
    
    // Run initial check
    setTimeout(() => {
      this.checkAllEndpoints();
    }, 5000);
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.isRunning = false;
      console.log('Monitor service stopped');
    }
  }

  async checkAllEndpoints() {
    const endpoints = global.monitoredEndpoints || [];
    
    if (endpoints.length === 0) {
      console.log('No endpoints to monitor');
      return;
    }

    console.log(`Checking ${endpoints.length} endpoint(s)...`);
    
    const promises = endpoints.map(endpointConfig => 
      this.checkEndpoint(endpointConfig)
    );
    
    await Promise.allSettled(promises);
    console.log('All endpoint checks completed');
  }

  async checkEndpoint(config) {
    const { endpoint, method = 'GET', expected_status = 200, timeout = 5000 } = config;
    
    const startTime = Date.now();
    let responseTime = 0;
    let statusCode = 0;
    let success = false;
    let errorMessage = null;
    
    try {
      const response = await axios({
        method,
        url: endpoint,
        timeout,
        validateStatus: () => true // Don't throw on HTTP error status
      });
      
      responseTime = Date.now() - startTime;
      statusCode = response.status;
      success = response.status === expected_status;
      
      // Log the check result
      await this.logMonitoringResult({
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        success,
        timestamp: new Date()
      });
      
      // Check for alerts
      await this.checkForAlerts({
        endpoint,
        statusCode,
        responseTime,
        success,
        expected_status
      });
      
      console.log(`✓ ${endpoint}: ${statusCode} (${responseTime}ms)`);
    } catch (error) {
      responseTime = Date.now() - startTime;
      errorMessage = error.message;
      success = false;
      statusCode = error.response?.status || 0;
      
      // Log the failed check
      await this.logMonitoringResult({
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        success,
        error_message: errorMessage,
        timestamp: new Date()
      });
      
      // Create alert for failure
      await this.createAlert({
        endpoint,
        alert_type: 'error',
        message: `Endpoint failed: ${errorMessage}`,
        severity: 'error'
      });
      
      console.log(`✗ ${endpoint}: ${errorMessage} (${responseTime}ms)`);
    }
  }

  async logMonitoringResult(data) {
    try {
      if (db.mongoConnected) {
        const Monitoring = require('../models/monitoring');
        await Monitoring.create(data);
      } else if (db.pgConnected) {
        const client = await db.getPostgresPool().connect();
        try {
          await client.query(
            `INSERT INTO monitoring (endpoint, method, status_code, response_time, success, error_message, timestamp)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [data.endpoint, data.method, data.status_code, data.response_time, data.success, data.error_message, data.timestamp]
          );
        } finally {
          client.release();
        }
      }
    } catch (error) {
      console.error('Error logging monitoring result:', error);
    }
  }

  async checkForAlerts(data) {
    const { endpoint, statusCode, responseTime, success, expected_status } = data;
    
    // Check for slow response (more than 2 seconds)
    if (responseTime > 2000) {
      await this.createAlert({
        endpoint,
        alert_type: 'slow_response',
        message: `Slow response: ${responseTime}ms`,
        severity: 'warning'
      });
    }
    
    // Check for unexpected status code
    if (statusCode !== expected_status) {
      await this.createAlert({
        endpoint,
        alert_type: 'status_code',
        message: `Unexpected status code: ${statusCode} (expected: ${expected_status})`,
        severity: statusCode >= 500 ? 'error' : 'warning'
      });
    }
    
    // Check for complete failure
    if (!success && statusCode === 0) {
      await this.createAlert({
        endpoint,
        alert_type: 'unavailable',
        message: 'Endpoint is unavailable or timed out',
        severity: 'critical'
      });
    }
  }

  async createAlert(alertData) {
    try {
      // Check if similar alert already exists and is unresolved
      let existingAlert = null;
      
      if (db.mongoConnected) {
        const Alert = require('../models/alert');
        existingAlert = await Alert.findOne({
          endpoint: alertData.endpoint,
          alert_type: alertData.alert_type,
          resolved: false,
          createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 minutes
        });
        
        if (!existingAlert) {
          await Alert.create(alertData);
        }
      } else if (db.pgConnected) {
        const client = await db.getPostgresPool().connect();
        try {
          const result = await client.query(
            `SELECT * FROM alerts 
             WHERE endpoint = $1 
               AND alert_type = $2 
               AND resolved = false 
               AND created_at >= NOW() - INTERVAL '30 minutes'`,
            [alertData.endpoint, alertData.alert_type]
          );
          
          if (result.rows.length === 0) {
            await client.query(
              `INSERT INTO alerts (endpoint, alert_type, message, severity)
               VALUES ($1, $2, $3, $4)`,
              [alertData.endpoint, alertData.alert_type, alertData.message, alertData.severity]
            );
          }
        } finally {
          client.release();
        }
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  }

  setCheckInterval(interval) {
    this.checkInterval = interval;
    
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

module.exports = new MonitorService();