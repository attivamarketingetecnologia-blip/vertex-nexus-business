const express = require('express');
const router = express.Router();
const axios = require('axios');
const Monitoring = require('../models/monitoring');
const Alert = require('../models/alert');
const db = require('../config/database');

// Add endpoint to monitor
router.post('/add', async (req, res) => {
  try {
    const { endpoint, method = 'GET', expected_status = 200, timeout = 5000 } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' });
    }
    
    // Validate URL
    try {
      new URL(endpoint);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Store monitoring configuration (in a real app, this would be in a database)
    const monitorConfig = {
      endpoint,
      method,
      expected_status,
      timeout,
      active: true,
      created_at: new Date()
    };
    
    // In a real implementation, you would save this to a database
    // For MVP, we'll store in memory
    if (!global.monitoredEndpoints) {
      global.monitoredEndpoints = [];
    }
    
    // Check if endpoint already exists
    const existingIndex = global.monitoredEndpoints.findIndex(e => e.endpoint === endpoint);
    if (existingIndex !== -1) {
      global.monitoredEndpoints[existingIndex] = monitorConfig;
    } else {
      global.monitoredEndpoints.push(monitorConfig);
    }
    
    res.json({
      message: 'Endpoint added to monitoring',
      config: monitorConfig,
      total_monitored: global.monitoredEndpoints.length
    });
  } catch (error) {
    console.error('Error adding monitor:', error);
    res.status(500).json({ error: 'Failed to add endpoint to monitoring' });
  }
});

// List monitored endpoints
router.get('/list', (req, res) => {
  const endpoints = global.monitoredEndpoints || [];
  res.json({
    endpoints,
    count: endpoints.length
  });
});

// Check a specific endpoint
router.post('/check', async (req, res) => {
  try {
    const { endpoint, method = 'GET', timeout = 5000 } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint is required' });
    }
    
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
      success = response.status >= 200 && response.status < 300;
      
      // Log the check result
      await logMonitoringResult({
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        success,
        timestamp: new Date()
      });
      
      // Check for alerts
      await checkForAlerts({
        endpoint,
        statusCode,
        responseTime,
        success
      });
      
      res.json({
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        success,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      responseTime = Date.now() - startTime;
      errorMessage = error.message;
      success = false;
      statusCode = error.response?.status || 0;
      
      // Log the failed check
      await logMonitoringResult({
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        success,
        error_message: errorMessage,
        timestamp: new Date()
      });
      
      // Create alert for failure
      await createAlert({
        endpoint,
        alert_type: 'error',
        message: `Endpoint failed: ${errorMessage}`,
        severity: 'error'
      });
      
      res.json({
        endpoint,
        method,
        status_code: statusCode,
        response_time: responseTime,
        success,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error checking endpoint:', error);
    res.status(500).json({ error: 'Failed to check endpoint' });
  }
});

// Get monitoring statistics
router.get('/stats', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const since = new Date(Date.now() - (hours * 60 * 60 * 1000));
    
    let stats = {
      total_checks: 0,
      successful_checks: 0,
      failed_checks: 0,
      average_response_time: 0,
      uptime_percentage: 0,
      endpoints: []
    };
    
    if (db.mongoConnected) {
      // MongoDB stats
      const Monitoring = require('../models/monitoring');
      const results = await Monitoring.aggregate([
        { $match: { timestamp: { $gte: since } } },
        {
          $group: {
            _id: '$endpoint',
            total: { $sum: 1 },
            success: { $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] } },
            avg_response_time: { $avg: '$response_time' }
          }
        }
      ]);
      
      stats.total_checks = results.reduce((sum, r) => sum + r.total, 0);
      stats.successful_checks = results.reduce((sum, r) => sum + r.success, 0);
      stats.failed_checks = stats.total_checks - stats.successful_checks;
      stats.average_response_time = results.length > 0 
        ? results.reduce((sum, r) => sum + r.avg_response_time, 0) / results.length 
        : 0;
      stats.uptime_percentage = stats.total_checks > 0 
        ? (stats.successful_checks / stats.total_checks) * 100 
        : 0;
      stats.endpoints = results.map(r => ({
        endpoint: r._id,
        total_checks: r.total,
        successful_checks: r.success,
        failed_checks: r.total - r.success,
        success_rate: r.total > 0 ? (r.success / r.total) * 100 : 0,
        avg_response_time: r.avg_response_time
      }));
    } else if (db.pgConnected) {
      // PostgreSQL stats
      const client = await db.getPostgresPool().connect();
      try {
        const result = await client.query(`
          SELECT 
            endpoint,
            COUNT(*) as total,
            SUM(CASE WHEN success THEN 1 ELSE 0 END) as success,
            AVG(response_time) as avg_response_time
          FROM monitoring
          WHERE timestamp >= $1
          GROUP BY endpoint
        `, [since]);
        
        stats.total_checks = result.rows.reduce((sum, r) => sum + parseInt(r.total), 0);
        stats.successful_checks = result.rows.reduce((sum, r) => sum + parseInt(r.success), 0);
        stats.failed_checks = stats.total_checks - stats.successful_checks;
        stats.average_response_time = result.rows.length > 0 
          ? result.rows.reduce((sum, r) => sum + parseFloat(r.avg_response_time || 0), 0) / result.rows.length 
          : 0;
        stats.uptime_percentage = stats.total_checks > 0 
          ? (stats.successful_checks / stats.total_checks) * 100 
          : 0;
        stats.endpoints = result.rows.map(r => ({
          endpoint: r.endpoint,
          total_checks: parseInt(r.total),
          successful_checks: parseInt(r.success),
          failed_checks: parseInt(r.total) - parseInt(r.success),
          success_rate: parseInt(r.total) > 0 ? (parseInt(r.success) / parseInt(r.total)) * 100 : 0,
          avg_response_time: parseFloat(r.avg_response_time || 0)
        }));
      } finally {
        client.release();
      }
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get monitoring statistics' });
  }
});

// Helper functions
async function logMonitoringResult(data) {
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

async function checkForAlerts(data) {
  const { endpoint, statusCode, responseTime, success } = data;
  
  // Check for slow response (more than 2 seconds)
  if (responseTime > 2000) {
    await createAlert({
      endpoint,
      alert_type: 'slow_response',
      message: `Slow response: ${responseTime}ms`,
      severity: 'warning'
    });
  }
  
  // Check for error status
  if (!success) {
    await createAlert({
      endpoint,
      alert_type: 'status_code',
      message: `Unexpected status code: ${statusCode}`,
      severity: 'error'
    });
  }
}

async function createAlert(alertData) {
  try {
    if (db.mongoConnected) {
      const Alert = require('../models/alert');
      await Alert.create(alertData);
    } else if (db.pgConnected) {
      const client = await db.getPostgresPool().connect();
      try {
        await client.query(
          `INSERT INTO alerts (endpoint, alert_type, message, severity)
           VALUES ($1, $2, $3, $4)`,
          [alertData.endpoint, alertData.alert_type, alertData.message, alertData.severity]
        );
      } finally {
        client.release();
      }
    }
  } catch (error) {
    console.error('Error creating alert:', error);
  }
}

module.exports = router;