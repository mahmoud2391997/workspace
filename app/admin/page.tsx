import React from 'react'
import Link from 'next/link'

export default function AdminRootPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-4 text-slate-700">Welcome to the admin area. Use the links below:</p>

      <div className="mt-6 space-y-2">
        <Link href="/admin/dashboard" className="block text-blue-600">Dashboard</Link>
        <Link href="/admin/audits" className="block text-blue-600">Audits</Link>
      </div>
    </div>
  )
}
