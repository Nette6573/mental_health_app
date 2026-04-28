'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import { getMood } from "@/services/moodService"
import { useAuth } from '@/context/AuthContext'

export default function MoodInsights({ refreshTrigger }) {
  const { user } = useAuth()
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true)
      try {
        const uid = user?.uid ?? user?.id
        if (!uid) return

        const data = await getMood(uid)
        const moods = data.mood_log || []

        if (moods.length === 0) {
          setInsights(null)
          return
        }

        const avg = moods.reduce((sum, m) => sum + m.mood, 0) / moods.length

        const trend =
          moods.length > 5
            ? moods.slice(-3).reduce((s, m) => s + m.mood, 0) >
              moods.slice(0, 3).reduce((s, m) => s + m.mood, 0)
              ? "improving"
              : "declining"
            : "stable"

        // Find best day
        const dayTotals = {}
        const dayCounts = {}
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        moods.forEach((m) => {
          const day = new Date(m.date).getDay()
          dayTotals[day] = (dayTotals[day] || 0) + m.mood
          dayCounts[day] = (dayCounts[day] || 0) + 1
        })
        let bestDayIndex = 0
        let bestAvg = 0
        Object.keys(dayTotals).forEach((day) => {
          const avg = dayTotals[day] / dayCounts[day]
          if (avg > bestAvg) { bestAvg = avg; bestDayIndex = parseInt(day) }
        })

        setInsights({
          averageMood: avg.toFixed(1),
          moodTrend: trend,
          bestDay: moods.length > 3 ? dayNames[bestDayIndex] : "N/A",
          sleepCorrelation: 0,
          weeklyPattern: moods.length > 7
            ? "You have a consistent tracking habit. Keep it up!"
            : "Keep tracking to see weekly patterns.",
          recommendation:
            avg < 5
              ? "Consider rest or talking to someone. You deserve support."
              : "You're doing well — keep it up!",
        })
      } catch (err) {
        console.error("MoodInsights error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [refreshTrigger, user])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mood Insights</h2>
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No mood data yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Start logging your mood to see insights here.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mood Insights</h2>
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm text-blue-800 dark:text-blue-300">Average Mood</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{insights.averageMood}/10</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <span className="text-sm text-green-800 dark:text-green-300">Trend</span>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {insights.moodTrend === 'improving' ? '↗ Improving' : insights.moodTrend === 'declining' ? '↘ Declining' : '→ Stable'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <span className="text-sm text-purple-800 dark:text-purple-300">Best Day</span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{insights.bestDay}</span>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">{insights.weeklyPattern}</p>
        </div>

        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <h4 className="text-sm font-semibold text-primary-800 dark:text-primary-300 mb-1">💡 Recommendation</h4>
          <p className="text-sm text-primary-700 dark:text-primary-400">{insights.recommendation}</p>
        </div>
      </div>
    </Card>
  )
}
