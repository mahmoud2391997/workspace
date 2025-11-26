import React from 'react'
import AdminLayoutComponent from '@/src/components/admin-layout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutComponent>
      {children}
    </AdminLayoutComponent>
  )
}
