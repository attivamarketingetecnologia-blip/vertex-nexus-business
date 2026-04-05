import React from 'react';
import { KanbanColumn, AgentTask } from '../../types/kanban';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Zap, Users } from 'lucide-react';

interface KanbanStatsProps {
  tasks: AgentTask[];
  columns: KanbanColumn[];
}

const KanbanStats: React.FC<KanbanStatsProps> = ({ tasks, columns }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;
  
  const totalEstimatedHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const totalActualHours = tasks.reduce((sum, t) => sum + t.actualHours, 0);
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const averageCompletionTime = completedTasks > 0 
    ? tasks
        .filter(t => t.status === 'completed' && t.completedAt && t.createdAt)
        .reduce((sum, t) => {
          const completionTime = t.completedAt!.getTime() - t.createdAt.getTime();
          return sum + (completionTime / (1000 * 60 * 60)); // Convert to hours
        }, 0) / completedTasks
    : 0;
  
  const throughput = completedTasks; // Tasks completed (simplified)
  
  const priorityBreakdown = {
    critical: tasks.filter(t => t.priority === 'critical').length,
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };

  const stats = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Total Agents',
      value: totalTasks.toString(),
      color: 'text-vertex-blue',
      bgColor: 'bg-vertex-blue/20',
      change: '+2 this week',
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Completed',
      value: completedTasks.toString(),
      color: 'text-vertex-green',
      bgColor: 'bg-vertex-green/20',
      change: `${completionRate.toFixed(1)}% rate`,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'In Progress',
      value: inProgressTasks.toString(),
      color: 'text-vertex-cyan',
      bgColor: 'bg-vertex-cyan/20',
      change: `${columns.find(c => c.status === 'in-progress')?.currentCount || 0}/${columns.find(c => c.status === 'in-progress')?.wipLimit || '∞'}`,
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Overdue',
      value: overdueTasks.toString(),
      color: 'text-vertex-danger',
      bgColor: 'bg-vertex-danger/20',
      change: overdueTasks > 0 ? 'Needs attention' : 'All on track',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Avg Completion',
      value: `${averageCompletionTime.toFixed(1)}h`,
      color: 'text-vertex-amber',
      bgColor: 'bg-vertex-amber/20',
      change: 'Last 30 days',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Throughput',
      value: `${throughput}`,
      color: 'text-vertex-purple',
      bgColor: 'bg-vertex-purple/20',
      change: 'Tasks completed',
    },
  ];

  return (
    <div className="border-gradient rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Kanban Statistics</h3>
        <div className="text-sm text-vertex-cyan/70">
          Updated just now
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-vertex-surface/30 hover:bg-vertex-surface/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-vertex-cyan/70">{stat.change}</div>
              </div>
            </div>
            <div className="text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Progress Bars */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-vertex-cyan/70">Priority Distribution</span>
            <span className="font-medium">Total: {totalTasks}</span>
          </div>
          <div className="space-y-2">
            {Object.entries(priorityBreakdown).map(([priority, count]) => {
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              const color = priority === 'critical' ? 'bg-vertex-danger' :
                           priority === 'high' ? 'bg-vertex-amber' :
                           priority === 'medium' ? 'bg-vertex-blue' : 'bg-vertex-cyan';
              
              return (
                <div key={priority} className="flex items-center">
                  <div className="w-20 text-xs text-vertex-cyan/70 capitalize">
                    {priority}
                  </div>
                  <div className="flex-1 ml-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{count} tasks</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-vertex-surface/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-vertex-cyan/70">Time Investment</span>
            <span className="font-medium">
              {totalActualHours.toFixed(1)}h / {totalEstimatedHours.toFixed(1)}h
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-vertex-cyan/70">Estimated vs Actual</span>
                <span className="font-medium">
                  {((totalActualHours / totalEstimatedHours) * 100).toFixed(1)}% utilized
                </span>
              </div>
              <div className="h-2 bg-vertex-surface/50 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-vertex-blue to-vertex-cyan"
                  style={{ width: `${Math.min(100, (totalActualHours / totalEstimatedHours) * 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-vertex-cyan/70">Column Distribution</span>
                <span className="font-medium">By count</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden">
                {columns.map(col => {
                  const count = tasks.filter(t => t.status === col.status).length;
                  const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
                  
                  let color = 'bg-vertex-blue';
                  if (col.status === 'in-progress') color = 'bg-vertex-cyan';
                  if (col.status === 'review') color = 'bg-vertex-amber';
                  if (col.status === 'completed') color = 'bg-vertex-green';
                  
                  return (
                    <div
                      key={col.id}
                      className={`h-full ${color}`}
                      style={{ width: `${percentage}%` }}
                      title={`${col.title}: ${count} agents`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs mt-1">
                {columns.map(col => {
                  const count = tasks.filter(t => t.status === col.status).length;
                  return (
                    <span key={col.id} className="text-vertex-cyan/70">
                      {col.title}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanStats;