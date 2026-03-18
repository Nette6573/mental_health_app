'use client'

import { useState, useEffect } from 'react'
import AdminStats from '@/components/admin/AdminStats'
import RecentUsersTable from '@/components/admin/RecentUsersTable'
import ActivityFeed from '@/components/admin/ActivityFeed'
import QuickActions from '@/components/admin/QuickActions'
import UserGrowthChart from '@/components/admin/charts/UserGrowthChart'
import PageHeader from '@/components/shared/PageHeader'

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalResources: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {

    setTimeout(() => {
      setStats({
        totalUsers: 12543,
        activeUsers: 8765,
        totalResources: 342,
        monthlyGrowth: 12.5
      })
    }, 1000)

  }, [])

  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back Admin"
      />

      <div className="space-y-6">

        <AdminStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              User Growth
            </h3>

            <UserGrowthChart />
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2">
            <RecentUsersTable />
          </div>

          <ActivityFeed />

        </div>

        <QuickActions />

      </div>
    </>
  )
}