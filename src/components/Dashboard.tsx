import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Cpu, Activity, LogOut } from 'lucide-react';
import JobQueue from './JobQueue';
import SystemMetrics from './SystemMetrics';
import SchedulerControls from './SchedulerControls';
import { useScheduler } from '../hooks/useScheduler';
import { useAuth } from '../hooks/useAuth';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
}

function MetricCard({ icon, title, value, trend }: MetricCardProps) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {trend}
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { cpuUtilization, activeJobs, availableNodes } = useScheduler();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">CloudScheduler</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                <Activity className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">System Active</span>
              </div>
              <div className="text-sm text-gray-600">
                {user}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <MetricCard
            icon={<Cpu className="h-6 w-6 text-indigo-600" />}
            title="CPU Utilization"
            value={`${Math.round(cpuUtilization)}%`}
            trend={cpuUtilization > 50 ? '+2.5%' : '-1.2%'}
          />
          <MetricCard
            icon={<BarChart3 className="h-6 w-6 text-indigo-600" />}
            title="Active Jobs"
            value={activeJobs.toString()}
            trend={activeJobs > 0 ? `+${activeJobs}` : '0'}
          />
          <MetricCard
            icon={<Cpu className="h-6 w-6 text-indigo-600" />}
            title="Available Nodes"
            value={`${availableNodes}/15`}
            trend={availableNodes < 15 ? '-1' : '0'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <JobQueue />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <SystemMetrics />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <SchedulerControls />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
