import Card from '@/components/ui/Card'

export default function StatsCards({ userData }) {

  const moods = userData?.mood_log || []

  // ---- SAFE AVERAGE ----
  const avg = (arr) =>
    arr.length > 0
      ? arr.reduce((sum, m) => sum + (m.mood || 0), 0) / arr.length
      : 0

  const recent = moods.slice(-7)
  const older = moods.slice(-14, -7)

  const recentAvg = avg(recent)
  const olderAvg = avg(older)

  const moodDiff = recentAvg - olderAvg

  // ---- STREAK ----
  const streak = userData?.streak || 0
  const streakChange = moods.length >= 2 ? 1 : 0

  // ---- RESOURCES ----
  const resources = userData?.resources_history || []

  const recentResources = resources.slice(-7).length
  const olderResources = resources.slice(-14, -7).length

  const resourceDiff = recentResources - olderResources

  let stats = [
    {
      name: 'Current Streak',
      value: `${streak} days`,
      change: streakChange > 0 ? `+${streakChange} day` : 'No change',
      changeType: streakChange > 0 ? 'positive' : 'neutral',
      icon: FireIcon,
      description: 'Consistent daily check-ins'
    },
    {
      name: 'Mood Average',
      value: moods.length > 0 ? `${recentAvg.toFixed(1)}/10` : '—',
      change:
        older.length === 0
          ? '—'
          : moodDiff > 0
          ? `+${moodDiff.toFixed(1)}`
          : moodDiff < 0
          ? `${moodDiff.toFixed(1)}`
          : '0',
      changeType:
        older.length === 0
          ? 'neutral'
          : moodDiff > 0
          ? 'positive'
          : moodDiff < 0
          ? 'negative'
          : 'neutral',
      icon: ChartBarIcon,
      description: 'Last 7 days'
    },
    {
      name: 'Resources Used',
      value: `${resources.length}`,
      change:
        olderResources === 0
          ? '—'
          : resourceDiff > 0
          ? `+${resourceDiff}`
          : resourceDiff < 0
          ? `${resourceDiff}`
          : '0',
      changeType:
        olderResources === 0
          ? 'neutral'
          : resourceDiff > 0
          ? 'positive'
          : resourceDiff < 0
          ? 'negative'
          : 'neutral',
      icon: BookOpenIcon,
      description: 'Last 7 days'
    }
  ]

  // ---- NEXT SESSION ----
  if (userData?.next_session) {
    const session = userData.next_session

    const date = new Date(session.date)

    stats.push({
      name: 'Next Session',
      value: date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }),
      change: date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      changeType: 'neutral',
      icon: CalendarIcon,
      description: `With ${session.provider}`
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>

              <div className={`text-sm mt-1 ${
                stat.changeType === 'positive'
                  ? 'text-green-600'
                  : stat.changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {stat.change}
              </div>
            </div>

            <div className="p-3 bg-primary-100 rounded-lg">
              <stat.icon className="w-6 h-6 text-primary-600" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {stat.description}
          </p>
        </Card>
      ))}
    </div>
  )
}

// Icons (same as yours)
function FireIcon(props) { return <svg {...props}><path /></svg> }
function ChartBarIcon(props) { return <svg {...props}><path /></svg> }
function BookOpenIcon(props) { return <svg {...props}><path /></svg> }
function CalendarIcon(props) { return <svg {...props}><path /></svg> }