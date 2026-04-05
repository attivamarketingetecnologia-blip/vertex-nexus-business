const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const db = require('../config/database');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db.isConnected() ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'API Monitoring MVP',
    version: '1.0.0',
    description: 'API Monitoring system for small teams',
    endpoints: {
      health: '/api/health',
      monitor: {
        add: 'POST /api/monitor/add',
        list: 'GET /api/monitor/list',
        stats: 'GET /api/monitor/stats'
      },
      dashboard: {
        overview: 'GET /api/dashboard/overview',
        alerts: 'GET /api/dashboard/alerts'
      }
    }
  });
});

module.exports = router;