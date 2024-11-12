import React from 'react';
import { Server } from 'lucide-react';

export default function NodeStatus() {
  const nodes = [
    {
      id: '1',
      name: 'Node-01',
      status: 'active',
      cpu: 75,
      memory: 60,
      jobs: 3,
    },
    {
      id: '2',
      name: 'Node-02',
      status: 'active',
      cpu: 45,
      memory: 30,
      jobs: 2,
    },
    {
      id: '3',
      name: 'Node-03',
      status: 'maintenance',
      cpu: 0,
      memory: 0,
      jobs: 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`relative rounded-lg border ${
            node.status === 'active' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
          } p-4`}
        >
          <div className="flex items-center">
            <Server className={`h-5 w-5 ${
              node.status === 'active' ? 'text-green-500' : 'text-gray-400'
            }`} />
            <h3 className="ml-2 text-sm font-medium text-gray-900">{node.name}</h3>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">CPU</span>
                <span className="font-medium text-gray-900">{node.cpu}%</span>
              </div>
              <div className="mt-1">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-indigo-600"
                    style={{ width: `${node.cpu}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Memory</span>
                <span className="font-medium text-gray-900">{node.memory}%</span>
              </div>
              <div className="mt-1">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-2 rounded-full bg-indigo-600"
                    style={{ width: `${node.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">Active Jobs</span>
            <span className="font-medium text-gray-900">{node.jobs}</span>
          </div>
        </div>
      ))}
    </div>
  );
}