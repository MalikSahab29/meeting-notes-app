'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

const STATUS_CYCLE = {
  pending: 'in progress',
  'in progress': 'done',
  done: 'pending',
};

export default function MeetingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Fetch meeting details
  useEffect(() => {
    if (!id) return;
    fetchMeeting();
  }, [id]);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/meetings/${id}`);
      if (!res.ok) throw new Error('Meeting not found');
      const data = await res.json();
      setMeeting(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    const nextStatus = STATUS_CYCLE[currentStatus];
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      // Refresh meeting data
      await fetchMeeting();
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="h-4 bg-gray-200 rounded w-full mb-3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl mb-4 block">😕</span>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{error}</h2>
        <Link
          href="/meetings"
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          ← Back to Meetings
        </Link>
      </div>
    );
  }

  if (!meeting) return null;

  const totalTasks = meeting.tasks?.length || 0;
  const doneTasks = meeting.tasks?.filter(t => t.status === 'done').length || 0;
  const date = new Date(meeting.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Back Button */}
      <Link
        href="/meetings"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        ← Back to Meetings
      </Link>

      {/* Meeting Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {meeting.title}
            </h1>
            <p className="text-sm text-gray-400">📅 {date}</p>
          </div>
          <span className="text-sm bg-indigo-50 text-indigo-600 font-medium px-4 py-2 rounded-full border border-indigo-100">
            {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {/* Description */}
        {meeting.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Notes
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {meeting.description}
            </p>
          </div>
        )}

        {/* Progress */}
        {totalTasks > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Task Progress</span>
              <span>{doneTasks}/{totalTasks} completed</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Tasks from this Meeting
          </h2>
          <Link
            href="/tasks"
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            + Add Task
          </Link>
        </div>

        {/* Tasks List */}
        {meeting.tasks?.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-3xl mb-2 block">✅</span>
            <p className="text-gray-400 text-sm">No tasks for this meeting yet.</p>
            <Link
              href="/tasks"
              className="text-indigo-600 text-sm font-medium hover:underline mt-1 inline-block"
            >
              Create a task →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {meeting.tasks.map((task) => {
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

              return (
                <div
                  key={task.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  {/* Left — Task Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {/* Assignee */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {task.assignedTo?.name?.[0] || '?'}
                        </div>
                        <span className="text-xs text-gray-500">
                          {task.assignedTo?.name || 'Unassigned'}
                        </span>
                      </div>
                      {/* Deadline */}
                      {deadline && (
                        <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                          {isOverdue ? '🚨' : '📅'} {deadline}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right — Status Badge */}
                  <button
                    onClick={() => handleStatusChange(task.id, task.status)}
                    className="ml-4 flex-shrink-0 group flex items-center gap-1"
                    title="Click to update status"
                  >
                    <StatusBadge status={task.status} />
                    <span className="text-xs text-gray-300 group-hover:text-gray-400">↻</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}