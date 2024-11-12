import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Job } from '../types/types';

interface JobSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Omit<Job, 'id' | 'priority' | 'status' | 'progress'>) => void;
}

const jobTypes = [
  { id: 'compute', name: 'Compute Intensive', description: 'High CPU usage, ML training, data processing' },
  { id: 'memory', name: 'Memory Intensive', description: 'Large dataset analysis, in-memory databases' },
  { id: 'io', name: 'I/O Intensive', description: 'File operations, data transfer, backup tasks' },
  { id: 'batch', name: 'Batch Processing', description: 'Scheduled tasks, report generation' },
] as const;

const DEFAULT_RESOURCES = {
  cpu: 2,
  memory: 4,
  storage: 10
};

export default function JobSubmissionModal({ isOpen, onClose, onSubmit }: JobSubmissionModalProps) {
  const [jobName, setJobName] = useState('');
  const [jobType, setJobType] = useState<Job['type']>('compute');
  const [resources, setResources] = useState(DEFAULT_RESOURCES);

  if (!isOpen) return null;

  const handleResourceChange = (key: keyof typeof resources, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 1) {
      setResources(prev => ({ ...prev, [key]: numValue }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: jobName,
      type: jobType,
      resources,
      estimatedTime: Math.floor(Math.random() * 20) + 10, // Random time between 10-30 seconds
      createdAt: new Date()
    });
    setJobName('');
    setJobType('compute');
    setResources(DEFAULT_RESOURCES);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Submit New Job</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="jobName" className="block text-sm font-medium text-gray-700">
              Job Name
            </label>
            <input
              id="jobName"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              id="jobType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={jobType}
              onChange={(e) => setJobType(e.target.value as Job['type'])}
            >
              {jobTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Resources</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="cpuCores" className="block text-xs text-gray-500">
                  CPU Cores
                </label>
                <input
                  id="cpuCores"
                  type="number"
                  min="1"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={resources.cpu}
                  onChange={(e) => handleResourceChange('cpu', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="memory" className="block text-xs text-gray-500">
                  Memory (GB)
                </label>
                <input
                  id="memory"
                  type="number"
                  min="1"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={resources.memory}
                  onChange={(e) => handleResourceChange('memory', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="storage" className="block text-xs text-gray-500">
                  Storage (GB)
                </label>
                <input
                  id="storage"
                  type="number"
                  min="1"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={resources.storage}
                  onChange={(e) => handleResourceChange('storage', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Submit Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}