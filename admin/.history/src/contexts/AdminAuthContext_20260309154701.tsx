'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminUser, AdminAuthState, AdminLoginCredentials } from '@/types/auth'
import { SESSION_CONFIG, MOCK_ADMIN_USERS } from '@/constants/auth'

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
      return { ...initialState, isLoading: false }
    default:
      return state
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminAuthReducer, initialState)
  const router = useRouter()

  useEffect(() => {
    const checkSession = () => {
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
          handleLogout()
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false })
    }

    checkSession()

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const handleActivity = () => {
      if (state.isAuthenticated) {
        dispatch({ type: 'UPDATE_LAST_ACTIVITY' })
        localStorage.setItem('adminSessionExpiry', 
          new Date(Date.now() + SESSION_CONFIG.SESSION_TIMEOUT).toISOString()
        )
      }
    }

    events.forEach(event => document.addEventListener(event, handleActivity))
    return () => events.forEach(event => document.removeEventListener(event, handleActivity))
  }, [state.isAuthenticated])

  const handleLogout = async () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminSessionExpiry')
    dispatch({ type: 'LOGOUT' })
    router.push('/admin/login')
  }

  const login = async (credentials: AdminLoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Mock login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user = MOCK_ADMIN_USERS.find(u => u.email === credentials.email)
      
      if (!user || credentials.password !== 'admin123') {
        throw new Error('Invalid credentials')
      }

      if (user.twoFactorEnabled) {
        dispatch({ type: 'SET_TWO_FACTOR', payload: true })
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      localStorage.setItem('adminToken', 'mock-token')
      localStorage.setItem('adminUser', JSON.stringify(user))
      
      const expiry = new Date(Date.now() + SESSION_CONFIG.SESSION_TIMEOUT).toISOString()
      localStorage.setItem('adminSessionExpiry', expiry)

      dispatch({ type: 'SET_USER', payload: user })
      dispatch({ type: 'SET_AUTHENTICATED', payload: true })
      dispatch({ type: 'SET_SESSION_EXPIRY', payload: expiry })
      
      router.push('/admin')
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const verifyTwoFactor = async (code: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (code === '123456') {
        const user = MOCK_ADMIN_USERS[1]
        localStorage.setItem('adminToken', 'mock-token')
        localStorage.setItem('adminUser', JSON.stringify(user))
        
        const expiry = new Date(Date.now() + SESSION_CONFIG.SESSION_TIMEOUT).toISOString()
        localStorage.setItem('adminSessionExpiry', expiry)

        dispatch({ type: 'SET_USER', payload: user })
        dispatch({ type: 'SET_AUTHENTICATED', payload: true })
        dispatch({ type: 'SET_TWO_FACTOR', payload: false })
        dispatch({ type: 'SET_SESSION_EXPIRY', payload: expiry })
        
        router.push('/admin')
      } else {
        throw new Error('Invalid verification code')
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = handleLogout

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
      updateLastActivity,
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}