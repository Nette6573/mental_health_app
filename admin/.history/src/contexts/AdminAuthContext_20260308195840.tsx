'use client'

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AdminUser, AdminAuthState, AdminLoginCredentials } from '@/types/admin-auth'
import { SESSION_CONFIG } from '@/constants/admin-auth'

type AdminAuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AdminUser | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TWO_FACTOR'; payload: boolean }
  | { type: 'SET_SESSION_EXPIRY'; payload: string | null }
  | { type: 'UPDATE_LAST_ACTIVITY' }
  | { type: 'LOGOUT' }

const initialState: AdminAuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  requiresTwoFactor: false,
  sessionExpiry: null,
}

const AdminAuthContext = createContext<{
  state: AdminAuthState
  login: (credentials: AdminLoginCredentials) => Promise<void>
  logout: () => Promise<void>
  verifyTwoFactor: (code: string) => Promise<void>
  refreshSession: () => Promise<void>
  updateLastActivity: () => void
} | null>(null)

function adminAuthReducer(state: AdminAuthState, action: AdminAuthAction): AdminAuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_TWO_FACTOR':
      return { ...state, requiresTwoFactor: action.payload }
    case 'SET_SESSION_EXPIRY':
      return { ...state, sessionExpiry: action.payload }
    case 'UPDATE_LAST_ACTIVITY':
      return {
        ...state,
        sessionExpiry: new Date(Date.now() + SESSION_CONFIG.SESSION_TIMEOUT).toISOString(),
      }
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      }
    default:
      return state
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminAuthReducer, initialState)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const userData = localStorage.getItem('adminUser')
        const expiry = localStorage.getItem('adminSessionExpiry')

        if (token && userData && expiry) {
          const expiryDate = new Date(expiry)
          
          if (expiryDate > new Date()) {
            dispatch({ type: 'SET_USER', payload: JSON.parse(userData) })
            dispatch({ type: 'SET_AUTHENTICATED', payload: true })
            dispatch({ type: 'SET_SESSION_EXPIRY', payload: expiry })
          } else {
            // Session expired
            await handleLogout()
          }
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkSession()

    // Set up activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const handleActivity = () => {
      if (state.isAuthenticated) {
        dispatch({ type: 'UPDATE_LAST_ACTIVITY' })
        localStorage.setItem('adminSessionExpiry', new Date(Date.now() + SESSION_CONFIG.SESSION_TIMEOUT).toISOString())
      }
    }

    events.forEach(event => document.addEventListener(event, handleActivity))

    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity))
    }
  }, [state.isAuthenticated])

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminSessionExpiry')
    localStorage.removeItem('adminRefreshToken')
    
    dispatch({ type: 'LOGOUT' })
    
    // Call logout API
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API call failed:', error)
    }
    
    router.push('/admin/login')
  }, [router])

  const login = async (credentials: AdminLoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (data.requiresTwoFactor) {
        dispatch({ type: 'SET_TWO_FACTOR', payload: true })
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      // Store session data
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminUser', JSON.stringify(data.user))
      localStorage.setItem('adminRefreshToken', data.refreshToken)
      
      const expiry = new Date(Date.now() + SESSION_CONFIG.SESSION_TIMEOUT).toISOString()
      localStorage.setItem('adminSessionExpiry', expiry)

      dispatch({ type: 'SET_USER', payload: data.user })
      dispatch({ type: 'SET_AUTHENTICATED', payload: true })
      dispatch({ type: 'SET_SESSION_EXPIRY', payload: expiry })

      // Redirect to admin dashboard
      router.push('/admin')
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const verifyTwoFactor = async (code: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      // Store session data
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminUser', JSON.stringify(data.user))
      localStorage.setItem('adminRefreshToken', data.refreshToken)
      
      const expiry = new Date(Date.now() + SESSION_CONFIG.SESSION_TIMEOUT).toISOString()
      localStorage.setItem('adminSessionExpiry', expiry)

      dispatch({ type: 'SET_USER', payload: data.user })
      dispatch({ type: 'SET_AUTHENTICATED', payload: true })
      dispatch({ type: 'SET_TWO_FACTOR', payload: false })
      dispatch({ type: 'SET_SESSION_EXPIRY', payload: expiry })

      router.push('/admin')
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = handleLogout

  const refreshSession = async () => {
    try {
      const refreshToken = localStorage.getItem('adminRefreshToken')
      
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminRefreshToken', data.refreshToken)
        
        const expiry = new Date(Date.now() + SESSION_CONFIG.SESSION_TIMEOUT).toISOString()
        localStorage.setItem('adminSessionExpiry', expiry)
        dispatch({ type: 'SET_SESSION_EXPIRY', payload: expiry })
      }
    } catch (error) {
      console.error('Session refresh failed:', error)
      await handleLogout()
    }
  }

  const updateLastActivity = () => {
    if (state.isAuthenticated) {
      dispatch({ type: 'UPDATE_LAST_ACTIVITY' })
    }
  }

  return (
    <AdminAuthContext.Provider value={{
      state,
      login,
      logout,
      verifyTwoFactor,
      refreshSession,
      updateLastActivity,
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}