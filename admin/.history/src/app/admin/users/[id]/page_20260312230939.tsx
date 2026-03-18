'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import PageHeader from '@/components/shared/PageHeader'

interface UserDetails {
  id: string
  name: string
  email: string
  role: 'user' | 'premium' | 'counselor'
  status: 'active' | 'inactive' | 'suspended'
  joinedDate: string
  lastActive: string
  sessions: number
  phone?: string
  dateOfBirth?: string
  address?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  preferences?: {
    newsletter: boolean
    notifications: boolean
    twoFactor: boolean
  }
  sessionHistory?: Array<{
    id: string
    date: string
    therapist: string
    duration: number
    status: 'completed' | 'cancelled' | 'scheduled'
  }>
}

const MOCK_USER: UserDetails = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'premium',
  status: 'active',
  joinedDate: '2025-01-15',
  lastActive: '2025-03-10',
  sessions: 12,
  phone: '+1-876-555-0123',
  dateOfBirth: '1990-05-15',
  address: '123 Main St, Kingston, Jamaica',
  emergencyContact: {
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+1-876-555-0124',
  },
  preferences: {
    newsletter: true,
    notifications: true,
    twoFactor: false,
  },
  sessionHistory: [
    {
      id: 's1',
      date: '2025-03-10',
      therapist: 'Dr. Sarah Johnson',
      duration: 50,
      status: 'completed',
    },
    {
      id: 's2',
      date: '2025-03-03',
      therapist: 'Dr. Sarah Johnson',
      duration: 50,
      status: 'completed',
    },
    {
      id: 's3',
      date: '2025-02-24',
      therapist: 'Dr. Sarah Johnson',
      duration: 50,
      status: 'cancelled',
    },
  ],
}

export default function UserDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser(MOCK_USER)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'premium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'counselor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'sessions', name: 'Session History' },
    { id: 'preferences', name: 'Preferences' },
    { id: 'billing', name: 'Billing' },
  ]

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Users
        </button>
        <Link
          href={`/admin/users/${user.id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <PencilIcon className="w-5 h-5 mr-2" />
          Edit User
        </Link>
      </div>

      {/* User Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <span className="text-3xl text-primary-600 dark:text-primary-400 font-medium">
              {user.name.charAt(0)}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="w-4 h-4" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <PhoneIcon className="w-4 h-4" />
                  {user.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CalendarIcon className="w-4 h-4" />
                Joined {new Date(user.joinedDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <ClockIcon className="w-4 h-4" />
                Last active {new Date(user.lastActive).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.sessions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex -mb-px space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{user.address || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {user.emergencyContact && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{user.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium">{user.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{user.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Session History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Therapist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.sessionHistory?.map(session => (
                    <tr key={session.id}>
                      <td className="px-6 py-4">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{session.therapist}</td>
                      <td className="px-6 py-4">{session.duration} min</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">User Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Newsletter Subscription</p>
                  <p className="text-sm text-gray-500">Receive updates and resources via email</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  user.preferences?.newsletter ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.preferences?.newsletter ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive session reminders and updates</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  user.preferences?.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.preferences?.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Additional security for account access</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  user.preferences?.twoFactor ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.preferences?.twoFactor ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="text-center py-8">
            <p className="text-gray-500">Billing information coming soon</p>
          </div>
        )}
      </div>
    </>
  )
}