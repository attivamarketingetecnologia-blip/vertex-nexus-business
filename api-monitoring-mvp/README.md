# API Monitoring MVP

A lightweight API monitoring system for small teams, built with Node.js, Express, and support for MongoDB/PostgreSQL.

## Features

- **Endpoint Monitoring**: Monitor HTTP endpoints with configurable intervals
- **Multiple Database Support**: MongoDB and PostgreSQL (or in-memory for testing)
- **Alert System**: Automatic alerts for failures, slow responses, and unexpected status codes
- **Dashboard UI**: Web-based dashboard for monitoring status and managing endpoints
- **REST API**: Full-featured API for integration and automation
- **Scheduled Checks**: Automatic periodic monitoring with configurable intervals

## Quick Start

### 1. Installation

```bash
# Clone or copy the project
cd api-monitoring-mvp

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

### 2. Database Setup (Optional)

Choose either MongoDB or PostgreSQL, or use in-memory storage for testing:

#### MongoDB
```bash
# Install MongoDB (if not already installed)
# Update .env with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/api-monitoring
```

#### PostgreSQL
```bash
# Install PostgreSQL (if not already installed)
# Create database
createdb api_monitoring

# Update .env with your PostgreSQL URL
POSTGRES_URL=postgresql://username:password@localhost:5432/api_monitoring
```

### 3. Running the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Dashboard
Access the web dashboard at `http://localhost:3000/dashboard.html`

### API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/monitor/list` - List monitored endpoints
- `POST /api/monitor/add` - Add endpoint to monitor
- `POST /api/monitor/check` - Manually check an endpoint
- `GET /api/monitor/stats` - Get monitoring statistics
- `GET /api/dashboard/overview` - Dashboard overview data
- `GET /api/dashboard/alerts` - Get alerts
- `PUT /api/dashboard/alerts/:id/resolve` - Resolve an alert

### Adding an Endpoint to Monitor

```bash
curl -X POST http://localhost:3000/api/monitor/add \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://api.example.com/health",
    "method": "GET",
    "expected_status": 200,
    "timeout": 5000
  }'
```

### Checking an Endpoint Manually

```bash
curl -X POST http://localhost:3000/api/monitor/check \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://api.example.com/health",
    "method": "GET",
    "timeout": 5000
  }'
```

## Project Structure

```
api-monitoring-mvp/
├── server.js              # Main application entry point
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── config/
│   └── database.js       # Database configuration and connection
├── models/
│   ├── monitoring.js     # Monitoring data model (MongoDB)
│   └── alert.js          # Alert model (MongoDB)
├── routes/
│   ├── api.js           # Basic API routes
│   ├── monitor.js       # Monitoring endpoints
│   └── dashboard.js     # Dashboard data endpoints
├── services/
│   └── monitorService.js # Scheduled monitoring service
├── public/
│   └── dashboard.html   # Web dashboard UI
└── README.md            # This file
```

## Configuration

### Environment Variables

See `.env.example` for all available options. Key variables:

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `POSTGRES_URL`: PostgreSQL connection string
- `CHECK_INTERVAL`: Cron schedule for automatic checks (default: every 5 minutes)
- `DEFAULT_TIMEOUT`: Default timeout for endpoint checks (default: 5000ms)
- `SLOW_RESPONSE_THRESHOLD`: Threshold for slow response alerts (default: 2000ms)

### Monitoring Configuration

When adding an endpoint, you can configure:

- `endpoint`: The URL to monitor (required)
- `method`: HTTP method (GET, POST, PUT, DELETE, PATCH)
- `expected_status`: Expected HTTP status code
- `timeout`: Request timeout in milliseconds
- `active`: Whether monitoring is active

## Alert Types

The system automatically creates alerts for:

1. **Error**: Endpoint request fails (network error, timeout)
2. **Status Code**: Unexpected HTTP status code
3. **Slow Response**: Response time exceeds threshold
4. **Unavailable**: Endpoint completely unavailable

Alert severity levels:
- `info`: Informational alerts
- `warning`: Warning conditions
- `error`: Error conditions
- `critical`: Critical conditions

## Development

### Running Tests

```bash
npm test
```

### Code Style

- Use ES6+ JavaScript features
- Follow Express.js best practices
- Use async/await for asynchronous operations
- Include error handling for all external calls

### Adding Features

1. Database models go in `models/`
2. API routes go in `routes/`
3. Business logic/services go in `services/`
4. Frontend assets go in `public/`

## Deployment

### Docker (Coming Soon)

```bash
# Build and run with Docker
docker build -t api-monitoring-mvp .
docker run -p 3000:3000 --env-file .env api-monitoring-mvp
```

### PM2 (Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name api-monitoring

# Save PM2 configuration
pm2 save
pm2 startup
```

## Limitations & Future Improvements

### Current Limitations
- Basic authentication/authorization
- Limited alert notification channels (in-app only)
- No historical data cleanup
- Simple dashboard UI

### Planned Features
- [ ] Email/Slack/Webhook notifications
- [ ] User authentication and authorization
- [ ] API key management
- [ ] Advanced alert rules and conditions
- [ ] Historical data analysis and reporting
- [ ] Export monitoring data
- [ ] Multi-team support
- [ ] Docker containerization
- [ ] Comprehensive test suite

## License

MIT

## Support

For issues, questions, or contributions:
1. Check the [GitHub Issues](../../issues)
2. Review the documentation
3. Submit a pull request for improvements