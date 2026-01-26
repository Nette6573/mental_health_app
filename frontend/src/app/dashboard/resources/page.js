'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import ResourceLibrary from '@/components/dashboard/resources/ResourceLibrary'
import TherapistDirectory from '@/components/dashboard/resources/TherapistDirectory'
import FaithResources from '@/components/dashboard/resources/FaithResources'
import Tabs from '@/components/ui/Tabs'

export default function ResourcesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('library')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resources...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const tabs = [
    { id: 'library', name: 'Resource Library', icon: '📚' },
    { id: 'therapists', name: 'Find Therapists', icon: '👨‍⚕️' },
    { id: 'faith', name: 'Faith Resources', icon: '🙏' }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mental Health Resources
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Access professional resources, find therapists, and explore faith-based support
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg px-4 py-2">
              <p className="text-sm text-primary-700 dark:text-primary-300">
                <span className="font-semibold">Crisis Support:</span> Available 24/7
              </p>
              <a 
                href="tel:+18765554321" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
              >
                +1 (876) 555-HELP
              </a>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'library' && <ResourceLibrary />}
          {activeTab === 'therapists' && <TherapistDirectory />}
          {activeTab === 'faith' && <FaithResources />}
        </div>
      </div>
    </DashboardLayout>
  )
}