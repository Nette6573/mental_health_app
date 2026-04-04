'use client'

import { useEffect, useState } from 'react'

export default function InsightsCard() {
  const [insights, setInsights] = useState([])

  useEffect(() => {
    const fetchInsights = async () => {
      const uid = localStorage.getItem("uid")
      if (!uid) return

      const res = await fetch(`http://127.0.0.1:8000/api/user/${uid}/insights`)
      const data = await res.json()

      setInsights(data.insights || [])
    }

    fetchInsights()
  }, [])

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">AI Insights</h3>

      {insights.map((i, idx) => (
        <p key={idx} className="text-sm mb-2">
          💡 {i}
        </p>
      ))}
    </div>
  )
}