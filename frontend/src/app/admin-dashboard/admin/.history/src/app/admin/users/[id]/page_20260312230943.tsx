'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BookOpenIcon,
  StarIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { MOCK_USERS, MOCK_USER_ACTIVITY, MOCK_USER_SESSIONS, MOCK_USER_RESOURCES } from '@/constants/user'

export default function UserDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [suspendReason, setSuspendReason] = useState('')
  const [suspendDuration, setSuspendDuration] = useState('7')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const found = MOCK_USERS.find(u => u.id === params.id)
      setUser(found)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'premium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'counselor': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleSuspend = () => {
    // In a real app, this would call an API
    console.log('Suspending user:', user.id, suspendReason, suspendDuration)
    setShowSuspendModal(false)
    // Update local state
    setUser({
      ...user,
      status: 'suspended',
      suspendedUntil: suspendDuration === 'permanent' ? undefined : new Date(Date.now() + parseInt(suspendDuration) * 24 * 60 * 60 * 1000).toISOString(),
      suspensionReason: suspendReason,
    })
  }

  const handleActivate = () => {
    // In a real app, this would call an API
    console.log('Activating user:', user.id)
    setUser({
      ...user,
      status: 'active',
      suspendedUntil: undefined,
      suspensionReason: undefined,
    })
  }

  const handleResendVerification = () => {
    // In a real app, this would call an API
    console.log('Resending verification email to:', user.email)
    alert('Verification email sent!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            User Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'activity', name: 'Activity', icon: ClockIcon },
    { id: 'sessions', name: 'Sessions', icon: UserGroupIcon },
    { id: 'resources', name: 'Resources', icon: BookOpenIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  ]

  return (
    <>
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Users
        </button>

        <div className="flex items-center gap-3">
          {user.status === 'suspended' ? (
            <button
              onClick={handleActivate}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Activate Account
            </button>
          ) : (
            <button
              onClick={() => setShowSuspendModal(true)}
              className="inline-flex items