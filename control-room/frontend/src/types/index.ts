export interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  progress: number;
  role: string;
  lastActive: Date;
  cpuUsage: number;
  memoryUsage: number;
}

export interface Mission {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  phase: string;
  progress: number;
  startDate: Date;
  endDate?: Date;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SystemMetric {
  timestamp: Date;
  cpu: number;
  memory: number;
  networkIn: number;
  networkOut: number;
  diskUsage: number;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface FinancialProjection {
  month: string;
  target: number;
  actual: number;
  projection: number;
}