'use client'

import { useEffect, useState } from 'react'
import { getHistory } from '@/services/historyService'

export default function ProgressHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      const uid = localStorage.getItem("uid")
      if (!uid) return

      try {
        const res = await getHistory(uid)
        setHistory(res.history || [])
      } catch (err) {
        console.error("History error:", err)
      }
    }

    fetchHistory()
  }, [])

  // -------- ICONS --------
  const getIcon = (type) => {
    switch (type) {
      case "mood": return "😊"
      case "goal": return "🎯"
      case "chat": return "💬"
      default: return "📌"
    }
  }

  const getColor = (type) => {
    switch (type) {
      case "mood": return "bg-green-100"
      case "goal": return "bg-blue-100"
      case "chat": return "bg-purple-100"
      default: return "bg-gray-100"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">

      {/* HEADER */}
      <h2 className="text-xl font-semibold mb-6">
        Activity Timeline
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-500">
          No activity yet. Start by logging your mood or setting a goal.
        </p>
      ) : (
        <div className="space-y-4">

          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
            >

              {/* ICON */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${getColor(item.type)}`}>
                <span className="text-lg">{getIcon(item.type)}</span>
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <p className="font-medium">
                  {item.text}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  )
}