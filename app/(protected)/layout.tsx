"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProtectedNavbar } from "@/components/protected-navbar"
import { ProtectedSidebar } from "@/components/protected-sidebar"
import type { User } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
        return
      }

      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (error) {
          console.log("[v0] User profile not found, creating one...")
          // Create user profile if it doesn't exist
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              id: session.user.id,
              name: session.user.user_metadata?.name || "User",
              email: session.user.email,
              role: "viewer",
              status: "active",
            })
            .select()
            .single()

          if (insertError) {
            console.error("[v0] Error creating user profile:", insertError.message)
          } else if (newUser) {
            console.log("[v0] User profile created:", newUser.id)
            setUser(newUser)
          }
        } else if (data) {
          console.log("[v0] User profile loaded:", data.id)
          setUser(data)
        }
      } catch (err) {
        console.error("[v0] Auth check error:", err)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <ProtectedSidebar user={user} />
      <div className="flex-1 flex flex-col">
        <ProtectedNavbar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
