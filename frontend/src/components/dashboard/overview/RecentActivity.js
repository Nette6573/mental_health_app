import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useEffect, useState } from 'react'

export default function RecentActivity() {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const fetchActivity = async () => {
      const uid = localStorage.getItem("uid")
      if (!uid) return

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/mood/${uid}`)
        const data = await res.json()

        const moods = data.mood_log || []

        const formatted = moods.slice(-5).map((m, index) => ({
          id: index,
          type: 'mood',
          title: 'Mood Logged',
          description: `Mood ${m.mood}/10`,
          time: new Date(m.date).toLocaleString(),
          icon: '😊',
          color: 'green'
        }))

        setActivities(formatted.reverse())

      } catch (err) {
        console.error("Activity fetch failed:", err)
      }
    }

    fetchActivity()
  }, [])

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <div className="text-xl">{activity.icon}</div>

            <div>
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-gray-500">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">
          No activity yet
        </p>
      )}
    </Card>
  )
}