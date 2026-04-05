// 🎯 VERTEX Nexus Control Room - SECURE SERVER v3.0
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

const PORT = 8081; // Nova porta para versão segura
const JWT_SECRET = 'vertex_nexus_secure_key_' + Date.now();
const SALT_ROUNDS = 10;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const dbConfig = {
    host: 'localhost',
    user: 'orquestr_vertexnexus',
    password: 'V3rt3x@Boss',
    database: 'orquestr_vertexnexus'
};

let db;

async function initDatabase() {
    try {
        db = await mysql.createConnection(dbConfig);
        
        // Create tables if they don't exist
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS agents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                status ENUM('todo', 'in_progress', 'review', 'completed') DEFAULT 'todo',
                estimated_time VARCHAR(50),
                actual_time VARCHAR(50),
                task_description TEXT,
                dependencies TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS system_metrics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                metric_key VARCHAR(100) UNIQUE NOT NULL,
                metric_value TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS audit_log (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create default admin user if not exists
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', ['admin']);
        if (users.length === 0) {
            const passwordHash = await bcrypt.hash('V3rt3x@Boss', SALT_ROUNDS);
            await db.execute(
                'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
                ['admin', passwordHash, 'admin']
            );
            console.log('✅ Default admin user created');
        }
        
        // Insert default agents if empty
        const [agents] = await db.execute('SELECT COUNT(*) as count FROM agents');
        if (agents[0].count === 0) {
            const defaultAgents = [
                ['MARKET_HUNTER', 'completed', '4min', '4min', 'Market Research Complete', ''],
                ['TECH_EVALUATOR', 'completed', '4min', '4min', 'Technical Analysis Complete', ''],
                ['DEV_SPRINTER', 'completed', '15min', '15min', 'MVP Structure Complete', ''],
                ['SOCIAL_MEDIA_MANAGER', 'completed', '5m40s', '5m40s', 'Social Strategy Complete', ''],
                ['BUSINESS_STRATEGIST', 'completed', '7m2s', '7m2s', 'Business Plan Complete', ''],
                ['MARKETING_OPERATIONS', 'completed', '7m33s', '7m33s', 'Marketing Strategy Complete', ''],
                ['CUSTOMER_SUCCESS', 'completed', '8m37s', '8m37s', 'Customer Success Program', ''],
                ['VISUAL_IDENTITY_DESIGNER', 'completed', '6m53s', '6m53s', 'Visual Identity Complete', ''],
                ['FRONT_ARCHITECT_V2', 'completed', '13m23s', '13m23s', 'Control Room Complete', ''],
                ['SECURITY_ARCHITECT', 'todo', '120min', null, 'System Security Hardening', ''],
                ['SDR_AGENT', 'todo', '60min', null, 'Automated Lead Generation', ''],
                ['SLR_AGENT', 'todo', '60min', null, 'Sales Lead Response', ''],
                ['CLOSER_AGENT', 'todo', '60min', null, 'Deal Closing Automation', '']
            ];
            
            for (const agent of defaultAgents) {
                await db.execute(
                    'INSERT INTO agents (name, status, estimated_time, actual_time, task_description, dependencies) VALUES (?, ?, ?, ?, ?, ?)',
                    agent
                );
            }
            console.log('✅ Default agents inserted');
        }
        
        // Insert default metrics
        const defaultMetrics = [
            ['roi', '376x'],
            ['success_probability', '85%'],
            ['risk_score', '6/20 LOW'],
            ['projected_profit', '$564,000 Year 1'],
            ['mrr_target', '$50,000 Month 12'],
            ['agents_complete', '9/13'],
            ['system_uptime', '100%']
        ];
        
        for (const [key, value] of defaultMetrics) {
            await db.execute(
                'INSERT INTO system_metrics (metric_key, metric_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE metric_value = ?',
                [key, value, value]
            );
        }
        
        console.log('✅ Database initialized successfully');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Audit logging
async function logAudit(userId, action, details, ip) {
    try {
        await db.execute(
            'INSERT INTO audit_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [userId, action, details, ip]
        );
    } catch (error) {
        console.error('Audit log error:', error);
    }
}

// ========== AUTH ROUTES ==========
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            await logAudit(null, 'LOGIN_FAILED', `Invalid username: ${username}`, req.ip);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            await logAudit(null, 'LOGIN_FAILED', `Invalid password for: ${username}`, req.ip);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        await logAudit(user.id, 'LOGIN_SUCCESS', `User logged in: ${username}`, req.ip);
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            },
            message: 'Login successful'
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/register', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        const { username, password, role = 'user' } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        await db.execute(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, passwordHash, role]
        );
        
        await logAudit(req.user.id, 'USER_REGISTERED', `New user: ${username} (${role})`, req.ip);
        
        res.json({ message: 'User registered successfully' });
        
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ========== PROTECTED API ROUTES ==========
app.get('/api/status', authenticateToken, async (req, res) => {
    try {
        const [agents] = await db.execute('SELECT COUNT(*) as total, COUNT(CASE WHEN status = "completed" THEN 1 END) as completed FROM agents');
        const [metrics] = await db.execute('SELECT * FROM system_metrics');
        
        const metricsObj = {};
        metrics.forEach(m => {
            metricsObj[m.metric_key] = m.metric_value;
        });
        
        res.json({
            system: 'VERTEX Nexus Control Room',
            version: '3.0.0',
            status: 'SECURE_OPERATIONAL',
            agents: `${agents[0].completed}/${agents[0].total} Complete`,
            risk: metricsObj.risk_score || '6/20 LOW',
            roi: metricsObj.roi || '376x',
            successProbability: metricsObj.success_probability || '85%',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            user: req.user.username,
            access: 'AUTHENTICATED',
            message: 'Secure VERTEX Control Room - Dynamic Database Backend'
        });
        
    } catch (error) {
        console.error('Status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/agents', authenticateToken, async (req, res) => {
    try {
        const [agents] = await db.execute('SELECT * FROM agents ORDER BY FIELD(status, "todo", "in_progress", "review", "completed"), id');
        
        res.json({
            agents: agents.map(agent => ({
                id: agent.id,
                name: agent.name,
                status: agent.status,
                estimated_time: agent.estimated_time,
                actual_time: agent.actual_time,
                task: agent.task_description,
                dependencies: agent.dependencies ? JSON.parse(agent.dependencies) : [],
                created_at: agent.created_at,
                updated_at: agent.updated_at
            })),
            total: agents.length,
            completed: agents.filter(a => a.status === 'completed').length,
            pending: agents.filter(a => a.status !== 'completed').length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Agents error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/agents/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, actual_time } = req.body;
        
        const updates = {};
        if (status) updates.status = status;
        if (actual_time) updates.actual_time = actual_time;
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No updates provided' });
        }
        
        await db.execute(
            'UPDATE agents SET ? WHERE id = ?',
            [updates, id]
        );
        
        await logAudit(req.user.id, 'AGENT_UPDATED', `Agent ${id} updated: ${JSON.stringify(updates)}`, req.ip);
        
        res.json({ message: 'Agent updated successfully' });
        
    } catch (error) {
        console.error('Update agent error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/metrics', authenticateToken, async (req, res) => {
    try {
        const [metrics] = await db.execute('SELECT * FROM system_metrics');
        
        const metricsObj = {};
        metrics.forEach(m => {
            metricsObj[m.metric_key] = m.metric_value;
        });
        
        res.json({
            financial: {
                roi: metricsObj.roi || '376x',
                projectedProfit: metricsObj.projected_profit || '$564,000 Year 1',
                mrrTarget: metricsObj.mrr_target || '$50,000 Month 12'
            },
            risk: {
                score: metricsObj.risk_score || '6/20 LOW',
                successProbability: metricsObj.success_probability || '85%',
                mvpTimeline: '4 weeks'
            },
            operational: {
                agentsComplete: metricsObj.agents_complete || '9/13',
                systemUptime: metricsObj.system_uptime || '100%',
                apiResponseTime: '<100ms'
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/metrics/:key', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        const { key } = req.params;
        const { value } = req.body;
        
        if (!value) {
            return res.status(400).json({ error: 'Value required' });
        }
        
        await db.execute(
            'INSERT INTO system_metrics (metric_key, metric_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE metric_value = ?',
            [key, value, value]
        );
        
        await logAudit(req.user.id, 'METRIC_UPDATED', `Metric ${key} updated to: ${value}`, req.ip);
        
        res.json({ message: 'Metric updated successfully' });
        
    } catch (error) {
        console.error('Update metric error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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
            { plan: 'BUSINESS', price: '$299/mo', endpoints: 200,