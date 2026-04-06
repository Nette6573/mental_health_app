'use client'

import ProtectedRoute from "@/components/auth/ProtectedRoute"

export const metadata = {
  title: 'Dashboard - HopePath',
  description: 'Your personal mental wellness dashboard',
}

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute allowedRole="user">
      {children}
    </ProtectedRoute>
  )
}