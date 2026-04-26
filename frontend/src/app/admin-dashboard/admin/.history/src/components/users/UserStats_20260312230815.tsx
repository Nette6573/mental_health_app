'use client'

import {
  UsersIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ClockIcon,
  NoSymbolIcon,
  StarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'

interface UserStatsProps {
  stats: {
    totalUsers: number
    activeUsers: number
    suspendedUsers: number
    pendingUsers: number
    premiumUsers: number
    newUsersToday: number
    newUsersThisWeek: number
    newUsersThisMonth: number
    averageSessionsPerUser: number
  }
}

export default function UserStats({ stats }: UserStatsProps) {
  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+12%',
      period: 'vs last month',
    },
    {
      name: 'Active Users',
      value: stats.activeUsers,
      icon: CheckBadgeIcon,
      color: 'bg-green-500',
      change: '+8%',
      period: 'vs last month',
    },
    {
      name: 'Premium Users',
      value: stats.premiumUsers,
      icon: StarIcon,
      color: 'bg-purple-500',
      change: '+15%',
      period: 'vs last month',
    },
    {
      name: 'Pending',
      value: stats.pendingUsers,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: '-2',
      period: 'vs yesterday',
    },
    {
      name: 'Suspended',
      value: stats.suspendedUsers,
      icon: NoSymbolIcon,
      color: 'bg-red-500',
      change: '0',
      period: 'vs last week',
    },
    {
      name: 'New Today',
      value: stats.newUsersToday,
      icon: ArrowTrendingUpIcon,
      color: 'bg-indigo-500',
      change: `+${stats.newUsersToday}`,
      period: 'today',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-500">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{stat.period}</p>
          </div>
        )
      })}
    </div>
  )
}