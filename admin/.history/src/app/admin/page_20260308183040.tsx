'use client'

import { useState, useEffect } from 'react'
import AdminStats from '@/components/admin/AdminStats'
import RecentUsersTable from '@/components/admin/RecentUsersTable'
import ActivityFeed from '@/components/admin/ActivityFeed'
import QuickActions from '@/components/admin/QuickActions'
import UserGrowthChart from '@/components/admin/charts/UserGrowthChart'
import ResourceUsageChart from '@/components/admin/charts/ResourceUsageChart'
import PageHeader from '@/components/shared/PageHeader'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalResources: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalUsers: 12543,
          activeUsers: 8765,
          totalResources: 342,
          monthlyGrowth: 12.5
        })
      }, 1000)
    }

    fetchStats()
  }, [])

  return (
    <>
      <PageHeader 
        title="Dashboard Overview" 
        subtitle="Welcome back, Admin! Here's what's happening with HopePath today."
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        <AdminStats stats={stats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <UserGrowthChart />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
            <ResourceUsageChart />
          </div>
        </div>

        {/* Tables and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users Table - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <RecentUsersTable />
          </div>

          {/* Activity Feed - Takes 1/3 of the space */}
          <div>
            <ActivityFeed />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </>
  )
}