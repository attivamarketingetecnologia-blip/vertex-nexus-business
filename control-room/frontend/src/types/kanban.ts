export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AgentTask {
  id: string;
  agentId: string;
  agentName: string;
  agentType: 'ai' | 'system' | 'external';
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  assignee: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: TaskStatus;
  color: string;
  icon: string;
  maxItems?: number;
  wipLimit?: number;
  currentCount: number;
}

export interface MovementHistory {
  id: string;
  taskId: string;
  agentId: string;
  agentName: string;
  fromColumn: string;
  toColumn: string;
  movedBy: string;
  timestamp: Date;
  notes?: string;
}

export interface SocketEvent {
  type: 'task-moved' | 'task-created' | 'task-updated' | 'task-deleted' | 'history-added' | 'notification';
  data: any;
  timestamp: Date;
  userId?: string;
}

export interface KanbanStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  averageCompletionTime: number;
  throughput: number;
}

export interface DragData {
  taskId: string;
  fromColumn: TaskStatus;
  agentName: string;
}

export interface Notification {
  id: string;
  type: 'task-moved' | 'task-completed' | 'task-overdue' | 'dependency-resolved';
  title: string;
  message: string;
  agentName?: string;
  taskId?: string;
  timestamp: Date;
  read: boolean;
  action?: string;
}