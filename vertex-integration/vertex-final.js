// 🎯 VERTEX Control Room - Frontend Application (continuação)

// Atualizar tempo
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    if (currentTimeElement) {
        currentTimeElement.textContent = `JARVIS-Evolved Control Room • ${dateString} • ${timeString} GMT-3 • v1.1.0`;
    }
}

// Renderizar Kanban Board
function renderKanbanBoard(agents) {
    const columns = {
        'todo': { title: 'To Do', agents: [] },
        'in_progress': { title: 'In Progress', agents: [] },
        'review': { title: 'Review', agents: [] },
        'completed': { title: 'Completed', agents: [] }
    };
    
    // Agrupar agents por coluna
    agents.forEach(agent => {
        if (columns[agent.column]) {
            columns[agent.column].agents.push(agent);
        }
    });
    
    // Renderizar colunas
    kanbanBoard.innerHTML = '';
    
    Object.entries(columns).forEach(([columnId, column]) => {
        const columnElement = document.createElement('div');
        columnElement.className = 'kanban-column';
        
        const titleElement = document.createElement('div');
        titleElement.className = 'column-title';
        titleElement.textContent = column.title;
        columnElement.appendChild(titleElement);
        
        // Renderizar cards de agents
        column.agents.forEach(agent => {
            const cardElement = document.createElement('div');
            cardElement.className = `agent-card ${agent.status}`;
            cardElement.innerHTML = `
                <div class="agent-name">${agent.name}</div>
                <div class="agent-task">${agent.task}</div>
                <span class="agent-status">${agent.status === 'completed' ? '✅ ' : ''}${agent.time}</span>
            `;
            columnElement.appendChild(cardElement);
        });
        
        kanbanBoard.appendChild(columnElement);
    });
}

// Renderizar métricas
function renderMetrics(metrics) {
    metricsGrid.innerHTML = '';
    
    const metricItems = [
        { label: 'Agents Complete', value: metrics.agents_complete },
        { label: 'Projected ROI', value: metrics.roi },
        { label: 'Success Probability', value: metrics.success_probability },
        { label: 'Risk Score', value: metrics.risk_score }
    ];
    
    metricItems.forEach(item => {
        const metricElement = document.createElement('div');
        metricElement.className = 'metric';
        metricElement.innerHTML = `
            <div class="metric-value">${item.value}</div>
            <div class="metric-label">${item.label}</div>
        `;
        metricsGrid.appendChild(metricElement);
    });
}

// Renderizar progresso da missão
function renderMissionProgress(mission) {
    missionProgress.innerHTML = '';
    
    mission.forEach(item => {
        const missionItem = document.createElement('div');
        missionItem.style.marginBottom = '1rem';
        
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.marginBottom = '0.5rem';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        
        const progressSpan = document.createElement('span');
        progressSpan.style.color = item.color;
        progressSpan.textContent = item.progress === 100 ? '✅ 100%' : `${item.progress}%`;
        
        header.appendChild(nameSpan);
        header.appendChild(progressSpan);
        
        const progressBar = document.createElement('div');
        progressBar.style.height = '8px';
        progressBar.style.background = 'rgba(30, 41, 59, 0.5)';
        progressBar.style.borderRadius = '4px';
        progressBar.style.overflow = 'hidden';
        
        const progressFill = document.createElement('div');
        progressFill.style.width = `${item.progress}%`;
        progressFill.style.height = '100%';
        progressFill.style.background = item.color;
        
        progressBar.appendChild(progressFill);
        
        missionItem.appendChild(header);
        missionItem.appendChild(progressBar);
        missionProgress.appendChild(missionItem);
    });
}

// Tentar carregar dados da API
async function loadAPIData() {
    try {
        apiStatusElement.textContent = '📡 API: Connecting...';
        apiStatusElement.style.background = 'rgba(245, 158, 11, 0.9)';
        
        // Tentar carregar status
        const statusResponse = await fetch('/vertex/status');
        if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            
            // Atualizar status do sistema
            systemStatusElement.textContent = `🟢 ${statusData.status}`;
            welcomeMessageElement.textContent = `"${statusData.message}"`;
            
            apiStatusElement.textContent = '📡 API: Connected';
            apiStatusElement.style.background = 'rgba(6, 214, 160, 0.9)';
            
            // Tentar carregar agents
            try {
                const agentsResponse = await fetch('/vertex/api/agents');
                if (agentsResponse.ok) {
                    const agentsData = await agentsResponse.json();
                    renderKanbanBoard(agentsData.agents);
                    return true;
                }
            } catch (e) {
                console.log('Agents API failed, using static data');
            }
            
            return true;
        }
    } catch (error) {
        console.log('API failed, using static data:', error);
    }
    
    // Fallback para dados estáticos
    apiStatusElement.textContent = '📡 API: Using Static Data';
    apiStatusElement.style.background = 'rgba(239, 68, 68, 0.9)';
    
    systemStatusElement.textContent = '🟢 SYSTEM OPERATIONAL (STATIC)';
    welcomeMessageElement.textContent = `"${staticData.system.message}"`;
    
    renderKanbanBoard(staticData.agents);
    renderMetrics(staticData.metrics);
    renderMissionProgress(staticData.mission);
    
    return false;
}

// Rotação de comandos de voz
const voiceCommands = [
    '"VERTEX, show agent status"',
    '"VERTEX, deploy to production"',
    '"VERTEX, mission report"',
    '"VERTEX, system diagnostics"',
    '"Good morning, BOSS"',
    '"VERTEX, initiate Week 1 execution"'
];

let commandIndex = 0;
function rotateVoiceCommand() {
    commandIndex = (commandIndex + 1) % voiceCommands.length;
    voiceCommandElement.textContent = voiceCommands[commandIndex];
    
    // Animar ícone
    const voiceIcon = document.querySelector('.voice-icon');
    voiceIcon.style.animation = 'none';
    setTimeout(() => {
        voiceIcon.style.animation = 'pulse 2s infinite';
    }, 10);
}

// Inicializar
async function initialize() {
    console.log('%c🎯 VERTEX Nexus Control Room v1.1.0', 'color: #0ea5e9; font-size: 16px; font-weight: bold;');
    console.log('%cSystem: DOMAIN-INTEGRATED | Agents: 9/9 Complete | ROI: 376x', 'color: #06d6a0;');
    console.log('%c"Good morning, BOSS. System 100% integrated and operational."', 'color: #8b5cf6; font-style: italic;');
    
    // Atualizar tempo imediatamente e a cada segundo
    updateTime();
    setInterval(updateTime, 1000);
    
    // Carregar dados
    await loadAPIData();
    
    // Renderizar dados estáticos (fallback ou complemento)
    renderMetrics(staticData.metrics);
    renderMissionProgress(staticData.mission);
    
    // Iniciar rotação de comandos de voz
    setInterval(rotateVoiceCommand, 3000);
    
    // Adicionar interação de drag & drop simulada
    const agentCards = document.querySelectorAll('.agent-card');
    agentCards.forEach(card => {
        card.addEventListener('mousedown', function() {
            this.style.opacity = '0.7';
            this.style.cursor = 'grabbing';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.opacity = '1';
            this.style.cursor = 'grab';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            this.style.cursor = 'grab';
        });
    });
    
    // Mostrar notificação de inicialização
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(14, 165, 233, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            z-index: 10000;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            animation: slideDown 0.5s ease;
        `;
        notification.textContent = '🎯 VERTEX Control Room Active';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }, 1000);
    
    // Adicionar CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}