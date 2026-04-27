import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

// 🔶 Temporary mock data — we'll replace with real DB data later
const stats = [
  { title: 'Total Meetings', value: 12, icon: '📋', color: 'indigo' },
  { title: 'Total Tasks', value: 34, icon: '✅', color: 'green' },
  { title: 'Pending Tasks', value: 8, icon: '⏳', color: 'yellow' },
  { title: 'Overdue Tasks', value: 3, icon: '🚨', color: 'red' },
];

const recentTasks = [
  {
    id: 1,
    task: 'Prepare Q3 report',
    assignee: 'Saurabh',
    deadline: '2025-05-10',
    status: 'in progress',
    meeting: 'Q3 Planning',
  },
  {
    id: 2,
    task: 'Update landing page copy',
    assignee: 'Priya',
    deadline: '2025-05-08',
    status: 'pending',
    meeting: 'Marketing Sync',
  },
  {
    id: 3,
    task: 'Fix login bug',
    assignee: 'Rahul',
    deadline: '2025-05-06',
    status: 'done',
    meeting: 'Dev Standup',
  },
  {
    id: 4,
    task: 'Send investor update',
    assignee: 'Saurabh',
    deadline: '2025-05-12',
    status: 'pending',
    meeting: 'Founder Review',
  },
  {
    id: 5,
    task: 'Design new dashboard UI',
    assignee: 'Anita',
    deadline: '2025-05-15',
    status: 'in progress',
    meeting: 'Design Sprint',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, Saurabh 👋 Here's what's happening.
          </p>
        </div>
        <Link
          href="/meetings"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          + New Meeting
        </Link>
      </div>

      {/* Stat Cards */}
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

        {/* Table */}
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
              {recentTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {task.task}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{task.meeting}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {task.assignee[0]}
                      </div>
                      <span className="text-gray-700">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{task.deadline}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}