'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: '📊',
    },
    {
      label: 'Rooms',
      href: '/rooms',
      icon: '🏠',
    },
    {
      label: 'Bookings',
      href: '/bookings',
      icon: '📅',
    },
    {
      label: 'Devices',
      href: '/devices',
      icon: '🔌',
    },
    {
      label: 'Gadgets',
      href: '/gadgets',
      icon: '⚙️',
    },
    {
      label: 'Maintenances',
      href: '/maintenances',
      icon: '🔧',
    },
    {
      label: 'Users',
      href: '/users',
      icon: '👥',
    },
    {
      label: 'Audit Logs',
      href: '/admin/audits',
      icon: '📋',
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
      >
        ☰
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 z-40 shadow-lg`}
      >
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-blue-100 text-sm mt-1">Smart Room Management</p>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => window.innerWidth < 768 && setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive(item.href)
                  ? 'bg-blue-500 shadow-md'
                  : 'hover:bg-blue-700 text-blue-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-700 bg-blue-700/50">
          <p className="text-xs text-blue-100">
            © 2025 Smart Room Management System
          </p>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
