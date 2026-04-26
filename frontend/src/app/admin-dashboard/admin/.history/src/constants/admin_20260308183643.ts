export const ADMIN_NAVIGATION = [
  { name: 'Dashboard', href: '/admin', icon: 'HomeIcon' },
  { name: 'Users', href: '/admin/users', icon: 'UsersIcon' },
  { name: 'Content', href: '/admin/content', icon: 'DocumentTextIcon' },
  { name: 'Resources', href: '/admin/resources', icon: 'BookOpenIcon' },
  { name: 'Analytics', href: '/admin/analytics', icon: 'ChartBarIcon' },
  { name: 'Settings', href: '/admin/settings', icon: 'Cog6ToothIcon' },
]

export const USER_ROLES = {
  ADMIN: 'admin',
  COUNSELOR: 'counselor',
  USER: 'user',
}

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
}