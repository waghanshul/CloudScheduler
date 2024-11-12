import React from 'react';
import { useScheduler } from '../hooks/useScheduler';

export default function SystemMetrics() {
  const { systemResources, cpuUtilization } = useScheduler();

  const formatResource = (value: number) => value.toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900">System Load Average</h3>
        <div className="mt-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">CPU Utilization</span>
              <span className="text-lg font-semibold text-indigo-600">
                {formatResource(cpuUtilization)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${cpuUtilization}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900">Resource Allocation</h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {[
            { 
              name: 'CPU Cores', 
              available: systemResources.availableCPU,
              total: systemResources.totalCPU 
            },
            { 
              name: 'Memory (GB)', 
              available: systemResources.availableMemory,
              total: systemResources.totalMemory
            },
            { 
              name: 'Storage (GB)', 
              available: systemResources.availableStorage,
              total: systemResources.totalStorage
            }
          ].map((resource) => (
            <div key={resource.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <dt className="text-sm font-medium text-gray-500">{resource.name}</dt>
                <dd className="text-sm font-semibold text-gray-900">
                  {formatResource(resource.available)}/{resource.total}
                </dd>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((resource.total - resource.available) / resource.total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}