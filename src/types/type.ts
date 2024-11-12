export interface Job {
  id: string;
  name: string;
  type: 'compute' | 'memory' | 'io' | 'batch';
  priority: number;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  actualTime?: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Node {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  resources: {
    totalCPU: number;
    availableCPU: number;
    totalMemory: number;
    availableMemory: number;
    totalStorage: number;
    availableStorage: number;
  };
  currentJobs: string[];
  performance: number;
  uptime: number;
}
