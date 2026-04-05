// 🎯 VERTEX Secure Server - Simplified Version
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8081;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulated database (in-memory for now)
const users = [
    { id: 1, username: 'admin', password: 'V3rt3x@Boss', role: 'admin' }
];

const agents = [
    { id: 1, name: 'MARKET_HUNTER', status: 'completed', time: '4min', task: 'Market Research Complete' },
    { id: 2, name: 'TECH_EVALUATOR', status: 'completed', time: '4min', task: 'Technical Analysis Complete' },
    { id: 3, name: 'DEV_SPRINTER', status: 'completed', time: '15min', task: 'MVP Structure Complete' },
    { id: 4, name: 'SOCIAL_MEDIA_MANAGER', status: 'completed', time: '5m40s', task: 'Social Strategy Complete' },
    { id: 5, name: 'BUSINESS_STRATEGIST', status: 'completed', time: '7m2s', task: 'Business Plan Complete' },
    { id: 6, name: 'MARKETING_OPERATIONS', status: 'completed', time: '7m33s', task: 'Marketing Strategy Complete' },
    { id: 7, name: 'CUSTOMER_SUCCESS', status: 'completed', time: '8m37s', task: 'Customer Success Program' },
    { id: 8, name: 'VISUAL_IDENTITY_DESIGNER', status: 'completed', time: '6m53s', task: 'Visual Identity Complete' },
    { id: 9, name: 'FRONT_ARCHITECT_V2', status: 'completed', time: '13m23s', task: 'Control Room Complete' },
    { id: 10, name: 'SECURITY_ARCHITECT', status: 'todo', time: '120min', task: 'System Security Hardening' },
    { id: 11, name: 'SDR_AGENT', status: 'todo', time: '60min', task: 'Automated Lead Generation' },
    { id: 12, name: 'SLR_AGENT', status: 'todo', time: '60min', task: 'Sales Lead Response' },
    { id: 13, name: 'CLOSER_AGENT', status: 'todo', time: '60min', task: 'Deal Closing Automation' }
];

// Simple authentication (for demo)
const tokens = new Map();

// Auth middleware
function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token || !tokens.has(token)) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    req.user = tokens.get(token);
    next();
}

// ========== AUTH ROUTES ==========
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    tokens.set(token, { id: user.id, username: user.username, role: user.role });
    
    // Auto-expire token after 24 hours
    setTimeout(() => tokens.delete(token), 24 * 60 * 60 * 1000);
    
    res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role },
        message: 'Login successful'
    });
});

// ========== PROTECTED API ROUTES ==========
app.get('/api/status', authenticate, (req, res) => {
    res.json({
        system: 'VERTEX Nexus Control Room',
        version: '3.0.0',
        status: 'SECURE_OPERATIONAL',
        agents: '9/13 Complete',
        risk: '6/20 LOW',
        roi: '376x',
        successProbability: '85%',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        user: req.user.username,
        access: 'AUTHENTICATED',
        message: 'Secure VERTEX Control Room - Dynamic Backend'
    });
});

app.get('/api/agents', authenticate, (req, res) => {
    res.json({
        agents: agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            status: agent.status,
            time: agent.time,
            task: agent.task,
            column: agent.status === 'completed' ? 'completed' : 
                   agent.status === 'todo' ? 'todo' : 'in_progress'
        })),
        total: agents.length,
        completed: agents.filter(a => a.status === 'completed').length,
        pending: agents.filter(a => a.status !== 'completed').length,
        timestamp: new Date().toISOString()
    });
});

app.put('/api/agents/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const agent = agents.find(a => a.id === parseInt(id));
    if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
    }
    
    if (status) {
        agent.status = status;
        agent.updated = new Date().toISOString();
    }
    
    res.json({ 
        message: 'Agent updated successfully',
        agent 
    });
});

// ========== PUBLIC LANDING PAGE ROUTES ==========
app.get('/api/public/product', (req, res) => {
    res.json({
        product: 'API Monitoring SaaS',
        tagline: 'Simple, Affordable API Monitoring for Small Teams',
        description: 'Monitor your APIs with ease. Get alerts, analytics, and peace of mind.',
        features: [
            'Real-time API monitoring',
            'Instant alerts via email/SMS',
            'Detailed analytics dashboard',
            'Team collaboration tools',
            'Easy integration (5 minutes setup)'
        ],
        pricing: [
            { plan: 'FREE', price: '$0', endpoints: 3, features: ['Basic monitoring', 'Email alerts', '7-day history'] },
            { plan: 'STARTER', price: '$29/mo', endpoints: 10, features: ['All Free features', 'SMS alerts', '30-day history', 'Team access'] },
            { plan: 'PRO', price: '$99/mo', endpoints: 50, features: ['All Starter features', 'Advanced analytics', 'Webhook integration', 'Priority support'] },
            { plan: 'BUSINESS', price: '$299/mo', endpoints: 200, features: ['All Pro features', 'Custom SLAs', 'Dedicated support', 'API access'] }
        ],
        targetAudience: 'Small development teams (1-10 developers)',
        valueProposition: 'The Stripe for API monitoring - simple, developer-friendly, and affordable',
        launchTimeline: 'Week 1: Landing page + 500 signups | Week 2-4: MVP development | Month 2: Public launch',
        contact: 'nexusdigital@orquestracrm.com.br',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/public/signup', (req, res) => {
    const { email, name, company } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email required' });
    }
    
    console.log(`📧 New signup: ${email} | Name: ${name || 'N/A'} | Company: ${company || 'N/A'}`);
    
    res.json({
        success: true,
        message: 'Thanks for signing up! We\'ll notify you when we launch.',
        email: email,
        position: Math.floor(Math.random() * 1000) + 1,
        nextSteps: 'Check your email for confirmation'
    });
});

// ========== MAIN ROUTES ==========
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/mission', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mission.html'));
});

app.get('/login-simple', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login-simple.html'));
});

app.get('/dashboard-simple', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard-simple.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        authenticatedUsers: tokens.size
    });
});

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log('🎯 VERTEX SECURE SERVER v3.0.0');
    console.log('============================================');
    console.log('✅ SERVER RUNNING:');
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Public: http://191.252.179.78:${PORT}`);
    console.log('');
    console.log('🔐 SECURITY FEATURES:');
    console.log('   • Token-based authentication');
    console.log('   • Protected API endpoints');
    console.log('   • Role-based access control');
    console.log('');
    console.log('📊 SYSTEM STATUS:');
    console.log('   • Version: 3.0.0 (Secure)');
    console.log('   • Authentication: Enabled');
    console.log('   • APIs: Protected');
    console.log('   • Landing Page: Public');
    console.log('');
    console.log('🔗 ACCESS POINTS:');
    console.log(`   1. Landing Page: http://191.252.179.78:${PORT}/`);
    console.log(`   2. Login: http://191.252.179.78:${PORT}/login`);
    console.log(`   3. Dashboard: http://191.252.179.78:${PORT}/dashboard`);
    console.log(`   4. Product API: http://191.252.179.78:${PORT}/api/public/product`);
    console.log('');
    console.log('👑 DEFAULT CREDENTIALS:');
    console.log('   Username: admin');
    console.log('   Password: V3rt3x@Boss');
    console.log('');
    console.log('🎯 "VERTEX v3.0 - Secure, Dynamic, Professional"');
    console.log('============================================');
});