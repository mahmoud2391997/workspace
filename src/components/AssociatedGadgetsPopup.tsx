'use client';

import { useState, useEffect } from 'react';
import { Gadget } from '@/types';

interface AssociatedGadgetsPopupProps {
  deviceId: string;
  onClose: () => void;
}

export default function AssociatedGadgetsPopup({ deviceId, onClose }: AssociatedGadgetsPopupProps) {
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        const res = await fetch(`/api/devices/${deviceId}/gadgets`);
        if (res.ok) {
          const data = await res.json();
          setGadgets(data.gadgets);
        } else {
          setError('Failed to fetch gadgets');
        }
      } catch (err) {
        setError('An error occurred while fetching gadgets');
      }
    };
    fetchGadgets();
  }, [deviceId]);

  const handleCreate = () => {
    // Logic to create a new gadget for the device
    // This would typically open a new form or modal
  };

  const handleUpdate = (gadgetId: string) => {
    // Logic to update a gadget
  };

  const handleDelete = async (gadgetId: string) => {
    if(confirm('Are you sure you want to delete this gadget?')){
        try {
            const res = await fetch(`/api/gadgets/${gadgetId}`, {
                method: 'DELETE',
            });
            if(res.ok) {
                setGadgets(gadgets.filter(g => g.id !== gadgetId));
            } else {
                setError('Failed to delete gadget');
            }
        } catch (error) {
            setError('An error occurred while deleting gadget');
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Associated Gadgets</h3>
          <div className="mt-2 px-7 py-3">
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={handleCreate} className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Add Gadget
            </button>
            <ul className="space-y-2">
              {gadgets.map((gadget) => (
                <li key={gadget.id} className="flex items-center justify-between">
                  <span>{gadget.name} ({gadget.type})</span>
                  <div>
                    <button onClick={() => handleUpdate(gadget.id)} className="text-blue-500 hover:text-blue-700 mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(gadget.id)} className="text-red-500 hover:text-red-700">
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
