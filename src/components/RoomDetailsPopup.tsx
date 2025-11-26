'use client';

import { useEffect, useState } from 'react';
import { Gadget, Device, Booking } from '@/types';

interface RoomDetailsPopupProps {
  roomId: string;
  onClose: () => void;
}

export default function RoomDetailsPopup({ roomId, onClose }: RoomDetailsPopupProps) {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gadgetsRes, devicesRes, bookingsRes] = await Promise.all([
          fetch(`/api/rooms/${roomId}/gadgets`),
          fetch(`/api/rooms/${roomId}/devices`),
          fetch(`/api/rooms/${roomId}/bookings`),
        ]);

        const gadgetsData = await gadgetsRes.json();
        const devicesData = await devicesRes.json();
        const bookingsData = await bookingsRes.json();

        setGadgets(gadgetsData.gadgets);
        setDevices(devicesData.devices);
        setBookings(bookingsData.bookings);
      } catch (error) {
        console.error('Failed to fetch room details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Room Details</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-2">Gadgets</h3>
            <ul>
              {gadgets.map((gadget) => (
                <li key={gadget.id}>{gadget.name}</li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold mt-4 mb-2">Devices</h3>
            <ul>
              {devices.map((device) => (
                <li key={device.id}>{device.name}</li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold mt-4 mb-2">Bookings</h3>
            <ul>
              {bookings.map((booking) => (
                <li key={booking.id}>{booking.purpose}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
