'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/LandingButton'
import { saveMood } from "@/services/moodService"

const moodEmojis = {
  1: { emoji: '😢', label: 'Very Sad' },
  2: { emoji: '😔', label: 'Sad' },
  3: { emoji: '😐', label: 'Neutral' },
  4: { emoji: '🙂', label: 'Okay' },
  5: { emoji: '😊', label: 'Good' },
  6: { emoji: '😄', label: 'Happy' },
  7: { emoji: '🤩', label: 'Very Happy' },
  8: { emoji: '🥰', label: 'Loved' },
  9: { emoji: '😇', label: 'Blessed' },
  10: { emoji: '🌈', label: 'Amazing' }
}

export default function MoodEntryForm({ selectedDate, onSuccess, onCancel }) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    mood: null,
    note: '',
    activities: [],
    emotions: [],
    sleepHours: '',
    stressLevel: 5
  })

  const handleMoodSelect = (moodLevel) => {
    setFormData(prev => ({ ...prev, mood: moodLevel }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.mood) {
      alert("Please select how you are feeling")
      return
    }

    const uid = user?.uid ?? user?.id
    if (!uid) {
      alert("User not authenticated")
      return
    }

    setIsLoading(true)
    try {
      await saveMood(uid, {
        mood: formData.mood,
        note: formData.note || "",
        activities: formData.activities || [],
        emotions: formData.emotions || [],
        sleepHours: Number(formData.sleepHours) || 0,
        stressLevel: formData.stressLevel || 0,
        date: selectedDate instanceof Date
          ? selectedDate.toISOString()
          : selectedDate || new Date().toISOString(),
      })

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Mood save error:", error)
      alert("Failed to save mood. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Date */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Logging mood for</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(selectedDate)}</p>
      </div>

      {/* Mood Selection */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">How are you feeling?</p>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(moodEmojis).map(([level, data]) => {
            const value = parseInt(level)
            return (
              <button
                key={level}
                type="button"
                onClick={() => handleMoodSelect(value)}
                disabled={isLoading}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.mood === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-xl block text-center">{data.emoji}</span>
                <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">{level}</div>
              </button>
            )
          })}
        </div>
        {formData.mood && (
          <p className="text-center text-sm text-primary-600 dark:text-primary-400 mt-2 font-medium">
            {moodEmojis[formData.mood].emoji} {moodEmojis[formData.mood].label}
          </p>
        )}
      </div>

      {/* Sleep Hours */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Hours of sleep last night
        </label>
        <input
          type="number"
          min="0"
          max="24"
          value={formData.sleepHours}
          onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: e.target.value }))}
          placeholder="e.g. 7"
          disabled={isLoading}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm dark:bg-gray-700 dark:text-white outline-none focus:border-primary-500"
        />
      </div>

      {/* Stress Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Stress level: {formData.stressLevel}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.stressLevel}
          onChange={(e) => setFormData(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
          disabled={isLoading}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
          placeholder="How was your day? What's on your mind?"
          disabled={isLoading}
          rows={3}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm dark:bg-gray-700 dark:text-white outline-none focus:border-primary-500 resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Mood"}
        </Button>
      </div>
    </form>
  )
}
