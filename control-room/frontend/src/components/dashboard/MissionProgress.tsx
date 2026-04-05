import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, PlayCircle, Target, Flag, Calendar, Users, TrendingUp, Award } from 'lucide-react';
import { Mission, Milestone } from '../../types/vertex';

const MissionProgress: React.FC = () => {
  const [missions] = useState<Mission[]>([
    {
      id: '1',
      title: 'VERTEX Control Room Launch',
      description: 'Deploy immersive JARVIS-style interface with 3D visualization and voice control',
      status: 'in-progress',
      startDate: new Date('2026-03-20'),
      endDate: new Date('2026-04-10'),
      progress: 85,
      milestones: [
        { id: 'm1', title: 'Design System', description: 'Create VERTEX theme and holographic UI', status: 'completed', date: new Date('2026-03-22') },
        { id: 'm2', title: '3D Visualization', description: 'Implement agent network in Three.js', status: 'completed', date: new Date('2026-03-28') },
        { id: 'm3', title: 'Voice Interface', description: 'Integrate Web Speech API with JARVIS persona', status: 'completed', date: new Date('2026-04-02') },
        { id: 'm4', title: 'Predictive Analytics', description: 'Build forecasting dashboard', status: 'in-progress', date: new Date('2026-04-05') },
        { id: 'm5', title: 'Deployment', description: 'Launch to production environment', status: 'pending', date: new Date('2026-04-10') },
      ],
    },
    {
      id: '2',
      title: 'AI Agent Network Expansion',
      description: 'Scale from 5 to 15 specialized AI agents with autonomous coordination',
      status: 'planned',
      startDate: new Date('2026-04-15'),
      endDate: new Date('2026-05-30'),
      progress: 10,
      milestones: [
        { id: 'm6', title: 'Architecture Design', description: 'Design scalable agent communication protocol', status: 'pending', date: new Date('2026-04-15') },
        { id: 'm7', title: 'Agent Development', description: 'Build 10 new specialized agents', status: 'pending', date: new Date('2026-05-10') },
        { id: 'm8', title: 'Integration Testing', description: 'Test coordination and failover mechanisms', status: 'pending', date: new Date('2026-05-25') },
      ],
    },
    {
      id: '3',
      title: 'Revenue System Integration',
      description: 'Connect VERTEX to automated revenue streams and financial tracking',
      status: 'planned',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-06-15'),
      progress: 5,
      milestones: [
        { id: 'm9', title: 'API Integration', description: 'Connect payment and analytics APIs', status: 'pending', date: new Date('2026-05-01') },
        { id: 'm10', title: 'Dashboard', description: 'Build financial tracking interface', status: 'pending', date: new Date('2026-05-20') },
        { id: 'm11', title: 'Automation', description: 'Implement automated revenue optimization', status: 'pending', date: new Date('2026-06-10') },
      ],
    },
  ]);

  const [activeMission, setActiveMission] = useState<Mission>(missions[0]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-vertex-green" />;
      case 'in-progress': return <PlayCircle className="w-5 h-5 text-vertex-blue" />;
      case 'planned': return <Clock className="w-5 h-5 text-vertex-amber" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-vertex-danger" />;
      default: return <Clock className="w-5 h-5 text-vertex-cyan" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-vertex-green';
      case 'in-progress': return 'text-vertex-blue';
      case 'planned': return 'text-vertex-amber';
      case 'failed': return 'text-vertex-danger';
      default: return 'text-vertex-cyan';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-vertex-green/20';
      case 'in-progress': return 'bg-vertex-blue/20';
      case 'planned': return 'bg-vertex-amber/20';
      case 'failed': return 'bg-vertex-danger/20';
      default: return 'bg-vertex-cyan/20';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Target className="w-5 h-5 text-vertex-blue mr-2" />
          <h3 className="text-lg font-semibold">Mission Timeline</h3>
        </div>
        <div className="text-sm text-vertex-cyan/70">
          {missions.filter(m => m.status === 'completed').length} of {missions.length} completed
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission List */}
        <div className="lg:col-span-2 space-y-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-xl border-gradient cursor-pointer transition-all hover:scale-[1.02] ${activeMission.id === mission.id ? 'bg-vertex-surface/50' : 'hover:bg-vertex-surface/30'}`}
              onClick={() => setActiveMission(mission)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(mission.status)}
                    <h4 className="font-semibold">{mission.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(mission.status)} ${getStatusColor(mission.status)}`}>
                      {mission.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-vertex-cyan/80 mb-3">{mission.description}</p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold">{mission.progress}%</div>
                  <div className="text-xs text-vertex-cyan/70">Progress</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-vertex-cyan/70">
                    {formatDate(mission.startDate)} - {formatDate(mission.endDate)}
                  </span>
                  <span className="text-vertex-cyan">
                    {calculateDaysRemaining(mission.endDate)} days remaining
                  </span>
                </div>
                <div className="h-2 bg-vertex-surface rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${mission.status === 'completed' ? 'bg-vertex-green' : mission.status === 'in-progress' ? 'bg-vertex-blue' : 'bg-vertex-amber'}`}
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium">{mission.milestones.filter(m => m.status === 'completed').length}</div>
                  <div className="text-xs text-vertex-cyan/70">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{mission.milestones.filter(m => m.status === 'pending').length}</div>
                  <div className="text-xs text-vertex-cyan/70">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{mission.milestones.length}</div>
                  <div className="text-xs text-vertex-cyan/70">Total</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Mission Details */}
        <div className="lg:col-span-1">
          <div className="holographic-glass rounded-xl p-5 h-full">
            <div className="h-full flex flex-col">
              {/* Mission Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getStatusBgColor(activeMission.status)} ${getStatusColor(activeMission.status)}`}>
                    {getStatusIcon(activeMission.status)}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gradient">
                      {activeMission.progress}%
                    </div>
                    <div className="text-sm text-vertex-cyan/70">Complete</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{activeMission.title}</h3>
                <p className="text-vertex-cyan/80 mb-4">{activeMission.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-vertex-surface/30">
                    <div className="text-xs text-vertex-cyan/70 mb-1">Start Date</div>
                    <div className="font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(activeMission.startDate)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-vertex-surface/30">
                    <div className="text-xs text-vertex-cyan/70 mb-1">End Date</div>
                    <div className="font-medium flex items-center">
                      <Flag className="w-4 h-4 mr-2" />
                      {formatDate(activeMission.endDate)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="flex-1 overflow-y-auto">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Milestones
                </h4>
                <div className="space-y-3">
                  {activeMission.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className={`p-3 rounded-lg ${milestone.status === 'completed' ? 'bg-vertex-green/10 border border-vertex-green/20' : 'bg-vertex-surface/30'}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1 mr-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${milestone.status === 'completed' ? 'bg-vertex-green text-white' : 'bg-vertex-surface/50 text-vertex-cyan'}`}>
                            {milestone.status === 'completed' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-bold">{index + 1}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-sm">{milestone.title}</div>
                            <div className="text-xs text-vertex-cyan/70">
                              {formatDate(milestone.date)}
                            </div>
                          </div>
                          <p className="text-xs text-vertex-cyan/70">{milestone.description}</p>
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${milestone.status === 'completed' ? 'bg-vertex-green/20 text-vertex-green' : 'bg-vertex-amber/20 text-vertex-amber'}`}>
                              {milestone.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 mt-6 border-t border-vertex-surface/50">
                <div className="text-sm font-medium mb-3">Mission Actions</div>
                <div className="space-y-2">
                  {activeMission.status === 'in-progress' && (
                    <>
                      <button className="w-full text-sm px-4 py-2 bg-vertex-blue text-white rounded-lg hover:bg-vertex-blue/90 transition-colors">
                        Update Progress
                      </button>
                      <button className="w-full text-sm px-4 py-2 border border-vertex-surface/50 rounded-lg hover:bg-vertex-surface/30 transition-colors">
                        Add Milestone
                      </button>
                    </>
                  )}
                  {activeMission.status === 'planned' && (
                    <button className="w-full text-sm px-4 py-2 bg-vertex-green text-white rounded-lg hover:bg-vertex-green/90 transition-colors">
                      Start Mission
                    </button>
                  )}
                  <button className="w-full text-sm px-4 py-2 border border-vertex-surface/50 rounded-lg hover:bg-vertex-surface/30 transition-colors">
                    View Detailed Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mt-6 pt-6 border-t border-vertex-surface/50">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-vertex-blue">
              {missions.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-xs text-vertex-cyan/70">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-vertex-cyan">
              {missions.filter(m => m.status === 'in-progress').length}
            </div>
            <div className="text-xs text-vertex-cyan/70">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-vertex-amber">
              {missions.filter(m => m.status === 'planned').length}
            </div>
            <div className="text-xs text-vertex-cyan/70">Planned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">
              {Math.round(missions.reduce((sum, m) => sum + m.progress, 0) / missions.length)}%
            </div>
            <div className="text-xs text-vertex-cyan/70">Avg Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionProgress;