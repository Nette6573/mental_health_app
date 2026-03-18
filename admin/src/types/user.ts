export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  
  // Account Status
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  role: 'user' | 'premium' | 'counselor' | 'admin'
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  
  // Profile
  avatar?: string
  bio?: string
  occupation?: string
  interests?: string[]
  
  // Statistics
  totalSessions: number
  totalResources: number
  totalReviews: number
  lastActive: string
  joinedDate: string
  
  // Preferences
  preferences: {
    newsletter: boolean
    notifications: boolean
    language: string
    theme: 'light' | 'dark' | 'system'
  }
  
  // Emergency Contact
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
  
  // Metadata
  notes?: string
  tags?: string[]
  metadata?: Record<string, any>
  
  // Timestamps
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  suspendedUntil?: string
  suspensionReason?: string
}

export interface UserActivity {
  id: string
  userId: string
  type: 'login' | 'session' | 'resource' | 'payment' | 'support'
  action: string
  details?: string
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

export interface UserSession {
  id: string
  userId: string
  therapistId: string
  therapistName: string
  date: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  rating?: number
  feedback?: string
  notes?: string
}

export interface UserResource {
  id: string
  userId: string
  resourceId: string
  resourceTitle: string
  resourceType: string
  accessedAt: string
  completed?: boolean
  bookmarked?: boolean
  rating?: number
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  pendingUsers: number
  premiumUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  averageSessionsPerUser: number
  topUsers: Array<{
    id: string
    name: string
    sessions: number
  }>
}