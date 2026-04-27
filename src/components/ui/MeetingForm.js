'use client';

import { useState } from 'react';

export default function MeetingForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      setError('Meeting title is required');
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(formData);
    setSubmitting(false);

    if (result.success) {
      setFormData({ title: '', description: '' });
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meeting Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Q3 Planning Session"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes / Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What was discussed in this meeting?"
          rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating...' : 'Create Meeting'}
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