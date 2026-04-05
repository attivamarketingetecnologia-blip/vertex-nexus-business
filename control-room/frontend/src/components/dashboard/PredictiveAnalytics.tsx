import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Target, Zap, Calendar, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Legend } from 'recharts';
import { PredictiveData } from '../../types/vertex';

const PredictiveAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [metric, setMetric] = useState('cpu');

  // Generate predictive data
  const generatePredictiveData = (): PredictiveData[] => {
    const data: PredictiveData[] = [];
    const now = new Date();
    const baseValue = 50;
    
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() + i * 3600000);
      const trend = Math.sin(i / 4) * 15;
      const noise = (Math.random() - 0.5) * 10;
      const value = baseValue + trend + noise;
      const predicted = value + (Math.random() - 0.5) * 8;
      const confidence = 85 + Math.random() * 10;
      
      data.push({
        timestamp,
        value: Math.max(0, Math.min(100, value)),
        predicted: Math.max(0, Math.min(100, predicted)),
        confidence: Math.max(70, Math.min(99, confidence)),
      });
    }
    
    return data;
  };

  const predictiveData = generatePredictiveData();
  
  // KPI metrics
  const kpis = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Prediction Accuracy',
      value: '92.4%',
      change: '+2.1%',
      trend: 'up',
      color: 'text-vertex-green',
      bgColor: 'bg-vertex-green/20',
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Forecast Horizon',
      value: '24h',
      change: 'Optimal',
      trend: 'stable',
      color: 'text-vertex-blue',
      bgColor: 'bg-vertex-blue/20',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Anomalies Detected',
      value: '3',
      change: '-1',
      trend: 'down',
      color: 'text-vertex-amber',
      bgColor: 'bg-vertex-amber/20',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'down',
      color: 'text-vertex-cyan',
      bgColor: 'bg-vertex-cyan/20',
    },
  ];

  // Risk factors
  const riskFactors = [
    { name: 'CPU Overload', probability: 15, impact: 'High', trend: 'down' },
    { name: 'Memory Leak', probability: 8, impact: 'Medium', trend: 'stable' },
    { name: 'Network Latency', probability: 22, impact: 'Medium', trend: 'up' },
    { name: 'API Failure', probability: 5, impact: 'Critical', trend: 'down' },
    { name: 'Storage Capacity', probability: 12, impact: 'Low', trend: 'stable' },
  ];

  // Recommendations
  const recommendations = [
    'Scale CPU resources by 15% within 4 hours',
    'Optimize database queries to reduce memory usage',
    'Implement caching for frequently accessed API endpoints',
    'Schedule maintenance during low-traffic period (02:00-04:00)',
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-vertex-cyan" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-vertex-surface border border-vertex-surface/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vertex-blue"
            >
              <option value="1h">1 Hour</option>
              <option value="6h">6 Hours</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-vertex-cyan" />
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="bg-vertex-surface border border-vertex-surface/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vertex-blue"
            >
              <option value="cpu">CPU Usage</option>
              <option value="memory">Memory</option>
              <option value="network">Network</option>
              <option value="response">Response Time</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-vertex-cyan/70">
          Last updated: Just now
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="border-gradient rounded-xl p-4 hover:bg-vertex-surface/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bgColor} ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${kpi.trend === 'up' ? 'bg-vertex-green/20 text-vertex-green' : kpi.trend === 'down' ? 'bg-vertex-cyan/20 text-vertex-cyan' : 'bg-vertex-amber/20 text-vertex-amber'}`}>
                {kpi.change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{kpi.value}</div>
            <div className="text-sm text-vertex-cyan/70">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main Predictive Chart */}
      <div className="border-gradient rounded-xl p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">24-Hour Forecast</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-vertex-blue mr-2" />
              <span className="text-sm text-vertex-cyan/70">Actual</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-vertex-purple mr-2" />
              <span className="text-sm text-vertex-cyan/70">Predicted</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-vertex-green/50 mr-2" />
              <span className="text-sm text-vertex-cyan/70">Confidence</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictiveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#666"
                tickFormatter={(value) => new Date(value).getHours() + ':00'}
              />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121218',
                  border: '1px solid #2A2A35',
                  borderRadius: '8px',
                }}
                labelFormatter={(value) => `Time: ${new Date(value).getHours()}:00`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0066FF"
                fill="url(#colorActual)"
                strokeWidth={2}
                name="Actual"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#8A2BE2"
                fill="url(#colorPredicted)"
                strokeWidth={2}
                name="Predicted"
              />
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="#00FF88"
                fill="url(#colorConfidence)"
                strokeWidth={1}
                strokeDasharray="3 3"
                name="Confidence"
                opacity={0.3}
              />
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Analysis & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="border-gradient rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-vertex-surface/30 hover:bg-vertex-surface/50 transition-colors">
                <div>
                  <div className="font-medium text-sm">{risk.name}</div>
                  <div className="text-xs text-vertex-cyan/70 mt-1">
                    Impact: <span className={risk.impact === 'Critical' ? 'text-vertex-danger' : risk.impact === 'High' ? 'text-vertex-amber' : 'text-vertex-cyan'}>{risk.impact}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{risk.probability}%</div>
                  <div className="text-xs text-vertex-cyan/70 flex items-center justify-end">
                    {risk.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-vertex-danger mr-1" />
                    ) : risk.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3 text-vertex-green mr-1" />
                    ) : null}
                    Probability
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-vertex-surface/50">
            <div className="text-sm text-vertex-cyan/70 mb-2">Overall Risk Level</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-vertex-green">Low</div>
              <div className="text-sm text-vertex-cyan/70">All systems within acceptable parameters</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="border-gradient rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-vertex-surface/30 hover:bg-vertex-surface/50 transition-colors border-l-4 border-vertex-blue"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-vertex-blue/20 text-vertex-blue flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{rec}</p>
                    <div className="flex items-center mt-2">
                      <div className="text-xs px-2 py-1 bg-vertex-green/20 text-vertex-green rounded mr-2">
                        High Impact
                      </div>
                      <div className="text-xs text-vertex-cyan/70">
                        Estimated savings: 15-20%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-vertex-surface/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Implementation Priority</div>
                <div className="text-xs text-vertex-cyan/70">Based on cost-benefit analysis</div>
              </div>
              <button className="px-4 py-2 bg-vertex-blue text-white rounded-lg hover:bg-vertex-blue/90 transition-colors text-sm">
                Apply All Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;