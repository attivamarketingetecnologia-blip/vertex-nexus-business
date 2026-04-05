// Agent Activity Logger for VERTEX Control Room
const fs = require('fs');
const path = require('path');

class AgentLogger {
  constructor() {
    this.logDir = path.join(__dirname, 'memory', 'agent-logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  logAgentActivity(agentName, action, details = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      agent: agentName,
      action,
      details,
      sessionId: process.env.SESSION_ID || 'main'
    };

    // Save to daily log file
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${date}.json`);
    
    let logs = [];
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    
    // Also log to console for now
    console.log(`[AGENT LOG] ${timestamp} - ${agentName}: ${action}`);
    
    return logEntry;
  }

  getAgentLogs(agentName, date = null) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logDir, `${targetDate}.json`);
    
    if (!fs.existsSync(logFile)) {
      return [];
    }
    
    const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    return agentName ? logs.filter(log => log.agent === agentName) : logs;
  }

  getAgentStatus(agentName) {
    const todayLogs = this.getAgentLogs(agentName);
    const lastActivity = todayLogs[todayLogs.length - 1];
    
    return {
      agent: agentName,
      lastActivity: lastActivity ? lastActivity.timestamp : null,
      lastAction: lastActivity ? lastActivity.action : 'inactive',
      totalActivitiesToday: todayLogs.length,
      status: lastActivity ? 'active' : 'inactive'
    };
  }

  getAllAgentsStatus() {
    const todayLogs = this.getAgentLogs();
    const agents = {};
    
    todayLogs.forEach(log => {
      if (!agents[log.agent]) {
        agents[log.agent] = {
          lastActivity: log.timestamp,
          lastAction: log.action,
          activityCount: 0
        };
      }
      agents[log.agent].lastActivity = log.timestamp;
      agents[log.agent].lastAction = log.action;
      agents[log.agent].activityCount++;
    });
    
    return Object.entries(agents).map(([agentName, data]) => ({
      agent: agentName,
      lastActivity: data.lastActivity,
      lastAction: data.lastAction,
      activityCount: data.activityCount,
      status: this.getAgentStatus(agentName).status
    }));
  }
}

// Singleton instance
const logger = new AgentLogger();

// Log current agents
logger.logAgentActivity('VERTEX', 'system_start', { 
  version: '1.0',
  infrastructure: 'complete',
  mission: 'ultra-profitable-internet-business'
});

logger.logAgentActivity('MARKET_HUNTER', 'mission_complete', {
  opportunitiesFound: 5,
  time: '4 minutes',
  recommendation: 'API Monitoring for Small Teams'
});

logger.logAgentActivity('TECH_EVALUATOR', 'mission_complete', {
  analysis: 'technical_feasibility',
  riskScore: '6/20',
  successProbability: '85%'
});

logger.logAgentActivity('DEV_SPRINTER', 'mission_complete', {
  project: 'api-monitoring-mvp',
  structure: 'complete',
  time: '15 minutes'
});

logger.logAgentActivity('FRONT_ARCHITECT', 'mission_started', {
  project: 'control-room',
  stack: 'React + 21st.dev',
  timeline: '30 minutes'
});

module.exports = logger;