import React, { useEffect } from 'react';
import { Play, Pause, RefreshCw, Settings } from 'lucide-react';
import { useScheduler } from '../hooks/useScheduler';

export default function SchedulerControls() {
  const {
    isRunning,
    timeQuantum,
    maxJobsPerNode,
    setRunning,
    setTimeQuantum,
    setMaxJobsPerNode,
    updateMetrics
  } = useScheduler();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isRunning) {
      // Update immediately when starting
      updateMetrics();
      // Then set up interval for continuous updates every 100ms
      interval = setInterval(updateMetrics, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, updateMetrics]);

  const handleReset = () => {
    setRunning(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setRunning(!isRunning)}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Stop Scheduler
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Scheduler
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Scheduler Settings</h3>
          <button className="p-1 rounded-full hover:bg-gray-200">
            <Settings className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time Quantum (ms)
            </label>
            <input
              type="number"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
              min={100}
              max={1000}
              step={100}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Jobs Per Node
            </label>
            <input
              type="number"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={maxJobsPerNode}
              onChange={(e) => setMaxJobsPerNode(parseInt(e.target.value))}
              min={1}
              max={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}