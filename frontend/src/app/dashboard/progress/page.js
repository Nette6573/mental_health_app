'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import ProgressOverview from '@/components/dashboard/progress/ProgressOverview'
import ProgressAnalytics from '@/components/dashboard/progress/ProgressAnalytics'
import ProgressGoals from '@/components/dashboard/progress/ProgressGoals'
import ProgressHistory from '@/components/dashboard/progress/ProgressHistory'
import ProgressAchievements from '@/components/dashboard/progress/ProgressAchievements'

const progressTabs = [
  { id: 'overview', name: 'Overview', icon: '📊', description: 'Your progress summary' },
  { id: 'analytics', name: 'Analytics', icon: '📈', description: 'Detailed insights' },
  { id: 'goals', name: 'Goals', icon: '🎯', description: 'Set and track goals' },
  { id: 'history', name: 'History', icon: '📅', description: 'Past activities' },
  { id: 'achievements', name: 'Achievements', icon: '🏆', description: 'Your accomplishments' },
]

export default function ProgressPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [progressData, setProgressData] = useState(null)

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!authLoading) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock progress data
        const mockProgressData = {
          overallProgress: 68,
          currentStreak: 7,
          totalSessions: 45,
          weeklyConsistency: 85,
          monthlyGrowth: 12,
          spiritualHealth: 72,
          emotionalWellness: 65,
          communityEngagement: 58,
          recentActivities: [
            { type: 'devotional', title: 'Morning Reflection', date: '2024-01-15', duration: '15 min' },
            { type: 'prayer', title: 'Evening Prayer', date: '2024-01-15', duration: '10 min' },
            { type: 'scripture', title: 'Psalm 23 Study', date: '2024-01-14', duration: '25 min' },
            { type: 'community', title: 'Prayed for Sarah', date: '2024-01-14', duration: '5 min' }
          ],
          goals: [
            { id: 1, title: 'Daily Devotional', target: 30, current: 15, type: 'spiritual' },
            { id: 2, title: 'Community Prayer', target: 50, current: 23, type: 'community' },
            { id: 3, title: 'Scripture Reading', target: 100, current: 45, type: 'scripture' }
          ]
        }
        
        setProgressData(mockProgressData)
        setIsLoading(false)
      }
    }

    fetchProgressData()
  }, [authLoading])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your progress...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <ProgressOverview user={user} data={progressData} />
      case 'analytics':
        return <ProgressAnalytics user={user} data={progressData} />
      case 'goals':
        return <ProgressGoals user={user} data={progressData} />
      case 'history':
        return <ProgressHistory user={user} data={progressData} />
      case 'achievements':
        return <ProgressAchievements user={user} data={progressData} />
      default:
        return <ProgressOverview user={user} data={progressData} />
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Progress</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track your spiritual journey and personal growth
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">Current Streak</p>
                    <p className="text-2xl font-bold">{progressData?.currentStreak || 0} days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tabs */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {progressTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex flex-col items-center p-4 rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                    }
                  `}
                >
                  <span className="text-2xl mb-2">{tab.icon}</span>
                  <span className="font-medium text-sm">{tab.name}</span>
                  <span className="text-xs opacity-75 mt-1">{tab.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {renderActiveTab()}
        </div>
      </div>
    </DashboardLayout>
  )
}