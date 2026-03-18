export * from '../types/auth'
export * from '../types/therapists'
export * from '../types/resources'
export * from '../types/analytics'
export * from '../types/chat'

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', href: '/admin', icon: 'HomeIcon' },
  { name: 'Users', href: '/admin/users', icon: 'UsersIcon' },
  { name: 'Therapists', href: '/admin/therapists', icon: 'UserGroupIcon' },
  { name: 'Resources', href: '/admin/resources', icon: 'BookOpenIcon' },
  { name: 'Analytics', href: '/admin/analytics', icon: 'ChartBarIcon' },
  { name: 'Chat', href: '/admin/chat', icon: 'ChatBubbleLeftIcon' },
  { name: 'Settings', href: '/admin/settings', icon: 'Cog6ToothIcon' },
]

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_USERS: 'manage_users',
  MANAGE_THERAPISTS: 'manage_therapists',
  MANAGE_RESOURCES: 'manage_resources',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  ACCESS_CHAT: 'access_chat',
} as const