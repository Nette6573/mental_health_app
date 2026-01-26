'use client'

import { useState, useEffect } from 'react'

export default function ProgressHistory({ user, data }) {
  const [timeFilter, setTimeFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [historyData, setHistoryData] = useState([])

  useEffect(() => {
    // Generate mock history data
    const mockHistory = [
      {
        id: 1,
        type: 'devotional',
        title: 'Morning Reflection',
        description: 'Started the day with prayer and scripture reading',
        duration: 15,
        date: '2024-01-15T08:30:00',
        mood: 'peaceful',
        notes: 'Felt particularly connected during prayer today'
      },
      {
        id: 2,
        type: 'prayer',
        title: 'Evening Prayer',
        description: 'Prayed for family and friends',
        duration: 10,
        date: '2024-01-15T20:15:00',
        mood: 'grateful',
        notes: 'Thankful for the blessings of the day'
      },
      {
        id: 3,
        type: 'scripture',
        title: 'Psalm 23 Study',
        description: 'Deep dive into Psalm 23 with reflection questions',
        duration: 25,
        date: '2024-01-14T19:00:00',
        mood: 'reflective',
        notes: 'The Lord is my shepherd verse stood out today'
      },
      {
        id: 4,
        type: 'community',
        title: 'Prayed for Sarah',
        description: 'Responded to prayer request in community',
        duration: 5,
        date: '2024-01-14T14:20:00',
        mood: 'compassionate',
        notes: 'Shared words of encouragement'
      },
      {
        id: 5,
        type: 'devotional',
        title: 'Daily Devotional',
        description: 'Read today\'s featured devotional',
        duration: 12,
        date: '2024-01-13T07:45:00',
        mood: 'hopeful',
        notes: 'The message about hope resonated deeply'
      }
    ]

    setHistoryData(mockHistory)
  }, [timeFilter, typeFilter])

  const getActivityIcon = (type) => {
    const icons = {
      devotional: '📖',
      prayer: '🙏',
      scripture: '📚',
      community: '👥'
    }
    return icons[type] || '✨'
  }

  const getMoodColor = (mood) => {
    const colors = {
      peaceful: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      grateful: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      reflective: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      compassionate: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      hopeful: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    }
    return colors[mood] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Group history by date
  const groupedHistory = historyData.reduce((groups, activity) => {
    const date = activity.date.split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {})

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review your past spiritual activities and reflections
          </p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="devotional">Devotional</option>
            <option value="prayer">Prayer</option>
            <option value="scripture">Scripture</option>
            <option value="community">Community</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{historyData.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(historyData.reduce((sum, activity) => sum + activity.duration, 0) / 60)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Hours</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Set(historyData.map(a => a.date.split('T')[0])).size}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Days</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(historyData.reduce((sum, activity) => sum + activity.duration, 0) / historyData.length)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Minutes</div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedHistory).map(([date, activities]) => (
          <div key={date} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {formatDate(date)}
            </h3>
            
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {activity.description}
                        </p>
                        {activity.notes && (
                          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                              &quot;{activity.notes}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                        <div>{formatTime(activity.date)}</div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {activity.duration} min
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getMoodColor(activity.mood)}`}>
                        {activity.mood}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {historyData.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No activity history yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your spiritual activities will appear here once you start using MindCare.
          </p>
        </div>
      )}

      {/* Export Options */}
      {historyData.length > 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-2">
                Export Your Progress
              </h3>
              <p className="text-primary-700 dark:text-primary-400">
                Download your activity history for personal records or sharing with your spiritual mentor.
              </p>
            </div>
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button className="px-4 py-2 border border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                Export as PDF
              </button>
              <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}