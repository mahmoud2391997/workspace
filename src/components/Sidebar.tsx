'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiGrid, FiCalendar, FiCpu, FiHardDrive, FiTool, FiUsers, FiClipboard } from 'react-icons/fi';

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className={`bg-gray-900 text-white h-screen ${isMinimized ? 'w-20' : 'w-64'} transition-all flex flex-col`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        {!isMinimized && <h1 className="text-2xl font-bold">Admin Panel</h1>}
        <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 rounded-full hover:bg-gray-800">
          {isMinimized ? '>' : '<'}
        </button>
      </div>
      <nav className="flex-1 py-4">
        <ul>
          <li>
            <Link href="/dashboard" className="p-4 flex items-center hover:bg-gray-800">
              <FiHome className="mr-4" />
              {!isMinimized && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link href="/rooms" className="p-4 flex items-center hover:bg-gray-800">
              <FiGrid className="mr-4" />
              {!isMinimized && <span>Rooms</span>}
            </Link>
          </li>
          <li>
            <Link href="/bookings" className="p-4 flex items-center hover:bg-gray-800">
              <FiCalendar className="mr-4" />
              {!isMinimized && <span>Bookings</span>}
            </Link>
          </li>
          <li>
            <Link href="/devices" className="p-4 flex items-center hover:bg-gray-800">
              <FiCpu className="mr-4" />
              {!isMinimized && <span>Devices</span>}
            </Link>
          </li>
          <li>
            <Link href="/gadgets" className="p-4 flex items-center hover:bg-gray-800">
              <FiHardDrive className="mr-4" />
              {!isMinimized && <span>Gadgets</span>}
            </Link>
          </li>
          <li>
            <Link href="/maintenances" className="p-4 flex items-center hover:bg-gray-800">
              <FiTool className="mr-4" />
              {!isMinimized && <span>Maintenances</span>}
            </Link>
          </li>
          <li>
            <Link href="/users" className="p-4 flex items-center hover:bg-gray-800">
              <FiUsers className="mr-4" />
              {!isMinimized && <span>Users</span>}
            </Link>
          </li>
          <li>
            <Link href="/audits" className="p-4 flex items-center hover:bg-gray-800">
              <FiClipboard className="mr-4" />
              {!isMinimized && <span>Audit Logs</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
