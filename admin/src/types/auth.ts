export interface AdminCredentials {
  email: string
  password: string
  lastLogin?: string
  loginAttempts?: number
  lockedUntil?: string
  twoFactorEnabled: boolean
}

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

export interface AdminAuthState {
  user: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  requiresTwoFactor: boolean
  sessionExpiry: string | null
}

export interface SessionConfig {
  TOKEN_EXPIRY: number
  REFRESH_TOKEN_EXPIRY: number
  MAX_LOGIN_ATTEMPTS: number
  LOCKOUT_DURATION: number
  SESSION_TIMEOUT: number
  WARNING_BEFORE_TIMEOUT: number
}
