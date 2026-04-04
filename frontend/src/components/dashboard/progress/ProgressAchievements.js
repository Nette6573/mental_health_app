'use client'

import { useEffect, useState } from 'react'

export default function ProgressAchievements() {
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const uid = localStorage.getItem("uid")
      if (!uid) return

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/mood/${uid}`)
        const data = await res.json()

        const moods = data.mood_log || []

        const achievements = [
          {
            title: "First Mood Logged",
            unlocked: moods.length >= 1
          },
          {
            title: "5 Mood Entries",
            unlocked: moods.length >= 5
          },
          {
            title: "Consistency Starter",
            unlocked: moods.length >= 7
          }
        ]

        setAchievements(achievements)

      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-4">
      {achievements.map((a, i) => (
        <div key={i} className="p-4 border rounded">
          <p>{a.title}</p>
          <p>{a.unlocked ? "✅ Unlocked" : "🔒 Locked"}</p>
        </div>
      ))}
    </div>
  )
}