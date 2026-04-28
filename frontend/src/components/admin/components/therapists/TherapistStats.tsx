'use client'

import {
  UserGroupIcon,
  CheckBadgeIcon,
  ClockIcon,
  NoSymbolIcon,
  StarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

interface TherapistStatsProps {
  therapists: Array<{
    status: string
    verificationStatus: string
    averageRating: number
    totalSessions: number
  }>
}

export default function TherapistStats({ therapists }: TherapistStatsProps) {
  const stats = [
    {
      name: 'Total Therapists',
      value: therapists.length,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Active',
      value: therapists.filter(t => t.status === 'active').length,
      icon: CheckBadgeIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Pending Verification',
      value: therapists.filter(t => t.verificationStatus === 'pending').length,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Suspended',
      value: therapists.filter(t => t.status === 'suspended').length,
      icon: NoSymbolIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Avg. Rating',
      value: (therapists.reduce((acc, t) => acc + t.averageRating, 0) / therapists.length || 0).toFixed(1),
      icon: StarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Sessions',
      value: therapists.reduce((acc, t) => acc + t.totalSessions, 0).toLocaleString(),
      icon: CalendarIcon,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}