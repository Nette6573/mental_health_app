'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/ui/Button'
import EmotionPicker from '@/components/ui/EmotionPicker'

const moodEmojis = {
  1: { emoji: '😢', label: 'Very Sad', color: 'bg-red-500' },
  2: { emoji: '😔', label: 'Sad', color: 'bg-red-400' },
  3: { emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
  4: { emoji: '🙂', label: 'Okay', color: 'bg-lime-400' },
  5: { emoji: '😊', label: 'Good', color: 'bg-green-400' },
  6: { emoji: '😄', label: 'Happy', color: 'bg-green-500' },
  7: { emoji: '🤩', label: 'Very Happy', color: 'bg-blue-500' },
  8: { emoji: '🥰', label: 'Loved', color: 'bg-purple-500' },
  9: { emoji: '😇', label: 'Blessed', color: 'bg-indigo-500' },
  10: { emoji: '🌈', label: 'Amazing', color: 'bg-pink-500' }
}

const activities = [
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'exercise', label: 'Exercise', emoji: '🏃‍♀️' },
  { id: 'social', label: 'Social', emoji: '👥' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'hobby', label: 'Hobby', emoji: '🎨' },
  { id: 'rest', label: 'Rest', emoji: '😴' },
  { id: 'nature', label: 'Nature', emoji: '🌳' },
  { id: 'learning', label: 'Learning', emoji: '📚' }
]

const emotions = [
  { id: 'grateful', label: 'Grateful', emoji: '🙏' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'peaceful', label: 'Peaceful', emoji: '☮️' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'focused', label: 'Focused', emoji: '🎯' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😵' }
]

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

  const handleActivityToggle = (activityId) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activityId)
        ? prev.activities.filter(id => id !== activityId)
        : [...prev.activities, activityId]
    }))
  }

  const handleEmotionToggle = (emotionId) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotionId)
        ? prev.emotions.filter(id => id !== emotionId)
        : [...prev.emotions, emotionId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.mood) {
      alert('Please select how you are feeling')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage (replace with actual API)
      const moodEntry = {
        id: Date.now(),
        userId: user.id,
        mood: formData.mood,
        note: formData.note,
        activities: formData.activities,
        emotions: formData.emotions,
        sleepHours: formData.sleepHours,
        stressLevel: formData.stressLevel,
        date: selectedDate.toISOString(),
        timestamp: new Date().toISOString()
      }

      // Get existing entries
      const existingEntries = JSON.parse(localStorage.getItem('hopepath_mood_entries') || '[]')
      const updatedEntries = [...existingEntries, moodEntry]
      localStorage.setItem('hopepath_mood_entries', JSON.stringify(updatedEntries))

      onSuccess()
    } catch (error) {
      console.error('Failed to save mood entry:', error)
      alert('Failed to save your mood entry. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Display */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Logging mood for</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {formatDate(selectedDate)}
        </p>
      </div>

      {/* Mood Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          How are you feeling? *
        </label>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(moodEmojis).map(([level, data]) => (
            <button
              key={level}
              type="button"
              onClick={() => handleMoodSelect(parseInt(level))}
              className={`
                flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200
                ${formData.mood === parseInt(level)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }
                hover:scale-105 hover:shadow-md
              `}
            >
              <span className="text-2xl mb-1">{data.emoji}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{level}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stress Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Stress Level: {formData.stressLevel}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.stressLevel}
          onChange={(e) => setFormData(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Activities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          What did you do today?
        </label>
        <div className="grid grid-cols-4 gap-2">
          {activities.map(activity => (
            <button
              key={activity.id}
              type="button"
              onClick={() => handleActivityToggle(activity.id)}
              className={`
                flex flex-col items-center p-2 rounded-lg border transition-all duration-200
                ${formData.activities.includes(activity.id)
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                }
              `}
            >
              <span className="text-lg mb-1">{activity.emoji}</span>
              <span className="text-xs">{activity.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Emotions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Specific emotions you felt
        </label>
        <EmotionPicker
          emotions={emotions}
          selectedEmotions={formData.emotions}
          onEmotionToggle={handleEmotionToggle}
        />
      </div>

      {/* Sleep */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hours of sleep last night
        </label>
        <input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={formData.sleepHours}
          onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: e.target.value }))}
          placeholder="e.g., 7.5"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional notes (optional)
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
          placeholder="How was your day? Any specific thoughts or feelings you want to remember?"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          loading={isLoading}
          disabled={!formData.mood || isLoading}
        >
          Save Mood Entry
        </Button>
      </div>
    </form>
  )
}