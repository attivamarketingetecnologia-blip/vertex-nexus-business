const mongoose = require('mongoose');
const { Pool } = require('pg');
const mysql = require('mysql2/promise');

class Database {
  constructor() {
    this.mongoConnected = false;
    this.pgConnected = false;
    this.mysqlConnected = false;
    this.pgPool = null;
    this.mysqlPool = null;
  }

  async connect() {
    // Try MySQL first (our primary database)
    if (process.env.MYSQL_HOST) {
      await this.connectMySQL();
    }
    
    // Try MongoDB
    if (process.env.MONGODB_URI) {
      await this.connectMongoDB();
    }
    
    // Try PostgreSQL
    if (process.env.POSTGRES_URL) {
      await this.connectPostgreSQL();
    }
    
    // If no database configured, use in-memory
    if (!this.mysqlConnected && !this.mongoConnected && !this.pgConnected) {
      console.log('⚠️  No database configured. Using in-memory storage (data will be lost on restart).');
      console.log('   Set MYSQL_HOST, MONGODB_URI or POSTGRES_URL environment variable for persistent storage.');
    }
  }

  async connectMongoDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      this.mongoConnected = true;
      console.log('✅ MongoDB connected successfully');
      
      // Create indexes
      await this.createMongoIndexes();
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
    }
  }

  async connectMySQL() {
    try {
      this.mysqlPool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      
      // Test connection
      const connection = await this.mysqlPool.getConnection();
      connection.release();
      this.mysqlConnected = true;
      console.log('✅ MySQL connected successfully');
      
      // Create tables
      await this.createMySQLTables();
    } catch (error) {
      console.error('❌ MySQL connection error:', error.message);
    }
  }

  async connectPostgreSQL() {
    try {
      this.pgPool = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false
      });
      
      // Test connection
      const client = await this.pgPool.connect();
      client.release();
      this.pgConnected = true;
      console.log('✅ PostgreSQL connected successfully');
      
      // Create tables
      await this.createPostgresTables();
    } catch (error) {
      console.error('❌ PostgreSQL connection error:', error.message);
    }
  }

  async createMongoIndexes() {
    // Create indexes for monitoring data
    const Monitoring = require('../models/monitoring');
    await Monitoring.collection.createIndex({ endpoint: 1, timestamp: -1 });
    await Monitoring.collection.createIndex({ status: 1 });
  }

  async createMySQLTables() {
    const connection = await this.mysqlPool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS monitoring (
          id INT AUTO_INCREMENT PRIMARY KEY,
          endpoint VARCHAR(500) NOT NULL,
          method VARCHAR(10) NOT NULL,
          status_code INT,
          response_time INT,
          success BOOLEAN,
          error_message TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_monitoring_endpoint (endpoint),
          INDEX idx_monitoring_timestamp (timestamp DESC),
          INDEX idx_monitoring_status (status_code)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        
        CREATE TABLE IF NOT EXISTS alerts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          endpoint VARCHAR(500) NOT NULL,
          alert_type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          severity VARCHAR(20) DEFAULT 'warning',
          resolved BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved_at TIMESTAMP NULL,
          INDEX idx_alerts_endpoint (endpoint),
          INDEX idx_alerts_resolved (resolved),
          INDEX idx_alerts_created (created_at DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      console.log('✅ MySQL tables created/verified');
    } catch (error) {
      console.error('❌ MySQL table creation error:', error.message);
    } finally {
      connection.release();
    }
  }

  async createPostgresTables() {
    const client = await this.pgPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS monitoring (
          id SERIAL PRIMARY KEY,
          endpoint VARCHAR(500) NOT NULL,
          method VARCHAR(10) NOT NULL,
          status_code INTEGER,
          response_time INTEGER,
          success BOOLEAN,
          error_message TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_monitoring_endpoint ON monitoring(endpoint);
        CREATE INDEX IF NOT EXISTS idx_monitoring_timestamp ON monitoring(timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_monitoring_status ON monitoring(status_code);
        
        CREATE TABLE IF NOT EXISTS alerts (
          id SERIAL PRIMARY KEY,
          endpoint VARCHAR(500) NOT NULL,
          alert_type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          severity VARCHAR(20) DEFAULT 'warning',
          resolved BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved_at TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_alerts_endpoint ON alerts(endpoint);
        CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
        CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
      `);
      console.log('✅ PostgreSQL tables created/verified');
    } catch (error) {
      console.error('❌ PostgreSQL table creation error:', error.message);
    } finally {
      client.release();
    }
  }

  getMongoConnection() {
    return this.mongoConnected ? mongoose.connection : null;
  }

  getPostgresPool() {
    return this.pgConnected ? this.pgPool : null;
  }

  getMySQLPool() {
    return this.mysqlConnected ? this.mysqlPool : null;
  }

  isConnected() {
    return this.mysqlConnected || this.mongoConnected || this.pgConnected;
  }

  // Get primary database (MySQL preferred, then others)
  getPrimaryDB() {
    if (this.mysqlConnected) return { type: 'mysql', pool: this.mysqlPool };
    if (this.mongoConnected) return { type: 'mongodb', connection: mongoose.connection };
    if (this.pgConnected) return { type: 'postgresql', pool: this.pgPool };
    return { type: 'memory', data: {} };
  }
}

module.exports = new Database();