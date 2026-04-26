import { AdminUser } from '@/types/auth'
import { ADMIN_PERMISSIONS } from './auth'

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
    twoFactorSecret: 'JBSWY3DPEHPK3PXP',
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