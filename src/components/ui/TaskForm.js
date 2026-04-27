'use client';

import { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    userId: '',
    meetingId: '',
  });
  const [users, setUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load users and meetings for dropdowns
  useEffect(() => {
    async function loadOptions() {
      const [usersRes, meetingsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/meetings'),
      ]);
      const usersData = await usersRes.json();
      const meetingsData = await meetingsRes.json();
      setUsers(usersData);
      setMeetings(meetingsData);
    }
    loadOptions();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!formData.userId) {
      setError('Please select an assignee');
      return;
    }
    if (!formData.meetingId) {
      setError('Please select a meeting');
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(formData);
    setSubmitting(false);

    if (result.success) {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        userId: '',
        meetingId: '',
      });
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Prepare Q3 report"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional details about this task..."
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
        />
      </div>

      {/* Two columns: Assignee + Meeting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Assignee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign To <span className="text-red-500">*</span>
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
          >
            <option value="">Select person...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* Meeting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Meeting <span className="text-red-500">*</span>
          </label>
          <select
            name="meetingId"
            value={formData.meetingId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
          >
            <option value="">Select meeting...</option>
            {meetings.map((meeting) => (
              <option key={meeting.id} value={meeting.id}>
                {meeting.title}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5"
        >
          Cancel
        </button>
      </div>

    </form>
  );
}