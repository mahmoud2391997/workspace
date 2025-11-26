"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Room } from "@/lib/types"
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react"

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase.from("rooms").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setRooms(data || [])
      } catch (error) {
        console.error("Error fetching rooms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return

    try {
      const { error } = await supabase.from("rooms").delete().eq("id", id)
      if (error) throw error
      setRooms(rooms.filter((r) => r.id !== id))
    } catch (error) {
      console.error("Error deleting room:", error)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "occupied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "maintenance":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Rooms</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all smart rooms</p>
        </div>
        <Button asChild>
          <Link href="/rooms/create" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Room
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>Floor {room.floor}</CardDescription>
                </div>
                <Badge className={getStatusBadgeColor(room.status)}>{room.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Capacity:</span> {room.capacity} people
                </p>
                {room.amenities && room.amenities.length > 0 && (
                  <p className="text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Amenities:</span> {room.amenities.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Link href={`/rooms/${room.id}/edit`} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => handleDelete(room.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No rooms yet</p>
            <Button asChild>
              <Link href="/rooms/create">Create your first room</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
