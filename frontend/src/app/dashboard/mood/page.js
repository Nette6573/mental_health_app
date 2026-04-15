'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import MoodCalendar from '@/components/dashboard/mood/MoodCalendar'
import MoodEntryForm from '@/components/dashboard/mood/MoodEntryForm'
import MoodInsights from '@/components/dashboard/mood/MoodInsights'
import MoodHistory from '@/components/dashboard/mood/MoodHistory'
import MoodPatterns from '@/components/dashboard/mood/MoodPatterns'
import Modal from '@/components/ui/Modal'

export default function MoodTrackingPage() {
  const { user, loading, isLoading } = useAuth()
  const router = useRouter()

  const [showMoodModal, setShowMoodModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // 🔥 FIX: handle redirect safely
  useEffect(() => {
    if (!loading && !isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, isLoading, router])

  // 🔥 Loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading mood tracker...
          </p>
        </div>
      </div>
    )
  }

  // 🔥 Prevent render if redirecting
  if (!user) return null

  // ---------------- HANDLERS ----------------

  const handleMoodLogged = () => {
    setShowMoodModal(false)

    // 🔥 THIS IS YOUR GLOBAL REFRESH TRIGGER
    setRefreshTrigger(prev => prev + 1)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setShowMoodModal(true)
  }

  // ---------------- UI ----------------

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mood Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your emotional journey and discover patterns
            </p>
          </div>

          <button
            onClick={() => setShowMoodModal(true)}
            className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Log Mood
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <MoodCalendar
              onDateSelect={handleDateSelect}
              refreshTrigger={refreshTrigger}
            />

            <MoodHistory refreshTrigger={refreshTrigger} />
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <MoodInsights refreshTrigger={refreshTrigger} />
            <MoodPatterns refreshTrigger={refreshTrigger} />
          </div>

        </div>

        {/* MODAL */}
        <Modal
          isOpen={showMoodModal}
          onClose={() => setShowMoodModal(false)}
          title="How are you feeling?"
          size="lg"
        >
          <MoodEntryForm
            selectedDate={selectedDate}
            onSuccess={handleMoodLogged}
            onCancel={() => setShowMoodModal(false)}
          />
        </Modal>

      </div>
    </DashboardLayout>
  )
}