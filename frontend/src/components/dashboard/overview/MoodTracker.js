import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useState } from "react"

const moodEmojis = {
  1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊', 
  6: '😄', 7: '🤩', 8: '🥰', 9: '😇', 10: '🌈'
}

export default function MoodTracker({ userData }) {
  const handleLogMood = async () => {
    const uid = localStorage.getItem("uid")

    if (!uid || selectedMood === null) return

    await fetch(`http://127.0.0.1:8000/api/log-mood/${uid}/${selectedMood}`, {
      method: "POST"
    })

    window.location.reload()
  }

  const [selectedMood, setSelectedMood] = useState(null)

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

  // checker
  while (moodData.length < 7) {
    moodData.unshift({
      day: "",
      mood: null,
      filled: false
    })
  }

  // real insights logic
  const moods = (userData?.moods || []).slice(0)

  let insight = "Start logging moods to see insights."

  if (moods.length >= 5) {
    const recent = moods.slice(-7)
    const older = moods.slice(-14, -7)

    const avg = (arr) =>
      arr.reduce((sum, m) => sum + m.value, 0) / (arr.length || 1)

    const recentAvg = avg(recent)
    const olderAvg = avg(older)

    const diff = recentAvg - olderAvg

    if (moods.length < 5) {
      insight = "Log a few more days to unlock insights."
    }

    if (older.length === 0) {
      insight = `Your average mood is ${recentAvg.toFixed(1)}/10 this week.`
    } else if (diff > 0) {
      insight = `Your mood improved by ${Math.round(diff * 10)}% this week. Great job maintaining your wellness practices!`
    } else if (diff < 0) {
      insight = `Your mood dropped by ${Math.round(Math.abs(diff * 10))}% this week. Please consider using some of the resources available to support your mental health.`
    } else {
      insight = "Your mood stayed consistent this week."
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mood Tracker
        </h3>
        <p className="text-sm text-gray-500">
          Last Mood: {userData?.last_mood || "Not set"} 
        </p>
        <span className="text-sm text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
          Current Streak: {userData?.streak || 0} days
        </span>
      </div>

      {/* Weekly Mood Chart */}
      <div className="mb-6">
        <div className="flex justify-between items-end h-32 mb-4">
          {moodData.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {day.day}
              </div>
              <div className="flex flex-col items-center justify-end flex-1 w-8">
                {day.filled ? (
                  <>
                    <div 
                      className="w-6 bg-primary-500 rounded-t-lg transition-all duration-300 hover:bg-primary-600 cursor-pointer"
                      style={{ height: `${(day.mood / 10) * 80}px` }}
                      title={`Mood: ${day.mood}/10 ${moodEmojis[day.mood]}`}
                    />
                    <div className="text-xs mt-1">{moodEmojis[day.mood]}</div>
                  </>
                ) : (
                  <>
                    <div className="w-6 bg-gray-200 dark:bg-gray-700 rounded-t-lg hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer h-8 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">?</span>
                    </div>
                    <div className="text-xs mt-1 text-gray-400">-</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Mood */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              How are you feeling today?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your daily mood to see patterns over time
            </p>
          </div>
          <Button 
            variant="primary" 
            className="whitespace-nowrap"
            onClick={handleLogMood}
            disabled={!selectedMood}
          >
            Log Mood
          </Button>
        </div>

        {/* Quick Mood Selector */}
        <div className="mt-4 flex justify-between">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors
                ${selectedMood === mood 
                  ? "bg-primary-200 dark:bg-primary-700 scale-110" 
                  : "hover:bg-white dark:hover:bg-gray-700"
                }
              `}
            >
              <span className="text-lg">{moodEmojis[mood]}</span>
              <span className="text-xs text-gray-500 mt-1">{mood}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Insights */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>Insight:</strong> {insight} 
        </p>
      </div>
    </Card>
  )
}