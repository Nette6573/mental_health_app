'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import { getMood } from "@/services/moodService"
import { useAuth } from '@/context/AuthContext'

const moodEmojis = {
  1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊',
  6: '😄', 7: '🤩', 8: '🥰', 9: '😇', 10: '🌈'
}

export default function MoodHistory({ refreshTrigger }) {
  const { user } = useAuth()
  const [moodEntries, setMoodEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMoodHistory = async () => {
      setIsLoading(true)
      try {
        const uid = user?.uid ?? user?.id
        if (!uid) return

        const data = await getMood(uid)
        const sorted = [...data.mood_log].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setMoodEntries(sorted.slice(0, 10))
      } catch (err) {
        console.error("MoodHistory fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoodHistory()
  }, [refreshTrigger, user])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getMoodColor = (mood) => {
    if (mood >= 8) return 'text-green-600 dark:text-green-400'
    if (mood >= 6) return 'text-lime-600 dark:text-lime-400'
    if (mood >= 4) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Mood Entries</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{moodEntries.length} entries</span>
      </div>

      <div className="space-y-4">
        {moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No mood entries yet</h4>
            <p className="text-gray-600 dark:text-gray-400">Start tracking your mood to see your history here.</p>
          </div>
        ) : (
          moodEntries.map((entry, index) => (
            <div key={entry.id || index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-center text-2xl">
                  {moodEmojis[entry.mood]}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`text-lg font-bold ${getMoodColor(entry.mood)}`}>{entry.mood}/10</span>
                  {entry.activities && entry.activities.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • {entry.activities.slice(0, 2).join(', ')}
                      {entry.activities.length > 2 && ` +${entry.activities.length - 2}`}
                    </span>
                  )}
                </div>
                {entry.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{entry.note}</p>
                )}
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(entry.date)}</span>
                  {entry.sleepHours > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">💤 {entry.sleepHours}h</span>
                  )}
                  {entry.stressLevel > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">🎯 Stress: {entry.stressLevel}/10</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
