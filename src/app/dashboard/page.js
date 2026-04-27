'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { useTasks } from '@/hooks/useTasks';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

export default function Dashboard() {
  const { data, loading, error, fetchDashboard } = useDashboard();
  const { updateTaskStatus } = useTasks();

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus);
    // Refresh dashboard stats after status change
    await fetchDashboard();
  };

  // Build stat cards from real data
  const stats = data
    ? [
        {
          title: 'Total Meetings',
          value: data.stats.totalMeetings,
          icon: '📋',
          color: 'indigo',
        },
        {
          title: 'Total Tasks',
          value: data.stats.totalTasks,
          icon: '✅',
          color: 'green',
        },
        {
          title: 'Pending Tasks',
          value: data.stats.pendingTasks,
          icon: '⏳',
          color: 'yellow',
        },
        {
          title: 'Overdue Tasks',
          value: data.stats.overdueTasks,
          icon: '🚨',
          color: 'red',
        },
      ]
    : [];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening across your meetings.
          </p>
        </div>
        <Link
          href="/meetings"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          + New Meeting
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      )}

      {/* Progress Summary */}
      {!loading && data && data.stats.totalTasks > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Overall Progress
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>
                  {data.stats.doneTasks} of {data.stats.totalTasks} tasks completed
                </span>
                <span>
                  {Math.round(
                    (data.stats.doneTasks / data.stats.totalTasks) * 100
                  )}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(data.stats.doneTasks / data.stats.totalTasks) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="text-xs text-gray-500">
                {data.stats.pendingTasks} Pending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-xs text-gray-500">
                {data.stats.inProgressTasks} In Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-xs text-gray-500">
                {data.stats.doneTasks} Done
              </span>
            </div>
            {data.stats.overdueTasks > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-xs text-red-500">
                  {data.stats.overdueTasks} Overdue
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Tasks Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Tasks
          </h2>
          <Link
            href="/tasks"
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {/* Loading Table */}
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : data?.recentTasks?.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-3xl mb-2 block">✅</span>
            <p className="text-gray-400 text-sm">No tasks yet.</p>
            <Link
              href="/tasks"
              className="text-indigo-600 text-sm font-medium hover:underline mt-1 inline-block"
            >
              Create your first task →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Task</th>
                  <th className="px-6 py-3 text-left">Meeting</th>
                  <th className="px-6 py-3 text-left">Assignee</th>
                  <th className="px-6 py-3 text-left">Deadline</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentTasks?.map((task) => {
                  const deadline = task.deadline
                    ? new Date(task.deadline).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—';

                  const isOverdue =
                    task.deadline &&
                    task.status !== 'done' &&
                    new Date(task.deadline) < new Date();

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {task.title}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {task.meeting?.title || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {task.assignedTo?.name?.[0] || '?'}
                          </div>
                          <span className="text-gray-700">
                            {task.assignedTo?.name || 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm
                        ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}
                      >
                        {isOverdue ? '🚨 ' : ''}{deadline}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleStatusChange(
                              task.id,
                              task.status === 'pending'
                                ? 'in progress'
                                : task.status === 'in progress'
                                ? 'done'
                                : 'pending'
                            )
                          }
                          title="Click to update status"
                        >
                          <StatusBadge status={task.status} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}