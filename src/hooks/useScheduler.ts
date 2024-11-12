import { create } from 'zustand';
import { Job } from '../types/types';

interface SchedulerState {
  isRunning: boolean;
  timeQuantum: number;
  maxJobsPerNode: number;
  cpuUtilization: number;
  jobs: Job[];
  availableNodes: number;
  activeJobs: number;
  systemResources: {
    totalCPU: number;
    availableCPU: number;
    totalMemory: number;
    availableMemory: number;
    totalStorage: number;
    availableStorage: number;
  };
  setRunning: (running: boolean) => void;
  setTimeQuantum: (quantum: number) => void;
  setMaxJobsPerNode: (max: number) => void;
  addJob: (job: Omit<Job, 'id' | 'priority' | 'status' | 'progress'>) => void;
  updateMetrics: () => void;
}

const JOB_TYPE_WEIGHTS = {
  compute: 4,
  memory: 3,
  io: 2,
  batch: 1
};

const MAX_ACTIVE_JOBS = 3;

const calculatePriority = (job: Omit<Job, 'id' | 'priority' | 'status' | 'progress'>, existingJobs: Job[]): number => {
  const resourceScore = (
    (job.resources.cpu / 8) +
    (job.resources.memory / 16) +
    (job.resources.storage / 100)
  ) / 3;

  const profitScore = JOB_TYPE_WEIGHTS[job.type] / 4;
  const efficiency = profitScore / resourceScore;
  
  let basePriority = Math.max(1, Math.min(5, Math.round(6 - efficiency * 5)));
  
  // Ensure no duplicate priority 1
  if (basePriority === 1 && existingJobs.some(j => j.priority === 1)) {
    basePriority = 2;
  }
  
  const existingPriorities = new Set(existingJobs.map(j => j.priority));
  let priority = basePriority;
  
  // Find next available priority level
  while (existingPriorities.has(priority)) {
    priority = priority >= 5 ? 5 : priority + 1;
  }
  
  return priority;
};

const INITIAL_SYSTEM_RESOURCES = {
  totalCPU: 32,
  availableCPU: 32,
  totalMemory: 128,
  availableMemory: 128,
  totalStorage: 1000,
  availableStorage: 1000
};

const startJob = (
  job: Job, 
  resources: typeof INITIAL_SYSTEM_RESOURCES
): [Job, typeof INITIAL_SYSTEM_RESOURCES] => {
  const updatedResources = {
    ...resources,
    availableCPU: resources.availableCPU - job.resources.cpu,
    availableMemory: resources.availableMemory - job.resources.memory,
    availableStorage: resources.availableStorage - job.resources.storage
  };

  const updatedJob = {
    ...job,
    status: 'running' as const,
    startedAt: new Date(),
    progress: 0
  };

  return [updatedJob, updatedResources];
};

export const useScheduler = create<SchedulerState>((set, get) => ({
  isRunning: false,
  timeQuantum: 100,
  maxJobsPerNode: 5,
  cpuUtilization: 0,
  jobs: [],
  availableNodes: 15,
  activeJobs: 0,
  systemResources: { ...INITIAL_SYSTEM_RESOURCES },

  setRunning: (running) => set({ isRunning: running }),
  setTimeQuantum: (timeQuantum) => set({ timeQuantum }),
  setMaxJobsPerNode: (maxJobsPerNode) => set({ maxJobsPerNode }),

  addJob: (jobData) => {
    const state = get();
    const { systemResources, jobs } = state;

    if (
      jobData.resources.cpu > systemResources.totalCPU ||
      jobData.resources.memory > systemResources.totalMemory ||
      jobData.resources.storage > systemResources.totalStorage
    ) {
      throw new Error('Job requires more resources than system capacity');
    }

    const priority = calculatePriority(jobData, jobs);
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      priority,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };

    set((state) => ({
      jobs: [...state.jobs, newJob].sort((a, b) => a.priority - b.priority)
    }));
  },

  updateMetrics: () => {
    set((state) => {
      let updatedResources = { ...state.systemResources };
      let completedJobIds = new Set<string>();

      // Update running jobs and identify completed ones
      const updatedJobs = state.jobs.map(job => {
        if (job.status === 'running') {
          const progressIncrement = 100 / (job.estimatedTime * 10);
          const newProgress = Math.min(100, job.progress + progressIncrement);
          
          if (newProgress >= 100) {
            completedJobIds.add(job.id);
            // Release resources immediately
            updatedResources = {
              ...updatedResources,
              availableCPU: updatedResources.availableCPU + job.resources.cpu,
              availableMemory: updatedResources.availableMemory + job.resources.memory,
              availableStorage: updatedResources.availableStorage + job.resources.storage
            };
            return {
              ...job,
              progress: 100,
              status: 'completed',
              completedAt: new Date()
            };
          }
          
          return {
            ...job,
            progress: newProgress
          };
        }
        return job;
      });

      // Get active jobs (excluding completed ones)
      const activeJobs = updatedJobs.filter(job => !completedJobIds.has(job.id));
      
      // Get current running and pending jobs
      const runningJobs = activeJobs.filter(job => job.status === 'running');
      const pendingJobs = activeJobs
        .filter(job => job.status === 'pending')
        .sort((a, b) => a.priority - b.priority);

      // Calculate how many new jobs we can start
      const slotsAvailable = MAX_ACTIVE_JOBS - runningJobs.length;
      
      // Process jobs to start
      let currentResources = updatedResources;
      const finalJobs = activeJobs.map(job => {
        if (job.status === 'pending' && pendingJobs.includes(job)) {
          // Check if we can start this job
          const canStart = 
            slotsAvailable > 0 &&
            job.resources.cpu <= currentResources.availableCPU &&
            job.resources.memory <= currentResources.availableMemory &&
            job.resources.storage <= currentResources.availableStorage;

          if (canStart) {
            const [updatedJob, newResources] = startJob(job, currentResources);
            currentResources = newResources;
            return updatedJob;
          }
        }
        return job;
      });

      const runningJobsCount = finalJobs.filter(job => job.status === 'running').length;
      const cpuUtilization = ((INITIAL_SYSTEM_RESOURCES.totalCPU - currentResources.availableCPU) / 
        INITIAL_SYSTEM_RESOURCES.totalCPU) * 100;

      return {
        jobs: finalJobs,
        systemResources: currentResources,
        cpuUtilization,
        activeJobs: runningJobsCount
      };
    });
  }
}));