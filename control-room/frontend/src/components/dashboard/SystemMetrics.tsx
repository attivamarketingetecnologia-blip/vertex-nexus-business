import React from 'react';
import { Cpu, MemoryStick, Network, HardDrive, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Agent, SystemStatus } from '../../types/vertex';

interface SystemMetricsProps {
  agents: Agent[];
  systemStatus: SystemStatus;
}

const SystemMetrics: React.FC<SystemMetricsProps> = ({ agents, systemStatus }) => {
  // Generate mock time-series data
  const generateTimeSeriesData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 12; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60000); // 5 minute intervals
      data.push({
        time: time.getMinutes(),
        cpu: 30 + Math.random() * 40,
        memory: 40 + Math.random() * 30,
        network: 20 + Math.random() * 50,
        temperature: 45 + Math.random() * 15,
      });
    }
    
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();
  
  // Calculate overall metrics
  const overallCPU = agents.reduce((sum, agent) => sum + agent.cpu, 0) / agents.length;
  const overallMemory = agents.reduce((sum, agent) => sum + agent.memory, 0) / agents.length;
  const activeAgents = agents.filter(a => a.status === 'active').length;

  const metrics = [
    {
      icon: <Cpu className="w-5 h-5" />,
      label: 'CPU Usage',
      value: `${overallCPU.toFixed(1)}%`,
      color: 'text-vertex-blue',
      bgColor: 'bg-vertex-blue/20',
      trend: overallCPU > 70 ? 'up' : overallCPU < 30 ? 'down' : 'stable',
      change: '+2.3%',
    },
    {
      icon: <MemoryStick className="w-5 h-5" />,
      label: 'Memory',
      value: `${overallMemory.toFixed(1)}%`,
      color: 'text-vertex-purple',
      bgColor: 'bg-vertex-purple/20',
      trend: 'stable',
      change: '+1.1%',
    },
    {
      icon: <Network className="w-5 h-5" />,
      label: 'Network',
      value: '24ms',
      color: 'text-vertex-cyan',
      bgColor: 'bg-vertex-cyan/20',
      trend: 'down',
      change: '-5ms',
    },
    {
      icon: <HardDrive className="w-5 h-5" />,
      label: 'Storage',
      value: '68%',
      color: 'text-vertex-green',
      bgColor: 'bg-vertex-green/20',
      trend: 'up',
      change: '+3.2%',
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Active Agents',
      value: `${activeAgents}/${agents.length}`,
      color: 'text-vertex-amber',
      bgColor: 'bg-vertex-amber/20',
      trend: 'stable',
      change: 'All systems',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="border-gradient rounded-xl p-4 hover:bg-vertex-surface/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${metric.bgColor} ${metric.color}`}>
                {metric.icon}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${metric.trend === 'up' ? 'bg-vertex-danger/20 text-vertex-danger' : metric.trend === 'down' ? 'bg-vertex-green/20 text-vertex-green' : 'bg-vertex-cyan/20 text-vertex-cyan'}`}>
                {metric.change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className="text-sm text-vertex-cyan/70">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Time Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Memory Chart */}
        <div className="border-gradient rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666" 
                  tickFormatter={(value) => `${value}m`}
                />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121218',
                    border: '1px solid #2A2A35',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#00D4FF' }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#0066FF"
                  fill="url(#colorCpu)"
                  strokeWidth={2}
                  name="CPU %"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke="#8A2BE2"
                  fill="url(#colorMemory)"
                  strokeWidth={2}
                  name="Memory %"
                />
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-vertex-blue mr-2" />
              <span className="text-sm text-vertex-cyan/70">CPU Usage</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-vertex-purple mr-2" />
              <span className="text-sm text-vertex-cyan/70">Memory</span>
            </div>
          </div>
        </div>

        {/* Network & Temperature Chart */}
        <div className="border-gradient rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Network & Health</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666" 
                  tickFormatter={(value) => `${value}m`}
                />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121218',
                    border: '1px solid #2A2A35',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#00D4FF' }}
                />
                <Line
                  type="monotone"
                  dataKey="network"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  name="Network (ms)"
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#FFAA00"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-vertex-cyan mr-2" />
              <span className="text-sm text-vertex-cyan/70">Latency</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-vertex-amber mr-2" />
              <span className="text-sm text-vertex-cyan/70">Temperature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Component Status */}
      <div className="border-gradient rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">Component Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(systemStatus.components).map(([key, component]) => (
            <div
              key={key}
              className="p-4 rounded-lg bg-vertex-surface/30 hover:bg-vertex-surface/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium capitalize">{key}</div>
                <div className={`w-2 h-2 rounded-full ${component.status === 'healthy' ? 'bg-vertex-green' : component.status === 'warning' ? 'bg-vertex-amber' : 'bg-vertex-danger'}`} />
              </div>
              <div className="text-xs text-vertex-cyan/70 mb-2">{component.message}</div>
              <div className="text-xs text-vertex-purple/70">
                Last check: {component.lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;