import StatusBadge from './StatusBadge';
import Link from 'next/link';

export default function MeetingCard({ meeting }) {
  const taskCount = meeting.tasks?.length || 0;
  const doneCount = meeting.tasks?.filter(t => t.status === 'done').length || 0;
  const date = new Date(meeting.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {meeting.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">📅 {date}</p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-600 font-medium px-3 py-1 rounded-full border border-indigo-100">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Description */}
      {meeting.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {meeting.description}
        </p>
      )}

      {/* Progress Bar */}
      {taskCount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{doneCount}/{taskCount} done</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${taskCount > 0 ? (doneCount / taskCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          By {meeting.createdBy?.name || 'Unknown'}
        </span>
        <Link
          href={`/meetings/${meeting.id}`}
          className="text-xs font-semibold text-indigo-600 hover:underline"
        >
          View Details →
        </Link>
      </div>

    </div>
  );
}