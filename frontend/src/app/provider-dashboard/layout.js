'use client'

import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function ProviderLayout({ children }) {
  return (
    <ProtectedRoute allowedRole="provider">
      {children}
    </ProtectedRoute>
  )
}