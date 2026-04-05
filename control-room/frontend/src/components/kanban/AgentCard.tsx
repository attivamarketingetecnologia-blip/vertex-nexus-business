import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AgentTask, TaskPriority } from '../../types/kanban';
import { 
  Clock, 
  User, 
  Link, 
  AlertCircle, 
  CheckCircle, 
  MoreVertical,
  Zap,
  Cpu,
  Server,
  Globe
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AgentCardProps {
  task: AgentTask;
  isOverlay?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ task, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return 'bg-vertex-danger/20 text-vertex-danger border-vertex-danger/30';
      case 'high':
        return 'bg-vertex-amber/20 text-vertex-amber border-vertex-amber/30';
      case 'medium':
        return 'bg-vertex-blue/20 text-vertex-blue border-vertex-blue/30';
      case 'low':
        return 'bg-vertex-cyan/20 text-vertex-cyan border-vertex-cyan/30';
      default:
        return 'bg-vertex-surface/50 text-vertex-cyan border-vertex-surface/50';
    }
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'ai':
        return <Zap className="w-4 h-4" />;
      case 'system':
        return <Server className="w-4 h-4" />;
      case 'external':
        return <Globe className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const getTimeRemaining = () => {
    if (task.status === 'completed') {
      return 'Completed';
    }
    
    const hoursRemaining = task.estimatedHours - task.actualHours;
    if (hoursRemaining <= 0) {
      return 'Overdue';
    }
    
    return `${hoursRemaining}h remaining`;
  };

  const getProgressPercentage = () => {
    if (task.estimatedHours === 0) return 0;
    return Math.min(100, (task.actualHours / task.estimatedHours) * 100);
  };

  const getTimeStatus = () => {
    const progress = getProgressPercentage();
    
    if (task.status === 'completed') {
      return 'text-vertex-green';
    }
    
    if (progress >= 100) {
      return 'text-vertex-danger';
    }
    
    if (progress >= 75) {
      return 'text-vertex-amber';
    }
    
    return 'text-vertex-cyan';
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative
        rounded-xl
        border
        ${getPriorityColor(task.priority)}
        bg-gradient-to-br from-vertex-surface/30 to-vertex-surface/10
        backdrop-blur-sm
        cursor-grab
        active:cursor-grabbing
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95 rotate-1 shadow-2xl' : ''}
        ${isOver ? 'scale-[1.02] border-vertex-cyan' : ''}
        ${isOverlay ? 'shadow-2xl rotate-3' : ''}
        hover:shadow-lg hover:scale-[1.01]
      `}
    >
      {/* Card Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1.5 rounded-lg ${getPriorityColor(task.priority).replace('border-', 'bg-').replace('/30', '/20')}`}>
                {getAgentIcon(task.agentType)}
              </div>
              <div>
                <div className="font-bold text-sm">{task.agentName}</div>
                <div className="text-xs text-vertex-cyan/70 capitalize">{task.agentType}</div>
              </div>
            </div>
            
            <h4 className="font-semibold text-sm mb-1 line-clamp-2">{task.title}</h4>
            <p className="text-xs text-vertex-cyan/80 line-clamp-2">{task.description}</p>
          </div>
          
          <button className="p-1 hover:bg-vertex-surface/30 rounded">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-vertex-cyan/70">Progress</span>
            <span className={`font-medium ${getTimeStatus()}`}>
              {getProgressPercentage().toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 bg-vertex-surface/30 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                task.status === 'completed' ? 'bg-vertex-green' :
                getProgressPercentage() >= 100 ? 'bg-vertex-danger' :
                getProgressPercentage() >= 75 ? 'bg-vertex-amber' :
                'bg-vertex-blue'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-vertex-cyan/70" />
            <span className={getTimeStatus()}>{getTimeRemaining()}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3 text-vertex-cyan/70" />
            <span className="text-vertex-cyan/80">{task.assignee}</span>
          </div>
        </div>

        {/* Dependencies */}
        {task.dependencies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-vertex-surface/30">
            <div className="flex items-center space-x-1 mb-1">
              <Link className="w-3 h-3 text-vertex-cyan/70" />
              <span className="text-xs text-vertex-cyan/70">Depends on:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {task.dependencies.slice(0, 2).map((dep, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-vertex-surface/50 text-vertex-cyan/80 rounded text-xs"
                >
                  {dep}
                </span>
              ))}
              {task.dependencies.length > 2 && (
                <span className="px-2 py-0.5 bg-vertex-surface/50 text-vertex-cyan/80 rounded text-xs">
                  +{task.dependencies.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-vertex-blue/10 text-vertex-blue text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="absolute top-3 right-3">
        {task.status === 'completed' ? (
          <CheckCircle className="w-4 h-4 text-vertex-green" />
        ) : task.status === 'review' ? (
          <AlertCircle className="w-4 h-4 text-vertex-amber" />
        ) : null}
      </div>

      {/* Drag Handle */}
      <div className="absolute bottom-3 right-3 opacity-50">
        <div className="flex space-x-1">
          <div className="w-1 h-1 rounded-full bg-vertex-cyan/50" />
          <div className="w-1 h-1 rounded-full bg-vertex-cyan/50" />
          <div className="w-1 h-1 rounded-full bg-vertex-cyan/50" />
        </div>
      </div>

      {/* Time Badge */}
      <div className="absolute top-3 left-3">
        <div className="text-xs px-2 py-0.5 bg-vertex-surface/50 text-vertex-cyan/70 rounded">
          {formatTime(task.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;