"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Maintenance } from "@/lib/types"
import { Loader2, Plus, Trash2, Edit2, Wrench } from "lucide-react"

export default function MaintenancesPage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const { data, error } = await supabase
          .from("maintenance")
          .select("*")
          .order("scheduled_date", { ascending: false })

        if (error) throw error
        setMaintenances(data || [])
      } catch (error) {
        console.error("Error fetching maintenances:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaintenances()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this maintenance record?")) return

    try {
      const { error } = await supabase.from("maintenance").delete().eq("id", id)
      if (error) throw error
      setMaintenances(maintenances.filter((m) => m.id !== id))
    } catch (error) {
      console.error("Error deleting maintenance:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Maintenance</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Schedule and track maintenance tasks</p>
        </div>
        <Button asChild>
          <Link href="/maintenances/create" className="gap-2">
            <Plus className="w-4 h-4" />
            Schedule Maintenance
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {maintenances.map((maintenance) => (
          <Card key={maintenance.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-slate-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">{maintenance.description}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Scheduled: {new Date(maintenance.scheduled_date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Badge className={getStatusColor(maintenance.status)}>{maintenance.status.replace("_", " ")}</Badge>
              </div>

              <div className="flex gap-2 pt-4">
                <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Link href={`/maintenances/${maintenance.id}/edit`} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => handleDelete(maintenance.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {maintenances.length === 0 && (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No maintenance scheduled</p>
            <Button asChild>
              <Link href="/maintenances/create">Schedule first maintenance</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
