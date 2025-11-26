"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@/lib/types"
import { LayoutDashboard, DoorOpen, Calendar, Cpu, Smartphone, Wrench, Users, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProtectedSidebarProps {
  user: User | null
}

export function ProtectedSidebar({ user }: ProtectedSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Rooms",
      href: "/rooms",
      icon: DoorOpen,
    },
    {
      label: "Bookings",
      href: "/bookings",
      icon: Calendar,
    },
    {
      label: "Devices",
      href: "/devices",
      icon: Cpu,
    },
    {
      label: "Gadgets",
      href: "/gadgets",
      icon: Smartphone,
    },
    {
      label: "Maintenance",
      href: "/maintenances",
      icon: Wrench,
    },
    ...(user?.role === "admin"
      ? [
          {
            label: "Users",
            href: "/users",
            icon: Users,
          },
          {
            label: "Audit Logs",
            href: "/audits",
            icon: FileText,
          },
        ]
      : []),
  ]

  return (
    <div className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Room Manager</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Smart Management System</p>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Logged in as</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  )
}
