const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection
const db = require('./config/database');
db.connect();

// Routes
const apiRoutes = require('./routes/api');
const monitorRoutes = require('./routes/monitor');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api', apiRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static files for dashboard UI
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'API Monitoring MVP',
    version: '1.0.0',
    endpoints: {
      api: '/api',
      monitor: '/api/monitor',
      dashboard: '/api/dashboard',
      ui: '/dashboard.html'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start monitor service
const monitorService = require('./services/monitorService');

// Start server
app.listen(PORT, () => {
  console.log(`API Monitoring MVP running on port ${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}/dashboard.html`);
  
  // Start monitoring service
  monitorService.start();
});