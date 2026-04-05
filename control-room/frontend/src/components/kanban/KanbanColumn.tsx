import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn as KanbanColumnType, TaskStatus } from '../../types/kanban';
import { AlertCircle, CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface KanbanColumnProps {
  column: KanbanColumnType;
  taskIds: string[];
  children: React.ReactNode;
  isOverlay?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  taskIds, 
  children,
  isOverlay = false 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      status: column.status,
    },
  });

  const getColumnIcon = () => {
    switch (column.status) {
      case 'todo':
        return <Clock className="w-5 h-5" />;
      case 'in-progress':
        return <PlayCircle className="w-5 h-5" />;
      case 'review':
        return <AlertCircle className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getColumnGradient = () => {
    switch (column.status) {
      case 'todo':
        return 'from-vertex-blue/20 to-vertex-blue/5';
      case 'in-progress':
        return 'from-vertex-cyan/20 to-vertex-cyan/5';
      case 'review':
        return 'from-vertex-amber/20 to-vertex-amber/5';
      case 'completed':
        return 'from-vertex-green/20 to-vertex-green/5';
      default:
        return 'from-vertex-purple/20 to-vertex-purple/5';
    }
  };

  const getColumnBorder = () => {
    if (isOverlay) return 'border-2 border-dashed border-vertex-cyan/50';
    if (isOver) return 'border-2 border-vertex-cyan';
    return 'border border-vertex-surface/50';
  };

  const getWipStatus = () => {
    if (!column.wipLimit) return null;
    
    const percentage = (column.currentCount / column.wipLimit) * 100;
    
    if (percentage >= 100) {
      return (
        <div className="text-xs text-vertex-danger font-medium">
          WIP Limit Exceeded!
        </div>
      );
    } else if (percentage >= 80) {
      return (
        <div className="text-xs text-vertex-amber font-medium">
          Near WIP Limit ({column.currentCount}/{column.wipLimit})
        </div>
      );
    }
    
    return (
      <div className="text-xs text-vertex-cyan/70">
        {column.currentCount}/{column.wipLimit}
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col h-full
        rounded-2xl
        ${getColumnBorder()}
        bg-gradient-to-b ${getColumnGradient()}
        transition-all duration-200
        ${isOver ? 'scale-[1.02]' : ''}
        ${isOverlay ? 'opacity-90' : ''}
      `}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-vertex-surface/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${column.color}`}>
              {getColumnIcon()}
            </div>
            <div>
              <h3 className="font-bold text-lg">{column.title}</h3>
              <div className="text-sm text-vertex-cyan/70">
                {taskIds.length} {taskIds.length === 1 ? 'agent' : 'agents'}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">{taskIds.length}</div>
            {getWipStatus()}
          </div>
        </div>
        
        {/* Progress Bar */}
        {column.wipLimit && (
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-vertex-cyan/70">WIP Progress</span>
              <span className="font-medium">
                {Math.round((column.currentCount / column.wipLimit) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-vertex-surface/50 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  column.currentCount >= column.wipLimit 
                    ? 'bg-vertex-danger' 
                    : column.currentCount >= column.wipLimit * 0.8
                    ? 'bg-vertex-amber'
                    : 'bg-vertex-cyan'
                }`}
                style={{ 
                  width: `${Math.min(100, (column.currentCount / column.wipLimit) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 min-h-[200px]">
            {children}
            
            {/* Empty State */}
            {taskIds.length === 0 && !isOver && (
              <div className="flex flex-col items-center justify-center h-48 text-vertex-cyan/50">
                <div className="text-4xl mb-2">📋</div>
                <div className="text-sm font-medium">No agents in this column</div>
                <div className="text-xs mt-1">Drag agents here to assign</div>
              </div>
            )}
            
            {/* Drop Hint */}
            {isOver && taskIds.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-vertex-cyan/30 rounded-xl">
                <div className="text-vertex-cyan/50 text-4xl mb-2">⬇️</div>
                <div className="text-vertex-cyan/70 font-medium">Drop agent here</div>
              </div>
            )}
          </div>
        </SortableContext>
      </div>

      {/* Column Footer */}
      <div className="p-3 border-t border-vertex-surface/30 text-xs text-vertex-cyan/70">
        <div className="flex items-center justify-between">
          <span>Drag to reorder</span>
          <span className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${column.color.replace('text-', 'bg-')}`} />
            {column.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;