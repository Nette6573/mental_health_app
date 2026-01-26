'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import DailyDevotional from '@/components/dashboard/faith/DailyDevotional'
import PrayerWall from '@/components/dashboard/faith/PrayerWall'
import ScriptureStudy from '@/components/dashboard/faith/ScriptureStudy'
import FaithCommunity from '@/components/dashboard/faith/FaithCommunity'
import SpiritualPractices from '@/components/dashboard/faith/SpiritualPractices'

const faithCategories = [
  { id: 'devotionals', name: 'Daily Devotionals', icon: '📖', description: 'Start your day with God\'s word', color: 'from-blue-500 to-blue-600' },
  { id: 'prayer', name: 'Prayer Resources', icon: '🙏', description: 'Guided prayers and intercession', color: 'from-green-500 to-green-600' },
  { id: 'scripture', name: 'Scripture Studies', icon: '📚', description: 'Deep dive into God\'s word', color: 'from-purple-500 to-purple-600' },
  { id: 'community', name: 'Faith Community', icon: '👥', description: 'Connect with other believers', color: 'from-orange-500 to-orange-600' },
  { id: 'practices', name: 'Spiritual Practices', icon: '🌱', description: 'Grow in your spiritual walk', color: 'from-red-500 to-red-600' },
  { id: 'worship', name: 'Worship & Music', icon: '🎵', description: 'Praise and worship resources', color: 'from-indigo-500 to-indigo-600' }
]

export default function FaithResourcesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('devotionals')
  const [todaysVerse, setTodaysVerse] = useState(null)

  useEffect(() => {
    // Fetch today's verse
    const fetchTodaysVerse = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setTodaysVerse({
        verse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        reference: "Philippians 4:6",
        translation: "NIV"
      })
    }

    fetchTodaysVerse()
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading faith resources...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Faith Resources
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Strengthen your spiritual journey with biblical resources and community support
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium">Your Spiritual Journey</p>
              <p className="text-xs opacity-90">Day 7 of consistent engagement</p>
            </div>
          </div>
        </div>

        {/* Today's Verse Banner */}
        {todaysVerse && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">📖</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Today&apos;s Scripture</h2>
                <blockquote className="text-lg italic mb-2">
                  &ldquo;{todaysVerse.verse}&ldquo;
                </blockquote>
                <p className="text-blue-100 font-medium">
                  {todaysVerse.reference} • {todaysVerse.translation}
                </p>
              </div>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors">
                Save Verse
              </button>
            </div>
          </div>
        )}

        {/* Category Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {faithCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveSection(category.id)}
                className={`
                  flex flex-col items-center p-4 rounded-xl transition-all duration-200
                  ${activeSection === category.id
                    ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg transform scale-105'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:shadow-md'
                  }
                `}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeSection === 'devotionals' && <DailyDevotional />}
            {activeSection === 'prayer' && <PrayerWall />}
            {activeSection === 'scripture' && <ScriptureStudy />}
            {activeSection === 'community' && <FaithCommunity />}
            {activeSection === 'practices' && <SpiritualPractices />}
            {activeSection === 'worship' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Worship & Music</h2>
                <p className="text-gray-600 dark:text-gray-400">Worship content coming soon...</p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Spiritual Check-in */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
                🌱 Spiritual Check-in
              </h3>
              <p className="text-green-700 dark:text-green-400 text-sm mb-4">
                How is your spirit today?
              </p>
              <div className="space-y-2">
                {[
                  { emoji: '😔', label: 'Struggling' },
                  { emoji: '😐', label: 'Neutral' },
                  { emoji: '🙂', label: 'Peaceful' },
                  { emoji: '😊', label: 'Joyful' },
                  { emoji: '🕊️', label: 'At Peace' }
                ].map((mood, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    <span className="text-lg">{mood.emoji}</span>
                    <span className="text-sm text-green-800 dark:text-green-300">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Prayers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🙏 Quick Prayers
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Morning Prayer', duration: '2 min', icon: '🌅' },
                  { title: 'Peace in Anxiety', duration: '3 min', icon: '🕊️' },
                  { title: 'Strength for Today', duration: '2 min', icon: '💪' },
                  { title: 'Evening Reflection', duration: '4 min', icon: '🌙' }
                ].map((prayer, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{prayer.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{prayer.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{prayer.duration}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Encouragement */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-3">
                💫 Word of Encouragement
              </h3>
              <p className="text-purple-700 dark:text-purple-400 text-sm italic mb-4">
                &ldquo;The Lord is close to the brokenhearted and saves those who are crushed in spirit.&ldquo;
              </p>
              <p className="text-purple-600 dark:text-purple-500 text-xs font-medium">
                Psalm 34:18
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}