import React, { useState } from 'react';
import { Play, Pause, Plus } from 'lucide-react';
import JobSubmissionModal from './JobSubmissionModal';
import { useScheduler } from '../hooks/useScheduler';
import { Job } from '../types/types';

export default function JobQueue() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { jobs, addJob, systemResources } = useScheduler();

  const handleJobSubmit = (jobData: Omit<Job, 'id' | 'priority' | 'status' | 'progress'>) => {
    try {
      addJob(jobData);
      setIsModalOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add job');
    }
  };

  const getPriorityColor = (priority: number) => {
    const colors = {
      1: 'bg-red-100 text-red-800',      // Highest priority
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-green-100 text-green-800',
      5: 'bg-blue-100 text-blue-800'     // Lowest priority
    };
    return colors[priority as keyof typeof colors] || colors[5];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Job Queue</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Available Resources:
            <span className="ml-2 font-medium">
              CPU: {systemResources.availableCPU}/{systemResources.totalCPU} cores
            </span>
            <span className="ml-2 font-medium">
              Memory: {systemResources.availableMemory}/{systemResources.totalMemory} GB
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Job
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{job.name}</p>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            job.status === 'running' ? 'bg-indigo-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {job.status === 'running' && (
                      <Pause className="h-5 w-5 text-gray-500" />
                    )}
                    {job.status === 'pending' && (
                      <Play className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                    Priority {job.priority}
                  </span>
                  <span className="capitalize">{job.status}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {job.type}
                  </span>
                  <span>CPU: {job.resources.cpu} cores</span>
                  <span>Memory: {job.resources.memory}GB</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <JobSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleJobSubmit}
      />
    </div>
  );
}