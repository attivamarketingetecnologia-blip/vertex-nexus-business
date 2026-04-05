// 🎯 VERTEX Nexus Control Room - PUBLIC SERVER
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080; // Porta padrão para web

// Middleware para logs
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`);
    next();
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        system: 'VERTEX Nexus Control Room',
        version: '2.0.0',
        status: 'OPERATIONAL',
        agents: '9/9 Complete',
        risk: '6/20 LOW',
        roi: '376x',
        successProbability: '85%',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        access: {
            web: `http://${req.headers.host || 'localhost:8080'}`,
            api: `http://${req.headers.host || 'localhost:8080'}/api`,
            ip: '191.252.179.78:8080'
        },
        message: 'VERTEX Control Room - Public Access Enabled'
    });
});

app.get('/api/agents', (req, res) => {
    res.json({
        agents: [
            { id: 1, name: 'MARKET_HUNTER', status: 'completed', time: '4min', column: 'review', task: 'Market Research Complete' },
            { id: 2, name: 'TECH_EVALUATOR', status: 'completed', time: '4min', column: 'review', task: 'Technical Analysis Complete' },
            { id: 3, name: 'DEV_SPRINTER', status: 'completed', time: '15min', column: 'completed', task: 'MVP Structure Complete' },
            { id: 4, name: 'SOCIAL_MEDIA_MANAGER', status: 'completed', time: '5m40s', column: 'completed', task: 'Social Strategy Complete' },
            { id: 5, name: 'BUSINESS_STRATEGIST', status: 'completed', time: '7m2s', column: 'completed', task: 'Business Plan Complete' },
            { id: 6, name: 'MARKETING_OPERATIONS', status: 'completed', time: '7m33s', column: 'completed', task: 'Marketing Strategy Complete' },
            { id: 7, name: 'CUSTOMER_SUCCESS', status: 'completed', time: '8m37s', column: 'completed', task: 'Customer Success Program' },
            { id: 8, name: 'VISUAL_IDENTITY_DESIGNER', status: 'completed', time: '6m53s', column: 'completed', task: 'Visual Identity Complete' },
            { id: 9, name: 'FRONT_ARCHITECT_V2', status: 'completed', time: '13m23s', column: 'completed', task: 'Control Room Complete' },
            { id: 10, name: 'SECURITY_ARCHITECT', status: 'todo', time: '120min', column: 'todo', task: 'System Security Hardening' },
            { id: 11, name: 'SDR_AGENT', status: 'todo', time: '60min', column: 'todo', task: 'Automated Lead Generation' },
            { id: 12, name: 'SLR_AGENT', status: 'todo', time: '60min', column: 'todo', task: 'Sales Lead Response' },
            { id: 13, name: 'CLOSER_AGENT', status: 'todo', time: '60min', column: 'todo', task: 'Deal Closing Automation' }
        ],
        total: 13,
        completed: 9,
        pending: 4,
        efficiency: '92.3%'
    });
});

app.get('/api/metrics', (req, res) => {
    res.json({
        financial: {
            roi: '376x',
            projectedProfit: '$564,000 Year 1',
            mrrTarget: '$50,000 Month 12',
            breakEven: 'Month 3'
        },
        risk: {
            score: '6/20 LOW',
            successProbability: '85%',
            mvpTimeline: '4 weeks'
        },
        operational: {
            agentsComplete: '9/9',
            systemUptime: '100%',
            apiResponseTime: '<100ms'
        }
    });
});

// WebSocket simulation for real-time updates
app.get('/api/ws-simulate', (req, res) => {
    res.json({
        event: 'agent_update',
        data: {
            agent: 'VERTEX_MAIN',
            action: 'public_server_started',
            timestamp: new Date().toISOString(),
            message: 'Public control room server started successfully'
        }
    });
});

// Main control room page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'control-room.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    const address = server.address();
    console.log('🎯 VERTEX Nexus Control Room - PUBLIC SERVER');
    console.log('============================================');
    console.log(`✅ Server running at:`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Network: http://191.252.179.78:${PORT}`);
    console.log(`   Any device: http://${address.address}:${address.port}`);
    console.log('');
    console.log('📊 System Status:');
    console.log('   Version: 2.0.0 (Public Access)');
    console.log('   Agents: 9/9 Complete');
    console.log('   Risk: 6/20 LOW');
    console.log('   ROI: 376x');
    console.log('');
    console.log('🔗 Access URLs:');
    console.log(`   1. Control Room: http://191.252.179.78:${PORT}/`);
    console.log(`   2. Status API: http://191.252.179.78:${PORT}/api/status`);
    console.log(`   3. Agents API: http://191.252.179.78:${PORT}/api/agents`);
    console.log('');
    console.log('🎯 "VERTEX Control Room - Public Access Enabled"');
    console.log('============================================');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down VERTEX server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});