'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import ProfileSettings from '@/components/dashboard/settings/ProfileSettings'
import AccountSettings from '@/components/dashboard/settings/AccountSettings'
import PrivacySettings from '@/components/dashboard/settings/PrivacySettings'
import NotificationSettings from '@/components/dashboard/settings/NotificationSettings'
import DisplaySettings from '@/components/dashboard/settings/DisplaySettings'
import HelpSupport from '@/components/dashboard/settings/HelpSupport'

const settingsSections = [
  { id: 'profile', name: 'Profile', icon: '👤', description: 'Personal information and preferences' },
  { id: 'account', name: 'Account', icon: '🔐', description: 'Security and login settings' },
  { id: 'privacy', name: 'Privacy', icon: '🛡️', description: 'Data and privacy controls' },
  { id: 'notifications', name: 'Notifications', icon: '🔔', description: 'Alert and notification preferences' },
  { id: 'display', name: 'Display', icon: '🎨', description: 'Theme and appearance settings' },
  { id: 'help', name: 'Help & Support', icon: '💬', description: 'Get help and support' },
]

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('profile')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false)
    }
  }, [authLoading])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings user={user} />
      case 'account':
        return <AccountSettings user={user} />
      case 'privacy':
        return <PrivacySettings user={user} />
      case 'notifications':
        return <NotificationSettings user={user} />
      case 'display':
        return <DisplaySettings user={user} />
      case 'help':
        return <HelpSupport user={user} />
      default:
        return <ProfileSettings user={user} />
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <nav className="space-y-2">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${activeSection === section.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      }
                    `}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{section.name}</div>
                      <div className="text-sm opacity-75">{section.description}</div>
                    </div>
                    {activeSection === section.id && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Account Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Member since</span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(user.createdAt || '2024-01-01').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Plan</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}