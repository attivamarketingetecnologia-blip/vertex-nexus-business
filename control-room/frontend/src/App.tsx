import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Mic, Volume2, Cpu, Server, Zap, Globe, Database, Shield, Columns } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Components
import VoiceInterface from './components/voice/VoiceInterface';
import HUDOverlay from './components/layout/HUDOverlay';
import AgentNetwork3D from './components/threejs/AgentNetwork3D';
import PredictiveAnalytics from './components/dashboard/PredictiveAnalytics';
import AIInsights from './components/dashboard/AIInsights';
import SystemMetrics from './components/dashboard/SystemMetrics';
import MissionProgress from './components/dashboard/MissionProgress';
import AgentKanbanBoard from './components/kanban/AgentKanbanBoard';

// Contexts
import { WebSocketProvider } from './contexts/WebSocketContext';

// Types
import { Agent, SystemStatus, Notification } from './types/vertex';

// Mock data
const mockAgents: Agent[] = [
  { id: '1', name: 'VERTEX Core', type: 'ai', status: 'active', cpu: 45, memory: 68, lastActive: new Date(), position: { x: 0, y: 0, z: 0 } },
  { id: '2', name: 'Data Processor', type: 'system', status: 'active', cpu: 32, memory: 45, lastActive: new Date(), position: { x: 2, y: 1, z: -1 } },
  { id: '3', name: 'API Gateway', type: 'system', status: 'active', cpu: 28, memory: 52, lastActive: new Date(), position: { x: -2, y: 0, z: 1 } },
  { id: '4', name: 'ML Predictor', type: 'ai', status: 'idle', cpu: 15, memory: 30, lastActive: new Date(), position: { x: 1, y: -1, z: 2 } },
  { id: '5', name: 'External API', type: 'external', status: 'active', cpu: 22, memory: 40, lastActive: new Date(), position: { x: -1, y: 2, z: -2 } },
];

const mockSystemStatus: SystemStatus = {
  overall: 'healthy',
  components: {
    api: { status: 'healthy', message: 'All APIs responding', lastCheck: new Date() },
    database: { status: 'healthy', message: 'Connection stable', lastCheck: new Date() },
    agents: { status: 'healthy', message: '5/5 agents active', lastCheck: new Date() },
    network: { status: 'healthy', message: 'Latency: 24ms', lastCheck: new Date() },
  },
  uptime: 99.8,
  lastUpdated: new Date(),
};

