'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // ❌ Not logged in
    if (!user) {
      router.replace("/auth/login")
      return
    }

    // ❌ Wrong role
    if (allowedRole && user.role !== allowedRole) {
      if (user.role === "provider") {
        router.replace("/provider-dashboard")
      } else {
        router.replace("/dashboard")
      }
    }

  }, [user, isLoading, router, allowedRole])

  // ⏳ Loading state
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  // 🚫 Wrong role (prevent flicker)
  if (allowedRole && user.role !== allowedRole) {
    return null
  }

  return children
}