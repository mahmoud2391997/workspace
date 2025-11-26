"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DoorOpen, Calendar, Cpu, Smartphone, Users, Wrench, TrendingUp } from "lucide-react"
import { Loader2 } from "lucide-react"

interface DashboardStats {
  totalRooms: number
  activeBookings: number
  totalDevices: number
  totalGadgets: number
  totalUsers: number
  pendingMaintenance: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRooms: 0,
    activeBookings: 0,
    totalDevices: 0,
    totalGadgets: 0,
    totalUsers: 0,
    pendingMaintenance: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [rooms, bookings, devices, gadgets, users, maintenance] = await Promise.all([
          supabase.from("rooms").select("*", { count: "exact" }),
          supabase.from("bookings").select("*", { count: "exact" }).eq("status", "confirmed"),
          supabase.from("devices").select("*", { count: "exact" }),
          supabase.from("gadgets").select("*", { count: "exact" }),
          supabase.from("users").select("*", { count: "exact" }),
          supabase.from("maintenance").select("*", { count: "exact" }).eq("status", "pending"),
        ])

        setStats({
          totalRooms: rooms.count || 0,
          activeBookings: bookings.count || 0,
          totalDevices: devices.count || 0,
          totalGadgets: gadgets.count || 0,
          totalUsers: users.count || 0,
          pendingMaintenance: maintenance.count || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({
    icon: Icon,
    label,
    value,
    href,
    color,
  }: {
    icon: typeof DoorOpen
    label: string
    value: number
    href: string
    color: string
  }) => (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  const roomStatusData = [
    { name: "Available", value: stats.totalRooms - 2 },
    { name: "Occupied", value: 1 },
    { name: "Maintenance", value: 1 },
  ]

  const COLORS = ["#10b981", "#3b82f6", "#ef4444"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back! Here's your system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={DoorOpen} label="Total Rooms" value={stats.totalRooms} href="/rooms" color="bg-blue-500" />
        <StatCard
          icon={Calendar}
          label="Active Bookings"
          value={stats.activeBookings}
          href="/bookings"
          color="bg-green-500"
        />
        <StatCard icon={Cpu} label="Smart Devices" value={stats.totalDevices} href="/devices" color="bg-purple-500" />
        <StatCard icon={Smartphone} label="Gadgets" value={stats.totalGadgets} href="/gadgets" color="bg-orange-500" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} href="/users" color="bg-pink-500" />
        <StatCard
          icon={Wrench}
          label="Pending Maintenance"
          value={stats.pendingMaintenance}
          href="/maintenances"
          color="bg-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Device Status Distribution</CardTitle>
            <CardDescription>Active devices across the system</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Lights", active: 45, inactive: 15 },
                  { name: "AC Units", active: 32, inactive: 8 },
                  { name: "Door Locks", active: 28, inactive: 5 },
                  { name: "Sensors", active: 52, inactive: 8 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#10b981" name="Active" />
                <Bar dataKey="inactive" fill="#ef4444" name="Inactive" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Status</CardTitle>
            <CardDescription>Current room availability</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild variant="outline" className="h-auto py-4 flex-col bg-transparent">
            <Link href="/rooms/create">
              <DoorOpen className="w-6 h-6 mb-2" />
              <span>Create Room</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex-col bg-transparent">
            <Link href="/bookings/create">
              <Calendar className="w-6 h-6 mb-2" />
              <span>New Booking</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex-col bg-transparent">
            <Link href="/devices/create">
              <Cpu className="w-6 h-6 mb-2" />
              <span>Add Device</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 flex-col bg-transparent">
            <Link href="/maintenances/create">
              <Wrench className="w-6 h-6 mb-2" />
              <span>Schedule Maintenance</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
