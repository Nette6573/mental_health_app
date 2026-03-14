'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth as useAdminAuthContext } from '@/contexts/AdminAuthContext'

export function useAdminAuth(options?: {
  requireAuth?: boolean
  redirectTo?: string
  requiredPermissions?: string[]
  permissionRedirectTo?: string
}) {
  const auth = useAdminAuthContext()
  const router = useRouter()

  //  useEffect at the top level - runs auth guard if options provided
  useEffect(() => {
    if (options?.requireAuth && !auth.state.isLoading && !auth.state.isAuthenticated) {
      router.push(options.redirectTo ?? '/admin/login')
    }
  }, [auth.state.isLoading, auth.state.isAuthenticated, options?.requireAuth, options?.redirectTo, router])

  //  useEffect at the top level - runs permission guard if options provided
  useEffect(() => {
    if (
      options?.requiredPermissions?.length &&
      !auth.state.isLoading &&
      auth.state.isAuthenticated
    ) {
      const hasRequired = options.requiredPermissions.every(p =>
        auth.state.user?.permissions.includes(p)
      )
      if (!hasRequired) {
        router.push(options.permissionRedirectTo ?? '/admin')
      }
    }
  }, [
    auth.state.isLoading,
    auth.state.isAuthenticated,
    auth.state.user,
    options?.requiredPermissions,
    options?.permissionRedirectTo,
    router,
  ])

  const hasPermission = useCallback((permission: string) => {
    return auth.state.user?.permissions.includes(permission) ?? false
  }, [auth.state.user])

  const hasAnyPermission = useCallback((permissions: string[]) => {
    return permissions.some(p => auth.state.user?.permissions.includes(p))
  }, [auth.state.user])

  const hasAllPermissions = useCallback((permissions: string[]) => {
    return permissions.every(p => auth.state.user?.permissions.includes(p))
  }, [auth.state.user])

  const hasRole = useCallback((role: string | string[]) => {
    if (!auth.state.user) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(auth.state.user.role)
  }, [auth.state.user])

  const getFullName = useCallback(() => {
    if (!auth.state.user) return ''
    return `${auth.state.user.firstName} ${auth.state.user.lastName}`
  }, [auth.state.user])

  const getInitials = useCallback(() => {
    if (!auth.state.user) return ''
    return `${auth.state.user.firstName[0]}${auth.state.user.lastName[0]}`
  }, [auth.state.user])

  const isSessionExpiring = useCallback((warningTime: number = 5 * 60 * 1000) => {
    if (!auth.state.sessionExpiry) return false
    const expiryTime = new Date(auth.state.sessionExpiry).getTime()
    const timeUntilExpiry = expiryTime - Date.now()
    return timeUntilExpiry > 0 && timeUntilExpiry <= warningTime
  }, [auth.state.sessionExpiry])

  const getSessionTimeRemaining = useCallback(() => {
    if (!auth.state.sessionExpiry) return 0
    const expiryTime = new Date(auth.state.sessionExpiry).getTime()
    return Math.max(0, Math.floor((expiryTime - Date.now()) / 1000))
  }, [auth.state.sessionExpiry])

  return {
    ...auth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    getFullName,
    getInitials,
    isSessionExpiring,
    getSessionTimeRemaining,

    // Convenience getters
    user: auth.state.user,
    isLoading: auth.state.isLoading,
    isAuthenticated: auth.state.isAuthenticated,
    error: auth.state.error,
    requiresTwoFactor: auth.state.requiresTwoFactor,
    sessionExpiry: auth.state.sessionExpiry,
  }
}