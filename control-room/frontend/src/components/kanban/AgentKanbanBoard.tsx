import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { KanbanColumn, AgentTask, TaskStatus, MovementHistory, Notification } from '../../types/kanban';
import { useWebSocket } from '../../contexts/WebSocketContext';
import KanbanColumnComponent from './KanbanColumn';
import AgentCard from './AgentCard';
import KanbanStats from './KanbanStats';
import { 
  Columns, 
  RefreshCw, 
  Search, 
  Plus, 
  Download,
  History
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Mock data
const mockColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', status: 'todo', color: 'text-vertex-blue', icon: '📋', wipLimit: 10, currentCount: 5 },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress', color: 'text-vertex-cyan', icon: '⚡', wipLimit: 6, currentCount: 3 },
  { id: 'review', title: 'Review', status: 'review', color: 'text-vertex-amber', icon: '👁️', wipLimit: 4, currentCount: 2 },
  { id: 'completed', title: 'Completed', status: 'completed', color: 'text-vertex-green', icon: '✅', currentCount: 8 },
];

const mockTasks: AgentTask[] = [
  { id: 'task-1', agentId: 'agent-1', agentName: 'VERTEX Core', agentType: 'ai', title: 'Data Pipeline Optimization', description: 'Optimize data processing pipeline', status: 'in-progress', priority: 'high', estimatedHours: 8, actualHours: 4, dependencies: [], assignee: 'BOSS', tags: ['optimization'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-2', agentId: 'agent-2', agentName: 'Data Processor', agentType: 'system', title: 'API Rate Limit', description: 'Implement rate limiting', status: 'todo', priority: 'medium', estimatedHours: 6, actualHours: 0, dependencies: [], assignee: 'System', tags: ['api'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-3', agentId: 'agent-3', agentName: 'ML Predictor', agentType: 'ai', title: 'Model Retraining', description: 'Retrain ML models', status: 'review', priority: 'critical', estimatedHours: 12, actualHours: 12, dependencies: [], assignee: 'AI Team', tags: ['ml'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-4', agentId: 'agent-4', agentName: 'API Gateway', agentType: 'system', title: 'Load Balancer', description: 'Configure load balancer', status: 'completed', priority: 'high', estimatedHours: 4, actualHours: 3.5, dependencies: [], assignee: 'DevOps', tags: ['infrastructure'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-5', agentId: 'agent-5', agentName: 'External API', agentType: 'external', title: 'Payment Integration', description: 'Integrate payment gateway', status: 'todo', priority: 'medium', estimatedHours: 10, actualHours: 2, dependencies: ['task-1'], assignee: 'Integration', tags: ['payments'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-6', agentId: 'agent-6', agentName: 'Security Monitor', agentType: 'system', title: 'Security Audit', description: 'Complete security audit', status: 'in-progress', priority: 'critical', estimatedHours: 16, actualHours: 8, dependencies: [], assignee: 'Security', tags: ['security'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-7', agentId: 'agent-7', agentName: 'Analytics Engine', agentType: 'ai', title: 'Dashboard', description: 'Build analytics dashboard', status: 'completed', priority: 'medium', estimatedHours: 20, actualHours: 18, dependencies: [], assignee: 'Data', tags: ['analytics'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'task-8', agentId: 'agent-8', agentName: 'Notification System', agentType: 'system', title: 'Push Notifications', description: 'Implement push service', status: 'review', priority: 'high', estimatedHours: 8, actualHours: 7.5, dependencies: ['task-4'], assignee: 'Mobile', tags: ['notifications'], createdAt: new Date(), updatedAt: new Date() },
];

const AgentKanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(mockColumns);
  const [tasks, setTasks] = useState<AgentTask[]>(mockTasks);
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isConnected, sendEvent } = useWebSocket();
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  }, [tasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
    
    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      setActiveTask(null);
      return;
    }
    
    // Different column - update status
    const task = tasks.find(t => t.id === activeId);
    if (task) {
      // Update task status
      setTasks(prev => prev.map(t => 
        t.id === activeId 
          ? { ...t, status: overContainer as TaskStatus, updatedAt: new Date() }
          : t
      ));
      
      // Update column counts
      setColumns(prev => prev.map(col => {
        if (col.status === task.status) {
          return { ...col, currentCount: Math.max(0, col.currentCount - 1) };
        }
        if (col.status === overContainer) {
          return { ...col, currentCount: col.currentCount + 1 };
        }
        return col;
      }));
      
      // Send WebSocket event
      sendEvent({
        type: 'task-moved',
        data: {
          taskId: activeId,
          fromColumn: task.status,
          toColumn: overContainer,
          agentName: task.agentName,
        },
      });
      
      // Show notification
      toast.success(`${task.agentName} moved to ${overContainer}`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#121218',
          color: '#00D4FF',
          border: '1px solid #2A2A35',
        },
      });

      // Voice announcement
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`${task.agentName} moved to ${overContainer}`);
        utterance.rate = 1.0;
        speechSynthesis.speak(utterance);
      }
    }
    
    setActiveTask(null);
  }, [tasks, sendEvent]);

  const findContainer = useCallback((id: string) => {
    if (columns.some(col => col.id === id)) {
      return id;
    }
    
    const task = tasks.find(t => t.id === id);
    return task?.status;
  }, [columns, tasks]);

  const filteredTasks = tasks.filter(task => 
    searchQuery === '' || 
    task.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTask = () => {
    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      agentId: `agent-${tasks.length + 1}`,
      agentName: `New Agent ${tasks.length + 1}`,
      agentType: 'ai',
      title: 'New Task',
      description: 'Task description',
      status: 'todo',
      priority: 'medium',
      estimatedHours: 4,
      actualHours: 0,
      dependencies: [],
      assignee: 'BOSS',
      tags: ['new'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks(prev => [...prev, newTask]);
    setColumns(prev => prev.map(col => 
      col.status === 'todo' 
        ? { ...col, currentCount: col.currentCount + 1 }
        : col
    ));
    
    toast.success('New task added to To Do column');
  };

  return (
    <div className="h-full flex flex-col">
      <Toaster />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Columns className="w-6 h-6 text-vertex-blue mr-3" />
              <h2 className="text-2xl font-bold">Agent Kanban Board</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-vertex-green/20 text-vertex-green' : 'bg-vertex-danger/20 text-vertex-danger'}`}>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-vertex-green animate-pulse' : 'bg-vertex-danger'}`} />
                  {isConnected ? 'Live' : 'Offline'}
                </div>
              </div>
              
              <div className="text-sm text-vertex-cyan/70">
                {tasks.length} agents • Drag & drop to move
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toast.success('Board refreshed')}
              className="p-2 border-gradient rounded-lg hover:bg-vertex-surface/30 transition-colors"
              title="Refresh board"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-vertex-blue text-white rounded-lg hover:bg-vertex-blue/90 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Agent
            </button>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vertex-cyan/50" />
              <input
                type="text"
                placeholder="Search agents or tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-vertex-surface border border-vertex-surface/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-vertex-blue w-64"
              />
            </div>
          </div>
          
          <div className="text-sm text-vertex-cyan/70">
            Drag agents between columns • Voice notifications enabled
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mb-6">
        <KanbanStats tasks={filteredTasks} columns={columns} />
      </div>
      
      {/* Main Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
            {columns.map(column => {
              const columnTasks = filteredTasks.filter(task => task.status === column.status);
              
              return (
                <KanbanColumnComponent
                  key={column.id}
                  column={column}
                  taskIds={columnTasks.map(t => t.id)}
                >
                  {columnTasks.map(task => (
                    <AgentCard key={task.id} task={task} />
                  ))}
                </KanbanColumnComponent>
              );
            })}
          </div>
          
          <DragOverlay>
            {activeTask && (
              <div className="rotate-3">
                <AgentCard task={activeTask} isOverlay />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      
      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-vertex-surface/50 text-sm text-vertex-cyan/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-vertex-green animate-pulse mr-2" />
            <span>Real-time updates via WebSocket</span>
          </div>
          <div>Voice notifications: Enabled</div>
        </div>
      </div>
    </div>
  );
};

export default AgentKanbanBoard;