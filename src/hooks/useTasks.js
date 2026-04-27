'use client';

import { useState, useEffect } from 'react';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      return { success: true, task: newTask };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();

      // Update just this task in the list
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: updated.status } : t))
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');

      // Remove from list instantly
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    fetchTasks,
  };
}