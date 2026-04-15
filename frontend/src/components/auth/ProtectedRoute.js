'use client'

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // ✅ PUBLIC ROUTES (ADD ALL LOGIN PAGES HERE)
  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/provider-dashboard/login", // ✅ IMPORTANT FIX
  ]

  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = publicRoutes.includes(pathname)

    // ✅ Allow public pages without login
    if (!user && isPublicRoute) return

    // ❌ Not logged in → block private pages only
    if (!user && !isPublicRoute) {
      router.replace("/auth/login")
      return
    }

    // ❌ Wrong role (only for protected pages)
    if (user && allowedRole && user.role !== allowedRole) {
      if (user.role === "provider") {
        router.replace("/provider-dashboard")
      } else {
        router.replace("/dashboard")
      }
    }

  }, [user, isLoading, router, allowedRole, pathname])

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  const isPublicRoute = publicRoutes.includes(pathname)

  // ✅ Allow public pages even without user
  if (!user && isPublicRoute) {
    return children
  }

  // ❌ Block private pages
  if (!user) {
    return null
  }

  // 🚫 Wrong role
  if (allowedRole && user.role !== allowedRole) {
    return null
  }

  return children
}
