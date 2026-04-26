export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'super_admin' | 'admin' | 'moderator' | 'support'
  permissions: string[]
  avatar?: string
  lastLogin?: string
  loginAttempts?: number
  lockedUntil?: string
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  createdAt: string
  updatedAt: string
}

export interface AdminLoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorCode?: string
}

export interface AdminLoginResponse {
  success: boolean
  user?: AdminUser
  token?: string
  refreshToken?: string
  requiresTwoFactor?: boolean
  error?: string
  message?: string
}

export interface AdminSession {
  user: AdminUser
  token: string
  expiresAt: string
  lastActivity: string
}

export interface AdminAuthState {
  user: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  requiresTwoFactor: boolean
  sessionExpiry: string | null
}