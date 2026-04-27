'use client';

import { useState } from 'react';
import { useMeetings } from '@/hooks/useMeetings';
import MeetingForm from '@/components/ui/MeetingForm';
import MeetingCard from '@/components/ui/MeetingCard';

// Temporary: hardcoded userId until auth is built
const TEMP_USER_ID = 1;

export default function MeetingsPage() {
  const { meetings, loading, error, createMeeting } = useMeetings();
  const [showForm, setShowForm] = useState(false);

  const handleCreateMeeting = async (formData) => {
    const result = await createMeeting({
      ...formData,
      userId: TEMP_USER_ID,
    });
    if (result.success) setShowForm(false);
    return result;
  };

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-500 mt-1">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
        >
          {showForm ? '✕ Cancel' : '+ New Meeting'}
        </button>
      </div>

      {/* Create Meeting Form */}
      {showForm && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            📋 Create New Meeting
          </h2>
          <MeetingForm
            onSubmit={handleCreateMeeting}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Meetings Grid */}
      {!loading && !error && (
        <>
          {meetings.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
              <span className="text-5xl mb-4 block">📋</span>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No meetings yet
              </h3>
              <p className="text-gray-400 text-sm">
                Click "New Meeting" to create your first one
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}