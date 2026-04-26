export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'counselor' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  joined: string
  avatar?: string
}

export interface Activity {
  id: string
  userId: string
  userName: string
  action: string
  timestamp: string
  avatar?: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalResources: number
  monthlyGrowth: number
}