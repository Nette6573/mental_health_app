'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Simulate API calls - replace with actual API endpoints
  const mockApi = {
    login: async (email, password) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock validation - replace with real authentication
      if (email === 'demo@hopepath.org' && password === 'password') {
        return {
          success: true,
          user: {
            id: '1',
            firstName: 'Alex',
            lastName: 'Johnson',
            email: 'demo@hopepath.org',
            avatar: null,
            joinDate: '2024-01-15'
          },
          token: 'mock-jwt-token-12345'
        }
      } else {
        throw new Error('Invalid email or password')
      }
    },

    signup: async (userData) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock registration - replace with real API
      return {
        success: true,
        user: {
          id: Math.random().toString(36).substr(2, 9),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          avatar: null,
          joinDate: new Date().toISOString().split('T')[0]
        },
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
      }
    },

    logout: async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true }
    },

    validateToken: async (token) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock token validation - replace with real validation
      if (token && token.startsWith('mock-jwt-token')) {
        return {
          valid: true,
          user: {
            id: '1',
            firstName: 'Alex',
            lastName: 'Johnson',
            email: 'demo@hopepath.org',
            avatar: null,
            joinDate: '2024-01-15'
          }
        }
      }
      return { valid: false }
    }
  }

  // Check for existing auth session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('hopepath_auth_token')
        const userData = localStorage.getItem('hopepath_user_data')
        
        if (token && userData) {
          // Validate token with backend (simulated)
          const validation = await mockApi.validateToken(token)
          if (validation.valid) {
            setUser(validation.user)
          } else {
            // Token is invalid, clear storage
            clearAuthData()
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Helper function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem('hopepath_auth_token')
    localStorage.removeItem('hopepath_user_data')
    setUser(null)
  }

  // Helper function to save auth data
  const saveAuthData = (userData, token) => {
    localStorage.setItem('hopepath_auth_token', token)
    localStorage.setItem('hopepath_user_data', JSON.stringify(userData))
    setUser(userData)
  }

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const result = await mockApi.login(email, password)
      
      if (result.success) {
        saveAuthData(result.user, result.token)
        return { success: true, user: result.user }
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (userData) => {
    try {
      setIsLoading(true)
      const result = await mockApi.signup(userData)
      
      if (result.success) {
        saveAuthData(result.user, result.token)
        return { success: true, user: result.user }
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true)
      await mockApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthData()
      setIsLoading(false)
      router.push('/')
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('hopepath_user_data', JSON.stringify(updatedUser))
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Get user's display name
  const getDisplayName = () => {
    if (!user) return 'User'
    return user.firstName + (user.lastName ? ` ${user.lastName}` : '')
  }

  // Get user's initials for avatar
  const getInitials = () => {
    if (!user) return 'U'
    return (user.firstName?.[0] || '') + (user.lastName?.[0] || '') || user.email?.[0] || 'U'
  }

  const value = {
    // State
    user,
    isLoading,
    isAuthenticated,

    // Actions
    login,
    signup,
    logout,
    updateProfile,

    // Helpers
    getDisplayName,
    getInitials,

    // Mock API for development (remove in production)
    mockApi
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}