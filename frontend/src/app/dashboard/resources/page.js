'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import Tabs from '@/components/ui/Tabs'

const ResourceLibrary = lazy(() => import('@/components/dashboard/resources/ResourceLibrary'))
const TherapistDirectory = lazy(() => import('@/components/dashboard/resources/TherapistDirectory'))
const FaithResources = lazy(() => import('@/components/dashboard/resources/FaithResources'))

const TabSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-80 animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
          <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
)

const CRISIS_HOTLINES = {
  primary: {
    name: 'Jamaica Mental Health Helpline',
    number: '+1 (888) 991-4673',
    displayNumber: '888-991-HELP',
    is24_7: true
  },
  backup: {
    name: 'Jamaica Crisis Centre',
    number: '+1 (876) 927-1798',
    displayNumber: '(876) 927-1798',
    is24_7: false
  },
  international: {
    name: 'International Suicide Prevention',
    number: '+1 (800) 273-8255',
    displayNumber: '800-273-8255',
    is24_7: true
  }
}

export default function ResourcesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('library')

  useEffect(() => {
    const savedTab = localStorage.getItem('resourcesActiveTab')
    if (savedTab && ['library', 'therapists', 'faith'].includes(savedTab)) {
      setActiveTab(savedTab)
    }
  }, [])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    localStorage.setItem('resourcesActiveTab', tabId)
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your resources...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'library', name: 'Resource Library', icon: '📚' },
    { id: 'therapists', name: 'Find Therapists', icon: '👨‍⚕️' },
    { id: 'faith', name: 'Faith Resources', icon: '🙏' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'library':
        return <ResourceLibrary />
      case 'therapists':
        return <TherapistDirectory />
      case 'faith':
        return <FaithResources />
      default:
        return <ResourceLibrary />
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Mental Health Resources
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Access professional resources, find therapists, and explore faith-based support
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 min-w-[200px]">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-lg">🆘</span>
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                  Crisis Support
                </p>
                <div className="space-y-1">
                  <a 
                    href={`tel:${CRISIS_HOTLINES.primary.number.replace(/\s/g, '')}`}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium block"
                  >
                    {CRISIS_HOTLINES.primary.displayNumber}
                    {CRISIS_HOTLINES.primary.is24_7 && (
                      <span className="text-xs ml-1 text-green-600 dark:text-green-400">(24/7)</span>
                    )}
                  </a>
                  <details className="text-xs text-gray-500 dark:text-gray-400">
                    <summary className="cursor-pointer">More crisis lines</summary>
                    <div className="mt-1 space-y-1">
                      <a href={`tel:${CRISIS_HOTLINES.backup.number.replace(/\s/g, '')}`} className="block hover:text-red-600">
                        {CRISIS_HOTLINES.backup.name}: {CRISIS_HOTLINES.backup.displayNumber}
                      </a>
                      <a href={`tel:${CRISIS_HOTLINES.international.number.replace(/\s/g, '')}`} className="block hover:text-red-600">
                        {CRISIS_HOTLINES.international.name}: {CRISIS_HOTLINES.international.displayNumber}
                      </a>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="mt-6">
          <Suspense fallback={<TabSkeleton />}>
            {renderTabContent()}
          </Suspense>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            The information provided through these resources is for educational and informational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            If you are in crisis or experiencing a medical emergency, please call emergency services immediately.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}