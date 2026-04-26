import { AdminUser, SessionConfig } from '@/types/auth'

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  SUPPORT: 'support',
} as const

export const ADMIN_PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_THERAPISTS: 'manage_therapists',
  MANAGE_RESOURCES: 'manage_resources',
  MANAGE_CONTENT: 'manage_content',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_ADMINS: 'manage_admins',
  VIEW_LOGS: 'view_logs',
  MANAGE_SUPPORT: 'manage_support',
  ACCESS_CHAT: 'access_chat',
} as const

export const SESSION_CONFIG: SessionConfig = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  WARNING_BEFORE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
}

// Export MOCK_ADMIN_USERS
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin1',
    email: 'super.admin@hopepath.org',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'super_admin',
    permissions: Object.values(ADMIN_PERMISSIONS),
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin2',
    email: 'admin@hopepath.org',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    permissions: [
      ADMIN_PERMISSIONS.VIEW_DASHBOARD,
      ADMIN_PERMISSIONS.MANAGE_USERS,
      ADMIN_PERMISSIONS.MANAGE_THERAPISTS,
      ADMIN_PERMISSIONS.MANAGE_RESOURCES,
      ADMIN_PERMISSIONS.VIEW_ANALYTICS,
      ADMIN_PERMISSIONS.ACCESS_CHAT,
    ],
    twoFactorEnabled: true,
    twoFactorSecret: 'JBSWY3DPEHPK3PXP', // Example secret for demo
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin3',
    email: 'moderator@hopepath.org',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'moderator',
    permissions: [
      ADMIN_PERMISSIONS.VIEW_DASHBOARD,
      ADMIN_PERMISSIONS.MANAGE_USERS,
      ADMIN_PERMISSIONS.MANAGE_SUPPORT,
      ADMIN_PERMISSIONS.ACCESS_CHAT,
    ],
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Also export other mock data if needed
export const MOCK_ADMIN_TOKENS = {
  admin1: 'mock-token-super-admin',
  admin2: 'mock-token-admin',
  admin3: 'mock-token-moderator',
}