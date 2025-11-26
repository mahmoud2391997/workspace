"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Gadget } from "@/lib/types"
import { Loader2, Plus, Trash2, Edit2, Smartphone } from "lucide-react"

export default function GadgetsPage() {
  const [gadgets, setGadgets] = useState<Gadget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchGadgets = async () => {
      try {
        const { data, error } = await supabase.from("gadgets").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setGadgets(data || [])
      } catch (error) {
        console.error("Error fetching gadgets:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGadgets()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gadget?")) return

    try {
      const { error } = await supabase.from("gadgets").delete().eq("id", id)
      if (error) throw error
      setGadgets(gadgets.filter((g) => g.id !== id))
    } catch (error) {
      console.error("Error deleting gadget:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "in_use":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "retired":
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gadgets</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage company gadgets</p>
        </div>
        <Button asChild>
          <Link href="/gadgets/create" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Gadget
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gadgets.map((gadget) => (
          <Card key={gadget.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{gadget.name}</CardTitle>
                  <CardDescription className="capitalize">{gadget.type}</CardDescription>
                </div>
                <Smartphone className="w-5 h-5 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge className={getStatusColor(gadget.status)}>{gadget.status.replace("_", " ")}</Badge>
              <div className="flex gap-2 pt-4">
                <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Link href={`/gadgets/${gadget.id}/edit`} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => handleDelete(gadget.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gadgets.length === 0 && (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No gadgets yet</p>
            <Button asChild>
              <Link href="/gadgets/create">Add your first gadget</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
