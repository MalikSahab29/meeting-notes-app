'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import TaskForm from '@/components/ui/TaskForm';
import TaskCard from '@/components/ui/TaskCard';

const FILTERS = ['all', 'pending', 'in progress', 'done'];

export default function TasksPage() {
  const { tasks, loading, error, createTask, updateTaskStatus, deleteTask } =
    useTasks();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleCreate = async (formData) => {
    const result = await createTask(formData);
    if (result.success) setShowForm(false);
    return result;
  };

  const filteredTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((t) => t.status === filter);

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in progress': tasks.filter((t) => t.status === 'in progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          {showForm ? '✕ Cancel' : '+ New Task'}
        </button>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            ✅ Create New Task
          </h2>
          <TaskForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 capitalize
              ${filter === f
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            {f}{' '}
            <span className={`text-xs ml-1 ${filter === f ? 'text-indigo-200' : 'text-gray-400'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Tasks Grid */}
      {!loading && !error && (
        <>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
              <span className="text-5xl mb-4 block">✅</span>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No tasks {filter !== 'all' ? `with status "${filter}"` : 'yet'}
              </h3>
              <p className="text-gray-400 text-sm">
                {filter === 'all'
                  ? 'Click "New Task" to create your first one'
                  : 'Try a different filter'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={updateTaskStatus}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}