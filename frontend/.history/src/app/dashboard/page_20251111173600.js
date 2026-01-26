'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import WelcomeBanner from '@/components/dashboard/overview/WelcomeBanner'
import StatsCards from '@/components/dashboard/overview/StatsCards'
import MoodTracker from '@/components/dashboard/overview/MoodTracker'
import RecentActivity from '@/components/dashboard/overview/RecentActivity'
import QuickActions from '@/components/dashboard/overview/QuickActions'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner user={user} />

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <MoodTracker />
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Additional Widgets can go here */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Weekly Insight
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  &quot;Your consistency in daily check-ins is showing positive results. 
                  Remember to celebrate small victories along your journey.&quot;
                </p>
                <div className="flex items-center mt-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">AI</span>
                  </div>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    HopePath Assistant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}