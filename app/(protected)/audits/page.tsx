"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import type { AuditLog } from "@/lib/types"
import { Loader2, FileText } from "lucide-react"

export default function AuditsPage() {
  const [audits, setAudits] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const { data, error } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100)

        if (error) throw error
        setAudits(data || [])
      } catch (error) {
        console.error("Error fetching audits:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAudits()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">System activity and changes</p>
      </div>

      <div className="space-y-4">
        {audits.map((audit) => (
          <Card key={audit.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">{audit.action}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {audit.entity} {audit.entity_id && `(ID: ${audit.entity_id})`}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(audit.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {audit.meta && (
                  <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded p-2">
                    <pre>{JSON.stringify(audit.meta, null, 2)}</pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {audits.length === 0 && (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">No audit logs available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
