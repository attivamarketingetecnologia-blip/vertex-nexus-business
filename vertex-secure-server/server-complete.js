// Continuação do server.js
            features: ['All Pro features', 'Custom SLAs', 'Dedicated support', 'API access'] }
        ],
        targetAudience: 'Small development teams (1-10 developers)',
        valueProposition: 'The Stripe for API monitoring - simple, developer-friendly, and affordable',
        launchTimeline: 'Week 1: Landing page + 500 signups | Week 2-4: MVP development | Month 2: Public launch',
        contact: 'nexusdigital@orquestracrm.com.br',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/public/signup', async (req, res) => {
    try {
        const { email, name, company } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }
        
        // In a real app, you would save to database and send confirmation email
        // For now, we'll just log it
        console.log(`📧 New signup: ${email} | Name: ${name || 'N/A'} | Company: ${company || 'N/A'}`);
        
        // Simulate saving to a waitlist table
        // await db.execute('INSERT INTO waitlist (email, name, company) VALUES (?, ?, ?)', [email, name, company]);
        
        res.json({
            success: true,
            message: 'Thanks for signing up! We\'ll notify you when we launch.',
            email: email,
            position: Math.floor(Math.random() * 1000) + 1, // Simulated waitlist position
            nextSteps: 'Check your email for confirmation'
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ========== ADMIN ROUTES ==========
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [agentStats] = await db.execute('SELECT status, COUNT(*) as count FROM agents GROUP BY status');
        const [auditLogs] = await db.execute('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 50');
        const [signups] = await db.execute('SELECT COUNT(*) as count FROM waitlist');
        
        res.json({
            users: userCount[0].count,
            agents: agentStats.reduce((acc, stat) => {
                acc[stat.status] = stat.count;
                return acc;
            }, {}),
            waitlist: signups[0]?.count || 0,
            recentActivity: auditLogs.slice(0, 10),
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ========== MAIN ROUTES ==========
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Health check (public)
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        database: db ? 'connected' : 'disconnected'
    });
});

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
async function startServer() {
    try {
        await initDatabase();
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            const address = server.address();
            console.log('🎯 VERTEX NEXUS CONTROL ROOM v3.0.0');
            console.log('============================================');
            console.log('✅ SECURE SERVER RUNNING:');
            console.log(`   Local: http://localhost:${PORT}`);
            console.log(`   Public: http://191.252.179.78:${PORT}`);
            console.log(`   Network: http://${address.address}:${address.port}`);
            console.log('');
            console.log('🔐 SECURITY FEATURES:');
            console.log('   • JWT Authentication');
            console.log('   • Password hashing (bcrypt)');
            console.log('   • Role-based access control');
            console.log('   • Audit logging');
            console.log('   • MySQL database backend');
            console.log('');
            console.log('📊 SYSTEM STATUS:');
            console.log('   • Version: 3.0.0 (Secure)');
            console.log('   • Database: Connected');
            console.log('   • Authentication: Enabled');
            console.log('   • APIs: Protected');
            console.log('');
            console.log('🔗 ACCESS POINTS:');
            console.log(`   1. Landing Page: http://191.252.179.78:${PORT}/`);
            console.log(`   2. Login: http://191.252.179.78:${PORT}/login`);
            console.log(`   3. Dashboard: http://191.252.179.78:${PORT}/dashboard`);
            console.log(`   4. Product API: http://191.252.179.78:${PORT}/api/public/product`);
            console.log(`   5. Signup API: http://191.252.179.78:${PORT}/api/public/signup`);
            console.log('');
            console.log('👑 DEFAULT ADMIN CREDENTIALS:');
            console.log('   Username: admin');
            console.log('   Password: V3rt3x@Boss');
            console.log('');
            console.log('🎯 "VERTEX Control Room v3.0 - Secure & Dynamic"');
            console.log('============================================');
        });
        
        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n🔄 Shutting down secure server...');
            if (db) await db.end();
            server.close(() => {
                console.log('✅ Server stopped');
                process.exit(0);
            });
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();