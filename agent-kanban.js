// Agent Kanban System for VERTEX Control Room
const fs = require('fs');
const path = require('path');

class AgentKanban {
  constructor() {
    this.kanbanFile = path.join(__dirname, 'memory', 'agent-kanban.json');
    this.ensureKanbanFile();
    this.currentAgents = this.loadKanban();
  }

  ensureKanbanFile() {
    if (!fs.existsSync(this.kanbanFile)) {
      const initialKanban = {
        columns: {
          'todo': ['SECURITY_ARCHITECT'],
          'in_progress': [
            'FRONT_ARCHITECT_V2',
            'BUSINESS_STRATEGIST', 
            'MARKETING_OPERATIONS',
            'CUSTOMER_SUCCESS',
            'SOCIAL_MEDIA_MANAGER'
          ],
          'review': ['MARKET_HUNTER', 'TECH_EVALUATOR'],
          'completed': ['DEV_SPRINTER']
        },
        agents: {
          'VERTEX': { status: 'system', column: 'system', lastUpdate: new Date().toISOString() },
          'MARKET_HUNTER': { 
            status: 'completed', 
            column: 'review',
            task: 'Market Research',
            timeEstimate: '4 minutes',
            actualTime: '4 minutes',
            completionTime: new Date().toISOString(),
            dependencies: [],
            lastUpdate: new Date().toISOString()
          },
          'TECH_EVALUATOR': { 
            status: 'completed', 
            column: 'review',
            task: 'Technical Feasibility Analysis',
            timeEstimate: '30 minutes',
            actualTime: '4 minutes',
            completionTime: new Date().toISOString(),
            dependencies: ['MARKET_HUNTER'],
            lastUpdate: new Date().toISOString()
          },
          'DEV_SPRINTER': { 
            status: 'completed', 
            column: 'completed',
            task: 'MVP Structure Creation',
            timeEstimate: '15 minutes',
            actualTime: '15 minutes',
            completionTime: new Date().toISOString(),
            dependencies: ['TECH_EVALUATOR'],
            lastUpdate: new Date().toISOString()
          },
          'FRONT_ARCHITECT_V2': { 
            status: 'in_progress', 
            column: 'in_progress',
            task: 'VERTEX Control Room JARVIS-evolved',
            timeEstimate: '45 minutes',
            timeRemaining: '40 minutes',
            dependencies: [],
            lastUpdate: new Date().toISOString()
          },
          'BUSINESS_STRATEGIST': { 
            status: 'in_progress', 
            column: 'in_progress',
            task: 'Complete Business Plan',
            timeEstimate: '60 minutes',
            timeRemaining: '60 minutes',
            dependencies: ['MARKET_HUNTER', 'TECH_EVALUATOR'],
            lastUpdate: new Date().toISOString()
          },
          'MARKETING_OPERATIONS': { 
            status: 'in_progress', 
            column: 'in_progress',
            task: 'Marketing & Sales Strategy',
            timeEstimate: '60 minutes',
            timeRemaining: '60 minutes',
            dependencies: ['BUSINESS_STRATEGIST'],
            lastUpdate: new Date().toISOString()
          },
          'CUSTOMER_SUCCESS': { 
            status: 'in_progress', 
            column: 'in_progress',
            task: 'Customer Success Program',
            timeEstimate: '60 minutes',
            timeRemaining: '60 minutes',
            dependencies: ['BUSINESS_STRATEGIST'],
            lastUpdate: new Date().toISOString()
          },
          'SOCIAL_MEDIA_MANAGER': { 
            status: 'in_progress', 
            column: 'in_progress',
            task: 'Social Media Strategy',
            timeEstimate: '60 minutes',
            timeRemaining: '60 minutes',
            dependencies: ['MARKETING_OPERATIONS'],
            lastUpdate: new Date().toISOString()
          },
          'SECURITY_ARCHITECT': { 
            status: 'todo', 
            column: 'todo',
            task: 'System Security Hardening',
            timeEstimate: '120 minutes',
            dependencies: ['DEV_SPRINTER'],
            lastUpdate: new Date().toISOString()
          }
        },
        history: [],
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(this.kanbanFile, JSON.stringify(initialKanban, null, 2));
    }
  }

  loadKanban() {
    return JSON.parse(fs.readFileSync(this.kanbanFile, 'utf8'));
  }

  saveKanban() {
    this.currentAgents.lastUpdated = new Date().toISOString();
    fs.writeFileSync(this.kanbanFile, JSON.stringify(this.currentAgents, null, 2));
  }

  moveAgent(agentName, fromColumn, toColumn) {
    if (!this.currentAgents.columns[fromColumn] || !this.currentAgents.columns[toColumn]) {
      throw new Error(`Invalid column: ${fromColumn} -> ${toColumn}`);
    }

    // Remove from old column
    this.currentAgents.columns[fromColumn] = this.currentAgents.columns[fromColumn].filter(a => a !== agentName);
    
    // Add to new column
    if (!this.currentAgents.columns[toColumn].includes(agentName)) {
      this.currentAgents.columns[toColumn].push(agentName);
    }

    // Update agent status
    if (this.currentAgents.agents[agentName]) {
      this.currentAgents.agents[agentName].column = toColumn;
      this.currentAgents.agents[agentName].lastUpdate = new Date().toISOString();
      
      // Update status based on column
      const statusMap = {
        'todo': 'pending',
        'in_progress': 'active',
        'review': 'review',
        'completed': 'completed'
      };
      
      this.currentAgents.agents[agentName].status = statusMap[toColumn] || 'unknown';
    }

    // Add to history
    this.currentAgents.history.push({
      timestamp: new Date().toISOString(),
      agent: agentName,
      from: fromColumn,
      to: toColumn,
      action: 'move'
    });

    // Keep history limited to last 100 entries
    if (this.currentAgents.history.length > 100) {
      this.currentAgents.history = this.currentAgents.history.slice(-100);
    }

    this.saveKanban();
    return true;
  }

  updateAgentProgress(agentName, progress) {
    if (this.currentAgents.agents[agentName]) {
      this.currentAgents.agents[agentName].progress = progress;
      this.currentAgents.agents[agentName].lastUpdate = new Date().toISOString();
      this.saveKanban();
      return true;
    }
    return false;
  }

  completeAgentTask(agentName, result = {}) {
    if (this.currentAgents.agents[agentName]) {
      this.currentAgents.agents[agentName].status = 'completed';
      this.currentAgents.agents[agentName].completionTime = new Date().toISOString();
      this.currentAgents.agents[agentName].result = result;
      this.currentAgents.agents[agentName].lastUpdate = new Date().toISOString();
      
      // Move to completed column
      this.moveAgent(agentName, this.currentAgents.agents[agentName].column, 'completed');
      
      return true;
    }
    return false;
  }

  getKanbanData() {
    return this.currentAgents;
  }

  getAgentStatus(agentName) {
    return this.currentAgents.agents[agentName] || null;
  }

  getAllAgentsStatus() {
    return this.currentAgents.agents;
  }

  getColumnAgents(column) {
    return this.currentAgents.columns[column] || [];
  }

  getHistory() {
    return this.currentAgents.history;
  }
}

// Singleton instance
const kanban = new AgentKanban();

module.exports = kanban;