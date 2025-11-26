"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Device } from "@/lib/types"
import { Loader2, Plus, Trash2, Edit2, Zap } from "lucide-react"

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data, error } = await supabase.from("devices").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setDevices(data || [])
      } catch (error) {
        console.error("Error fetching devices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevices()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return

    try {
      const { error } = await supabase.from("devices").delete().eq("id", id)
      if (error) throw error
      setDevices(devices.filter((d) => d.id !== id))
    } catch (error) {
      console.error("Error deleting device:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "off":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      light: "bg-yellow-100 text-yellow-800",
      ac: "bg-blue-100 text-blue-800",
      door_lock: "bg-purple-100 text-purple-800",
      sensor: "bg-indigo-100 text-indigo-800",
      projector: "bg-pink-100 text-pink-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Devices</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor smart devices</p>
        </div>
        <Button asChild>
          <Link href="/devices/create" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Device
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{device.name}</CardTitle>
                  <CardDescription className="capitalize">{device.type}</CardDescription>
                </div>
                <Zap className="w-5 h-5 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(device.type)}>{device.type}</Badge>
                  <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last update: {new Date(device.last_update).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Link href={`/devices/${device.id}/edit`} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => handleDelete(device.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {devices.length === 0 && (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No devices yet</p>
            <Button asChild>
              <Link href="/devices/create">Add your first device</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
