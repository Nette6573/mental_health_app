import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const moodData = [
  { day: 'Mon', mood: 7, filled: true },
  { day: 'Tue', mood: 8, filled: true },
  { day: 'Wed', mood: 6, filled: true },
  { day: 'Thu', mood: 9, filled: true },
  { day: 'Fri', mood: 7, filled: true },
  { day: 'Sat', mood: 8, filled: true },
  { day: 'Sun', mood: null, filled: false }
]

const moodEmojis = {
  1: '😢', 2: '😔', 3: '😐', 4: '🙂', 5: '😊', 
  6: '😄', 7: '🤩', 8: '🥰', 9: '😇', 10: '🌈'
}

export default function MoodTracker() {
  const todayMood = moodData[6] // Sunday

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mood Tracker
        </h3>
        <span className="text-sm text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
          Current Streak: 6 days
        </span>
      </div>

      {/* Weekly Mood Chart */}
      <div className="mb-6">
        <div className="flex justify-between items-end h-32 mb-4">
          {moodData.map((day, index) => (
            <div key={day.day} className="flex flex-col items-center">
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
          <Button variant="primary" className="whitespace-nowrap">
            Log Mood
          </Button>
        </div>

        {/* Quick Mood Selector */}
        <div className="mt-4 flex justify-between">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
            <button
              key={mood}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
              title={`Rate ${mood}/10`}
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
          💡 <strong>Insight:</strong> Your mood has been consistently positive this week. 
          Great job maintaining your wellness practices!
        </p>
      </div>
    </Card>
  )
}