function App() {
  const [agents] = useState<Agent[]>(mockAgents);
  const [systemStatus] = useState<SystemStatus>(mockSystemStatus);
  const [voiceActive, setVoiceActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'System Check', message: 'All systems operational', type: 'success', timestamp: new Date(), read: false },
    { id: '2', title: 'Data Update', message: 'New insights generated', type: 'info', timestamp: new Date(), read: false },
    { id: '3', title: 'Performance', message: 'CPU usage optimal', type: 'info', timestamp: new Date(), read: true },
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleVoice = () => {
    setVoiceActive(!voiceActive);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-vertex-dark text-white overflow-hidden">
      {/* Background 3D Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
          <color attach="background" args={['#0A0A0F']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#0066FF" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8A2BE2" />
          <AgentNetwork3D agents={agents} />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* HUD Overlay */}
        <HUDOverlay 
          systemStatus={systemStatus}
          currentTime={currentTime}
          notifications={notifications}
          onNotificationRead={(id) => {
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
          }}
        />

        {/* Voice Interface */}
        <VoiceInterface active={voiceActive} onToggle={toggleVoice} />

        {/* Main Header */}
        <header className="p-6 border-b border-vertex-surface/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gradient">
                  VERTEX <span className="text-vertex-cyan">Control Room</span>
                </h1>
                <p className="text-vertex-cyan/80 mt-2">
                  {getGreeting()}, <span className="font-semibold text-vertex-green">BOSS</span>. All systems operational.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleVoice}
                  className={`p-3 rounded-lg border-gradient transition-all duration-300 ${voiceActive ? 'bg-vertex-blue/20' : 'hover:bg-vertex-surface/50'}`}
                >
                  {voiceActive ? (
                    <Volume2 className="w-6 h-6 text-vertex-cyan" />
                  ) : (
                    <Mic className="w-6 h-6 text-vertex-purple" />
                  )}
                </button>
                <div className="text-right">
                  <div className="text-sm text-vertex-cyan/70">Local Time</div>
                  <div className="text-xl font-mono">{format(currentTime, 'HH:mm:ss')}</div>
                  <div className="text-sm text-vertex-purple/70">{format(currentTime, 'EEE, MMM dd, yyyy')}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* System Metrics */}
            <div className="lg:col-span-2">
              <div className="holographic-glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Cpu className="w-6 h-6 mr-3 text-vertex-blue" />
                    System Metrics
                  </h2>
                  <div className={`px-3 py-1 rounded-full ${systemStatus.overall === 'healthy' ? 'bg-vertex-green/20 text-vertex-green' : 'bg-vertex-danger/20 text-vertex-danger'}`}>
                    {systemStatus.overall.toUpperCase()}
                  </div>
                </div>
                <SystemMetrics agents={agents} systemStatus={systemStatus} />
              </div>
            </div>

            {/* AI Insights */}
            <div>
              <div className="holographic-glass rounded-2xl p-6 h-full">
                <h2 className="text-2xl font-bold flex items-center mb-6">
                  <Zap className="w-6 h-6 mr-3 text-vertex-amber" />
                  AI Insights
                </h2>
                <AIInsights />
              </div>
            </div>

            {/* Predictive Analytics */}
            <div className="lg:col-span-2">
              <div className="holographic-glass rounded-2xl p-6">
                <h2 className="text-2xl font-bold flex items-center mb-6">
                  <Globe className="w-6 h-6 mr-3 text-vertex-purple" />
                  Predictive Analytics
                </h2>
                <PredictiveAnalytics />
              </div>
            </div>

            {/* Mission Progress */}
            <div>
              <div className="holographic-glass rounded-2xl p-6 h-full">
                <h2 className="text-2xl font-bold flex items-center mb-6">
                  <Database className="w-6 h-6 mr-3 text-vertex-cyan" />
                  Mission Timeline
                </h2>
                <MissionProgress />
              </div>
            </div>

            {/* Agent Status Grid */}
            <div className="xl:col-span-3">
              <div className="holographic-glass rounded-2xl p-6">
                <h2 className="text-2xl font-bold flex items-center mb-6">
                  <Server className="w-6 h-6 mr-3 text-vertex-blue" />
                  Agent Network Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="border-gradient rounded-xl p-4 hover:bg-vertex-surface/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold">{agent.name}</div>
                        <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-vertex-green' : agent.status === 'idle' ? 'bg-vertex-amber' : 'bg-vertex-danger'}`} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-vertex-cyan/70">CPU</span>
                          <span className="font-mono">{agent.cpu}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-vertex-cyan/70">Memory</span>
                          <span className="font-mono">{agent.memory}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-vertex-cyan/70">Type</span>
                          <span className="text-vertex-purple">{agent.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="holographic-glass rounded-2xl p-6">
              <AgentKanbanBoard />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="p-6 border-t border-vertex-surface/50 mt-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between text-sm text-vertex-cyan/70">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>VERTEX Nexus • Secure Connection • v1.1.0</span>
                <span className="mx-2">•</span>
                <span className="text-vertex-green">Kanban Board: Active</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>Uptime: {systemStatus.uptime}%</span>
                <span>•</span>
                <span>View: {activeView === 'dashboard' ? 'Dashboard' : 'Kanban'}</span>
                <span>•</span>
                <span>Last Updated: {format(systemStatus.lastUpdated, 'HH:mm:ss')}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Scan Line Effect */}
      <div className="scan-line" />
      
      {/* Particle Effects */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            '--tx': `${Math.random() * 200 - 100}px`,
            '--ty': `${Math.random() * 200 - 100}px`,
            top: `${Math.random() * 100}vh`,
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 5}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <WebSocketProvider>
      <MainApp />
    </WebSocketProvider>
  );
}

export default App;