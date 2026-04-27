'use client';

import { useState, useEffect } from 'react';

export function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all meetings from API
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/meetings');
      if (!res.ok) throw new Error('Failed to fetch meetings');
      const data = await res.json();
      setMeetings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new meeting
  const createMeeting = async (meetingData) => {
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meetingData),
      });

      if (!res.ok) throw new Error('Failed to create meeting');
      const newMeeting = await res.json();

      // Add new meeting to top of list instantly (optimistic UI)
      setMeetings((prev) => [newMeeting, ...prev]);
      return { success: true, meeting: newMeeting };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return { meetings, loading, error, createMeeting, fetchMeetings };
}