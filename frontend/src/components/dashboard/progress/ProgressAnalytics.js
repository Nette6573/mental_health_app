'use client'

import { useEffect, useState } from 'react'

export default function ProgressAnalytics() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const uid = localStorage.getItem("uid")
      if (!uid) return

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/mood/${uid}`)
        const data = await res.json()

        const moods = data.mood_log || []

        const avg =
          moods.length > 0
            ? moods.reduce((sum, m) => sum + m.mood, 0) / moods.length
            : 0

        setAnalytics({
          emotional: Math.round(avg * 10),
          consistency: moods.length * 5
        })

      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  if (!analytics) return <div>Loading analytics...</div>

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow">
        <h3>Emotional Score</h3>
        <p className="text-2xl font-bold">{analytics.emotional}%</p>
      </div>

      <div className="p-6 bg-white rounded-xl shadow">
        <h3>Consistency Score</h3>
        <p className="text-2xl font-bold">{analytics.consistency}%</p>
      </div>
    </div>
  )
}