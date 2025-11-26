"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { Loader2, Plus, Trash2, Edit2, UsersIcon } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const { error } = await supabase.from("users").delete().eq("id", id)
      if (error) throw error
      setUsers(users.filter((u) => u.id !== id))
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "employee":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage system users</p>
        </div>
        <Button asChild>
          <Link href="/users/create" className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-5 h-5 text-slate-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">{user.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                </div>
              </div>

              {(user.department || user.job_title) && (
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {user.job_title && <p>{user.job_title}</p>}
                  {user.department && <p className="text-xs">{user.department}</p>}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Link href={`/users/${user.id}/edit`} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">No users yet</p>
            <Button asChild>
              <Link href="/users/create">Add your first user</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
