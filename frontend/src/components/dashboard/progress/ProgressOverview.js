'use client'

import { useEffect, useState } from 'react'

export default function ProgressOverview() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const uid = localStorage.getItem("uid")
      if (!uid) return

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/mood/${uid}`)
        const moodData = await res.json()

        const moods = moodData.mood_log || []

        const avgMood =
          moods.length > 0
            ? moods.reduce((sum, m) => sum + m.mood, 0) / moods.length
            : 0

        setData({
          overallProgress: Math.round(avgMood * 10),
          weeklyConsistency: moods.length * 10,
          monthlyGrowth: avgMood > 5 ? 10 : -5
        })

      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-xl shadow">
        <h3>Overall Progress</h3>
        <p className="text-2xl font-bold">{data.overallProgress}%</p>
      </div>

      <div className="p-6 bg-white rounded-xl shadow">
        <h3>Weekly Consistency</h3>
        <p className="text-2xl font-bold">{data.weeklyConsistency}%</p>
      </div>

      <div className="p-6 bg-white rounded-xl shadow">
        <h3>Growth</h3>
        <p className="text-2xl font-bold">{data.monthlyGrowth}%</p>
      </div>
    </div>
  )
}