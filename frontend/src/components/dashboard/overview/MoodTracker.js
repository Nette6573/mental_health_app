'use client'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/LandingButton'
import { useState } from "react"
import MoodEntryForm from '@/components/dashboard/mood/MoodEntryForm'

const moodEmojis = {
  1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊', 
  6: '😄', 7: '🤩', 8: '🥰', 9: '😇', 10: '🌈'
}

export default function MoodTracker({ userData }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

  const week = []

  for (let i = 0; i < 7; i++) {
    week.push({
      day: weekDays[i],
      mood: null,
      filled: false
    })
  }

  (userData?.moods || []).forEach((m) => {
    const date = new Date(m.date + "Z")
    const dayIndex = date.getDay()

    week[dayIndex] = {
      day: weekDays[dayIndex],
      mood: m.value,
      filled: true
    }
  })

  const moodData = week

  // ---------------- INSIGHTS ----------------
  const moods = (userData?.moods || []).slice(0)

  let insight = "Start logging moods to see insights."

  if (moods.length >= 5) {
    const recent = moods.slice(-7)

    const avg =
      recent.reduce((sum, m) => sum + m.value, 0) / recent.length

    insight = `Your average mood is ${avg.toFixed(1)}/10 this week.`
  }

  return (
    <Card className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          Mood Tracker
        </h3>

        <Button onClick={() => setShowForm(true)}>
          Log Mood
        </Button>
      </div>

      {/* Weekly Chart */}
      <div className="mb-6">
        <div className="flex justify-between items-end h-32">
          {moodData.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs">{day.day}</div>

              {day.filled ? (
                <span className="text-lg">
                  {moodEmojis[day.mood]}
                </span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm">
          💡 {insight}
        </p>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">

            <MoodEntryForm
              selectedDate={new Date()}
              onSuccess={() => {
                setShowForm(false)
                window.location.reload()
              }}
              onCancel={() => setShowForm(false)}
            />

          </div>
        </div>
      )}

    </Card>
  )
}