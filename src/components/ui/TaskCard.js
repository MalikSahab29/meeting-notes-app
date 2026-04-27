'use client';

import StatusBadge from './StatusBadge';

const STATUS_CYCLE = {
  pending: 'in progress',
  'in progress': 'done',
  done: 'pending',
};

export default function TaskCard({ task, onStatusChange, onDelete }) {
  const deadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  const isOverdue =
    task.deadline &&
    task.status !== 'done' &&
    new Date(task.deadline) < new Date();

  const handleStatusClick = () => {
    const nextStatus = STATUS_CYCLE[task.status];
    onStatusChange(task.id, nextStatus);
  };

  return (
    <div className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200
      ${isOverdue ? 'border-red-200' : 'border-gray-200'}`}
    >

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug">
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none flex-shrink-0"
          title="Delete task"
        >
          ×
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Meeting Tag */}
      {task.meeting && (
        <div className="mb-3">
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
            📋 {task.meeting.title}
          </span>
        </div>
      )}

      {/* Assignee + Deadline */}
      <div className="flex items-center justify-between mb-4">

        {/* Assignee */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
            {task.assignedTo?.name?.[0] || '?'}
          </div>
          <span className="text-xs text-gray-600">
            {task.assignedTo?.name || 'Unassigned'}
          </span>
        </div>

        {/* Deadline */}
        {deadline && (
          <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
            {isOverdue ? '🚨' : '📅'} {deadline}
          </span>
        )}
      </div>

      {/* Status — click to cycle */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={handleStatusClick}
          className="group flex items-center gap-1.5"
          title="Click to update status"
        >
          <StatusBadge status={task.status} />
          <span className="text-xs text-gray-300 group-hover:text-gray-400 transition-colors">
            ↻
          </span>
        </button>
        <span className="text-xs text-gray-300">click to update</span>
      </div>

    </div>
  );
}