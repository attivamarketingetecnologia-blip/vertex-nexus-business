import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, AlertTriangle, Lightbulb, Shield, Clock, ChevronRight } from 'lucide-react';
import { Insight } from '../../types/vertex';

const AIInsights: React.FC = () => {
  const [insights] = useState<Insight[]>([
    {
      id: '1',
      title: 'CPU Optimization Opportunity',
      description: 'Agent #3 showing consistent 15% idle time. Consider redistributing workload.',
      confidence: 92,
      category: 'performance',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      priority: 'medium',
    },
    {
      id: '2',
      title: 'Network Latency Spike Detected',
      description: 'Unusual 45ms increase in API response times between 14:30-15:00.',
      confidence: 87,
      category: 'performance',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      priority: 'high',
    },
    {
      id: '3',
      title: 'Security Pattern Identified',
      description: 'New authentication pattern matches 99% of legitimate requests.',
      confidence: 95,
      category: 'security',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      priority: 'medium',
    },
    {
      id: '4',
      title: 'Data Processing Efficiency',
      description: 'Batch processing could reduce memory usage by 23% during peak hours.',
      confidence: 88,
      category: 'opportunity',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      priority: 'low',
    },
    {
      id: '5',
      title: 'Predictive Maintenance Alert',
      description: 'Storage subsystem showing early signs of performance degradation.',
      confidence: 76,
      category: 'risk',
      timestamp: new Date(Date.now() - 18000000), // 5 hours ago
      priority: 'high',
    },
  ]);

  const [activeInsight, setActiveInsight] = useState<Insight | null>(insights[0]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'opportunity': return <Lightbulb className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'text-vertex-blue';
      case 'security': return 'text-vertex-green';
      case 'opportunity': return 'text-vertex-amber';
      case 'risk': return 'text-vertex-danger';
      default: return 'text-vertex-cyan';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-vertex-blue/20';
      case 'security': return 'bg-vertex-green/20';
      case 'opportunity': return 'bg-vertex-amber/20';
      case 'risk': return 'bg-vertex-danger/20';
      default: return 'bg-vertex-cyan/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-vertex-danger';
      case 'medium': return 'text-vertex-amber';
      case 'low': return 'text-vertex-cyan';
      default: return 'text-vertex-cyan';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-vertex-amber mr-2" />
          <span className="text-sm font-medium">Auto-generated Insights</span>
        </div>
        <div className="text-xs text-vertex-cyan/70">
          Updated just now
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Insight List */}
        <div className="lg:col-span-2 space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-xl border-gradient cursor-pointer transition-all hover:scale-[1.02] ${activeInsight?.id === insight.id ? 'bg-vertex-surface/50' : 'hover:bg-vertex-surface/30'}`}
              onClick={() => setActiveInsight(insight)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${getCategoryBgColor(insight.category)} ${getCategoryColor(insight.category)}`}>
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)} ${getPriorityColor(insight.priority).replace('text-', 'bg-')}/20`}>
                          {insight.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-vertex-cyan/70 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {getTimeAgo(insight.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-vertex-cyan/80 line-clamp-2">
                    {insight.description}
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 ml-2 ${activeInsight?.id === insight.id ? 'text-vertex-cyan' : 'text-vertex-cyan/50'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Active Insight Detail */}
        <div className="lg:col-span-1">
          <div className="holographic-glass rounded-xl p-5 h-full">
            {activeInsight ? (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${getCategoryBgColor(activeInsight.category)} ${getCategoryColor(activeInsight.category)}`}>
                      {getCategoryIcon(activeInsight.category)}
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gradient">
                        {activeInsight.confidence}%
                      </div>
                      <div className="text-sm text-vertex-cyan/70">Confidence</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{activeInsight.title}</h3>
                  <p className="text-vertex-cyan/80 mb-6">{activeInsight.description}</p>
                </div>

                <div className="mt-auto space-y-4">
                  {/* Confidence Meter */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-vertex-cyan/70">Confidence Level</span>
                      <span className="font-medium">{activeInsight.confidence}%</span>
                    </div>
                    <div className="h-2 bg-vertex-surface rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${activeInsight.confidence > 90 ? 'bg-vertex-green' : activeInsight.confidence > 75 ? 'bg-vertex-amber' : 'bg-vertex-danger'}`}
                        style={{ width: `${activeInsight.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-vertex-surface/30">
                      <div className="text-xs text-vertex-cyan/70 mb-1">Category</div>
                      <div className={`font-medium ${getCategoryColor(activeInsight.category)}`}>
                        {activeInsight.category.charAt(0).toUpperCase() + activeInsight.category.slice(1)}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-vertex-surface/30">
                      <div className="text-xs text-vertex-cyan/70 mb-1">Priority</div>
                      <div className={`font-medium ${getPriorityColor(activeInsight.priority)}`}>
                        {activeInsight.priority.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-vertex-surface/50">
                    <div className="text-xs text-vertex-cyan/70 mb-3">Recommended Actions</div>
                    <div className="space-y-2">
                      <button className="w-full text-sm px-4 py-2 bg-vertex-blue/20 text-vertex-blue rounded-lg hover:bg-vertex-blue/30 transition-colors">
                        Implement Suggestion
                      </button>
                      <button className="w-full text-sm px-4 py-2 border border-vertex-surface/50 rounded-lg hover:bg-vertex-surface/30 transition-colors">
                        Schedule for Review
                      </button>
                      <button className="w-full text-sm px-4 py-2 border border-vertex-surface/50 rounded-lg hover:bg-vertex-surface/30 transition-colors">
                        Dismiss Insight
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-vertex-cyan/70">
                Select an insight to view details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 pt-4 border-t border-vertex-surface/50">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-vertex-blue">5</div>
            <div className="text-xs text-vertex-cyan/70">Total Insights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-vertex-green">92%</div>
            <div className="text-xs text-vertex-cyan/70">Avg Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-vertex-amber">2</div>
            <div className="text-xs text-vertex-cyan/70">High Priority</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;