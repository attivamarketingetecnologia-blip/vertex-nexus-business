export interface Agent {
  id: string;
  name: string;
  type: 'ai' | 'system' | 'external';
  status: 'active' | 'idle' | 'error' | 'offline';
  cpu: number;
  memory: number;
  lastActive: Date;
  position: { x: number; y: number; z: number };
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  category: 'performance' | 'security' | 'opportunity' | 'risk';
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'failed';
  startDate: Date;
  endDate: Date;
  progress: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  date: Date;
}

export interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  description: string;
  category: 'system' | 'navigation' | 'data' | 'communication';
}

export interface ThreeDNode {
  id: string;
  type: 'agent' | 'data' | 'service';
  position: [number, number, number];
  size: number;
  color: string;
  connections: string[];
  data?: any;
}

export interface PredictiveData {
  timestamp: Date;
  value: number;
  predicted: number;
  confidence: number;
}

export interface SystemStatus {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    api: ComponentStatus;
    database: ComponentStatus;
    agents: ComponentStatus;
    network: ComponentStatus;
  };
  uptime: number;
  lastUpdated: Date;
}

export interface ComponentStatus {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  lastCheck: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  action?: string;
}

export interface UserPreferences {
  voiceEnabled: boolean;
  voiceGender: 'male' | 'female';
  voiceRate: number;
  theme: 'dark' | 'light' | 'auto';
  animations: boolean;
  notifications: boolean;
  autoInsights: boolean;
}