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
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    mood: null,
    note: '',
    activities: [],
    emotions: [],
    sleepHours: '',
    stressLevel: 5
  })

  // ---------------- HANDLERS ----------------

  const handleMoodSelect = (moodLevel) => {
    setFormData(prev => ({ ...prev, mood: moodLevel }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) {
      alert("Still loading user, please wait...")
      return
    }

    if (!formData.mood) {
      alert("Please select how you are feeling")
      return
    }

    // 🔥 Handle BOTH id and uid safely
    const userId = user?.id || user?.uid

    if (!userId) {
      alert("User not authenticated")
      return
    }

    setIsLoading(true)

    try {
      await saveMood(userId, {
        mood: formData.mood,
        note: formData.note || "",
        activities: formData.activities || [],
        emotions: formData.emotions || [],
        sleepHours: formData.sleepHours || 0,
        stressLevel: formData.stressLevel || 0,
        date: selectedDate || new Date().toISOString()
      })

      // 🔥 trigger dashboard refresh
      if (onSuccess) onSuccess()

    } catch (error) {
      console.error("Mood save error:", error)
      alert("Failed to save mood")
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------- FORMAT DATE ----------------

  const formatDate = (date) => {
    if (!date) return ""

    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // ---------------- UI ----------------

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Date */}
      <div className="text-center">
        <p className="text-sm text-gray-600">Logging mood for</p>
        <p className="text-lg font-semibold">
          {formatDate(selectedDate)}
        </p>
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(moodEmojis).map(([level, data]) => {
          const value = parseInt(level)

          return (
            <button
              key={level}
              type="button"
              onClick={() => handleMoodSelect(value)}
              disabled={isLoading}
              className={`p-3 rounded-xl border transition ${
                formData.mood === value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{data.emoji}</span>
              <div className="text-xs">{level}</div>
            </button>
          )
        })}
      </div>

      {/* Notes */}
      <textarea
        value={formData.note}
        onChange={(e) =>
          setFormData(prev => ({ ...prev, note: e.target.value }))
        }
        placeholder="How was your day?"
        disabled={isLoading}
        className="w-full border rounded p-2"
      />

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading || loading}
        >
          {isLoading ? "Saving..." : "Save Mood"}
        </Button>
      </div>

    </form>
  )
}