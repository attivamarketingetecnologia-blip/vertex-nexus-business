const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get dashboard overview data
router.get('/overview', async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const since = new Date(Date.now() - (hours * 60 * 60 * 1000));
    
    let overview = {
      total_endpoints: 0,
      active_alerts: 0,
      uptime_24h: 0,
      avg_response_time: 0,
      recent_checks: [],
      endpoint_status: []
    };
    
    // Get monitored endpoints count
    overview.total_endpoints = global.monitoredEndpoints?.length || 0;
    
    // Get active alerts count
    if (db.mongoConnected) {
      const Alert = require('../models/alert');
      overview.active_alerts = await Alert.countDocuments({ resolved: false });
      
      // Get recent checks
      const Monitoring = require('../models/monitoring');
      overview.recent_checks = await Monitoring.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .lean();
      
      // Get endpoint status
      const endpointStats = await Monitoring.aggregate([
        { $match: { timestamp: { $gte: since } } },
        {
          $group: {
            _id: '$endpoint',
            total: { $sum: 1 },
            success: { $sum: { $cond: [{ $eq: ['$success', true] }, 1, 0] } },
            avg_response_time: { $avg: '$response_time' },
            last_check: { $max: '$timestamp' }
          }
        }
      ]);
      
      overview.endpoint_status = endpointStats.map(stat => ({
        endpoint: stat._id,
        total_checks: stat.total,
        successful_checks: stat.success,
        success_rate: stat.total > 0 ? (stat.success / stat.total) * 100 : 0,
        avg_response_time: stat.avg_response_time,
        last_check: stat.last_check,
        status: stat.total > 0 ? (stat.success / stat.total) > 0.95 ? 'healthy' : 'degraded' : 'unknown'
      }));
      
      // Calculate overall uptime
      const totalChecks = endpointStats.reduce((sum, stat) => sum + stat.total, 0);
      const totalSuccess = endpointStats.reduce((sum, stat) => sum + stat.success, 0);
      overview.uptime_24h = totalChecks > 0 ? (totalSuccess / totalChecks) * 100 : 0;
      
      // Calculate average response time
      const totalResponseTime = endpointStats.reduce((sum, stat) => sum + (stat.avg_response_time * stat.total), 0);
      overview.avg_response_time = totalChecks > 0 ? totalResponseTime / totalChecks : 0;
      
    } else if (db.pgConnected) {
      const client = await db.getPostgresPool().connect();
      try {
        // Active alerts
        const alertResult = await client.query(
          'SELECT COUNT(*) as count FROM alerts WHERE resolved = false'
        );
        overview.active_alerts = parseInt(alertResult.rows[0].count);
        
        // Recent checks
        const recentResult = await client.query(
          `SELECT * FROM monitoring 
           ORDER BY timestamp DESC 
           LIMIT 10`
        );
        overview.recent_checks = recentResult.rows;
        
        // Endpoint status
        const endpointResult = await client.query(
          `SELECT 
            endpoint,
            COUNT(*) as total,
            SUM(CASE WHEN success THEN 1 ELSE 0 END) as success,
            AVG(response_time) as avg_response_time,
            MAX(timestamp) as last_check
           FROM monitoring
           WHERE timestamp >= $1
           GROUP BY endpoint`,
          [since]
        );
        
        overview.endpoint_status = endpointResult.rows.map(row => ({
          endpoint: row.endpoint,
          total_checks: parseInt(row.total),
          successful_checks: parseInt(row.success),
          success_rate: parseInt(row.total) > 0 ? (parseInt(row.success) / parseInt(row.total)) * 100 : 0,
          avg_response_time: parseFloat(row.avg_response_time || 0),
          last_check: row.last_check,
          status: parseInt(row.total) > 0 ? (parseInt(row.success) / parseInt(row.total)) > 0.95 ? 'healthy' : 'degraded' : 'unknown'
        }));
        
        // Calculate overall uptime
        const totalChecks = endpointResult.rows.reduce((sum, row) => sum + parseInt(row.total), 0);
        const totalSuccess = endpointResult.rows.reduce((sum, row) => sum + parseInt(row.success), 0);
        overview.uptime_24h = totalChecks > 0 ? (totalSuccess / totalChecks) * 100 : 0;
        
        // Calculate average response time
        const totalResponseTime = endpointResult.rows.reduce((sum, row) => 
          sum + (parseFloat(row.avg_response_time || 0) * parseInt(row.total)), 0);
        overview.avg_response_time = totalChecks > 0 ? totalResponseTime / totalChecks : 0;
        
      } finally {
        client.release();
      }
    }
    
    res.json(overview);
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// Get alerts
router.get('/alerts', async (req, res) => {
  try {
    const { resolved = false, limit = 50 } = req.query;
    
    let alerts = [];
    
    if (db.mongoConnected) {
      const Alert = require('../models/alert');
      const query = { resolved: resolved === 'true' };
      alerts = await Alert.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();
    } else if (db.pgConnected) {
      const client = await db.getPostgresPool().connect();
      try {
        const result = await client.query(
          `SELECT * FROM alerts 
           WHERE resolved = $1 
           ORDER BY created_at DESC 
           LIMIT $2`,
          [resolved === 'true', parseInt(limit)]
        );
        alerts = result.rows;
      } finally {
        client.release();
      }
    }
    
    res.json({
      alerts,
      count: alerts.length,
      resolved: resolved === 'true'
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// Update alert status
router.put('/alerts/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (db.mongoConnected) {
      const Alert = require('../models/alert');
      const alert = await Alert.findByIdAndUpdate(
        id,
        { resolved: true, resolved_at: new Date() },
        { new: true }
      );
      
      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      
      res.json({ message: 'Alert resolved', alert });
    } else if (db.pgConnected) {
      const client = await db.getPostgresPool().connect();
      try {
        const result = await client.query(
          `UPDATE alerts 
           SET resolved = true, resolved_at = CURRENT_TIMESTAMP 
           WHERE id = $1 
           RETURNING *`,
          [id]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Alert not found' });
        }
        
        res.json({ message: 'Alert resolved', alert: result.rows[0] });
      } finally {
        client.release();
      }
    } else {
      res.status(400).json({ error: 'No database connection' });
    }
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

module.exports = router;