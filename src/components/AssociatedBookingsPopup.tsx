'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/types';

interface AssociatedBookingsPopupProps {
  deviceId: string;
  onClose: () => void;
}

export default function AssociatedBookingsPopup({ deviceId, onClose }: AssociatedBookingsPopupProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/devices/${deviceId}/bookings`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [deviceId]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-auto max-w-lg shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Associated Bookings</h3>
          <div className="mt-2 px-7 py-3">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : bookings.length > 0 ? (
              <ul className="space-y-2">
                {bookings.map((booking) => (
                  <li key={booking.id} className="flex items-center justify-between">
                    <span>Booking for room {booking.roomId} from {new Date(booking.startTime).toLocaleString()} to {new Date(booking.endTime).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No associated bookings found.</p>
            )}
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
