'use client'

import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth as useAdminAuthContext } from '@/contexts/AdminAuthContext'

export function useAdminAuth() {
  const auth = useAdminAuthContext()
  const router = useRouter()

  // Check if user has specific permission
  const hasPermission = useCallback((permission: string) => {
    return auth.state.user?.permissions.includes(permission) ?? false
  }, [auth.state.user])

  // Check if user has any of the given permissions
  const hasAnyPermission = useCallback((permissions: string[]) => {
    return permissions.some(p => auth.state.user?.permissions.includes(p))
  }, [auth.state.user])

  // Check if user has all of the given permissions
  const hasAllPermissions = useCallback((permissions: string[]) => {
    return permissions.every(p => auth.state.user?.permissions.includes(p))
  }, [auth.state.user])

  // Check if user has specific role
  const hasRole = useCallback((role: string | string[]) => {
    if (!auth.state.user) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(auth.state.user.role)
  }, [auth.state.user])

  // Redirect if not authenticated
  const requireAuth = useCallback((redirectTo: string = '/admin/login') => {
    useEffect(() => {
      if (!auth.state.isLoading && !auth.state.isAuthenticated) {
        router.push(redirectTo)
      }
    }, [auth.state.isLoading, auth.state.isAuthenticated, router, redirectTo])
  }, [auth.state.isLoading, auth.state.isAuthenticated, router])

  // Redirect if doesn't have required permissions
  const requirePermissions = useCallback((requiredPermissions: string[], redirectTo: string = '/admin') => {
    useEffect(() => {
      if (!auth.state.isLoading && auth.state.isAuthenticated) {
        const hasRequired = requiredPermissions.every(p => 
          auth.state.user?.permissions.includes(p)
        )
        if (!hasRequired) {
          router.push(redirectTo)
        }
      }
    }, [auth.state.isLoading, auth.state.isAuthenticated, auth.state.user, requiredPermissions, router, redirectTo])
  }, [auth.state.isLoading, auth.state.isAuthenticated, auth.state.user, router])

  // Get user's full name
  const getFullName = useCallback(() => {
    if (!auth.state.user) return ''
    return `${auth.state.user.firstName} ${auth.state.user.lastName}`
  }, [auth.state.user])

  // Get user's initials
  const getInitials = useCallback(() => {
    if (!auth.state.user) return ''
    return `${auth.state.user.firstName[0]}${auth.state.user.lastName[0]}`
  }, [auth.state.user])

  // Check if session is about to expire
  const isSessionExpiring = useCallback((warningTime: number = 5 * 60 * 1000) => {
    if (!auth.state.sessionExpiry) return false
    const expiryTime = new Date(auth.state.sessionExpiry).getTime()
    const timeUntilExpiry = expiryTime - Date.now()
    return timeUntilExpiry > 0 && timeUntilExpiry <= warningTime
  }, [auth.state.sessionExpiry])

  // Get time until session expiry in seconds
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
    requireAuth,
    requirePermissions,
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