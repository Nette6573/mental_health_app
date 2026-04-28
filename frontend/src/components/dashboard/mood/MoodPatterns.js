'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import { getMood } from "@/services/moodService"
import { useAuth } from '@/context/AuthContext'

export default function MoodPatterns({ refreshTrigger }) {
  const { user } = useAuth()
  const [patterns, setPatterns] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPatterns = async () => {
      setIsLoading(true)
      try {
        const uid = user?.uid ?? user?.id
        if (!uid) return

        const data = await getMood(uid)
        const moods = data.mood_log || []

        const weekly = Array(7).fill(0)
        const weeklyCounts = Array(7).fill(0)

        moods.forEach((entry) => {
          const d = new Date(entry.date)
          const day = d.getDay()
          weekly[day] += entry.mood
          weeklyCounts[day]++
        })

        const weeklyAvg = weekly.map((total, i) =>
          weeklyCounts[i] > 0 ? Math.round(total / weeklyCounts[i]) : 0
        )

        setPatterns({
          weeklyTrend: weeklyAvg,
          bestTime: "Evening",
          activityImpact: [],
          sleepThreshold: 7,
          consistency: Math.min(100, moods.length * 10),
        })
      } catch (err) {
        console.error("MoodPatterns error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatterns()
  }, [refreshTrigger, user])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!patterns) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mood Patterns</h2>
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No pattern data yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Log more moods to see your patterns.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mood Patterns</h2>
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      <div className="space-y-6">
        {/* Weekly Trend */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Weekly Trend</h4>
          <div className="flex items-end justify-between h-24">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={`${day}-${index}`} className="flex flex-col items-center flex-1">
                <div
                  className="w-6 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(patterns.weeklyTrend[index] / 10) * 60}px` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{day}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {patterns.weeklyTrend[index] || '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm text-blue-800 dark:text-blue-300">Best Time of Day</span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{patterns.bestTime}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-green-800 dark:text-green-300">Sleep Sweet Spot</span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">{patterns.sleepThreshold}+ hours</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <span className="text-sm text-purple-800 dark:text-purple-300">Tracking Consistency</span>
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">{patterns.consistency}%</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
