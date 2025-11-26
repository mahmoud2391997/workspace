'use client';

import { useState, useEffect } from 'react';
import { Room } from '@/types';

interface AssociatedRoomsPopupProps {
  deviceId: string;
  onClose: () => void;
}

export default function AssociatedRoomsPopup({ deviceId, onClose }: AssociatedRoomsPopupProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/devices/${deviceId}/rooms`);
        if (res.ok) {
          const data = await res.json();
          setRooms(data.rooms);
        } else {
          setError('Failed to fetch rooms');
        }
      } catch (err) {
        setError('An error occurred while fetching rooms');
      }
    };
    fetchRooms();
  }, [deviceId]);

  const handleCreate = () => {
    // Logic to create a new room for the device
  };

  const handleUpdate = (roomId: string) => {
    // Logic to update a room
  };

  const handleDelete = async (roomId: string) => {
    if(confirm('Are you sure you want to delete this room association?')){
        try {
            const res = await fetch(`/api/devices/${deviceId}/rooms/${roomId}`, {
                method: 'DELETE',
            });
            if(res.ok) {
                setRooms(rooms.filter(r => r.id !== roomId));
            } else {
                setError('Failed to delete room association');
            }
        } catch (error) {
            setError('An error occurred while deleting room association');
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Associated Rooms</h3>
          <div className="mt-2 px-7 py-3">
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={handleCreate} className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Add Room
            </button>
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li key={room.id} className="flex items-center justify-between">
                  <span>{room.name}</span>
                  <div>
                    <button onClick={() => handleUpdate(room.id)} className="text-blue-500 hover:text-blue-700 mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(room.id)} className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
