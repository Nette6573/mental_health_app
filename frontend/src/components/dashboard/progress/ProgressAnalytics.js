'use client'

import { useState, useEffect } from 'react'

export default function ProgressAnalytics({ user, data }) {
  const [timeRange, setTimeRange] = useState('month')
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    const generateAnalyticsData = () => {
      const mockData = {
        monthlyProgress: [
          { month: 'Jan', value: 45, goal: 60 },
          { month: 'Feb', value: 52, goal: 65 },
          { month: 'Mar', value: 48, goal: 70 },
          { month: 'Apr', value: 60, goal: 75 },
          { month: 'May', value: 65, goal: 80 },
          { month: 'Jun', value: 68, goal: 85 }
        ],
        activityDistribution: [
          { type: 'Devotional', value: 35, color: '#3B82F6' },
          { type: 'Prayer', value: 28, color: '#10B981' },
          { type: 'Scripture', value: 22, color: '#8B5CF6' },
          { type: 'Community', value: 15, color: '#F59E0B' }
        ],
        consistencyScore: 85,
        peakHours: [
          { hour: '6-8 AM', activity: 75 },
          { hour: '12-2 PM', activity: 45 },
          { hour: '6-8 PM', activity: 65 },
          { hour: '9-11 PM', activity: 35 }
        ],
        growthMetrics: {
          spiritual: { current: 72, previous: 65, trend: 'up' },
          emotional: { current: 65, previous: 58, trend: 'up' },
          community: { current: 58, previous: 52, trend: 'up' },
          consistency: { current: 85, previous: 78, trend: 'up' }
        }
      }
      setAnalyticsData(mockData)
    }

    generateAnalyticsData()
  }, [timeRange])

  const StatCard = ({ title, value, change, subtitle, icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}%</p>
          <div className={`flex items-center mt-1 text-sm ${
            change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            <svg className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {Math.abs(change)}% {change > 0 ? 'increase' : 'decrease'}
          </div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
      )}
    </div>
  )

  const ProgressBar = ({ label, value, max, color }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-24">{label}</span>
      <div className="flex-1 mx-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${color}`}
            style={{ width: `${(value / max) * 100}%` }}
          ></div>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
        {value}%
      </span>
    </div>
  )

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detailed Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Deep insights into your spiritual journey and growth patterns
          </p>
        </div>
        <div className="flex space-x-2 mt-4 lg:mt-0">
          {['week', 'month', 'quarter', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Spiritual Growth"
          value={analyticsData.growthMetrics.spiritual.current}
          change={analyticsData.growthMetrics.spiritual.current - analyticsData.growthMetrics.spiritual.previous}
          icon="💫"
        />
        <StatCard
          title="Emotional Wellness"
          value={analyticsData.growthMetrics.emotional.current}
          change={analyticsData.growthMetrics.emotional.current - analyticsData.growthMetrics.emotional.previous}
          icon="😊"
        />
        <StatCard
          title="Community Engagement"
          value={analyticsData.growthMetrics.community.current}
          change={analyticsData.growthMetrics.community.current - analyticsData.growthMetrics.community.previous}
          icon="👥"
        />
        <StatCard
          title="Consistency Score"
          value={analyticsData.growthMetrics.consistency.current}
          change={analyticsData.growthMetrics.consistency.current - analyticsData.growthMetrics.consistency.previous}
          icon="📅"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity Distribution</h3>
          <div className="space-y-4">
            {analyticsData.activityDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${item.value}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Activity Hours */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Peak Activity Hours</h3>
          <div className="space-y-4">
            {analyticsData.peakHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20">
                  {hour.hour}
                </span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${hour.activity}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                  {hour.activity}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Progress Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Progress Trend</h3>
        <div className="space-y-6">
          {analyticsData.monthlyProgress.map((month, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {month.month}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {month.value}% of {month.goal}% goal
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-blue-600 h-4 rounded-full transition-all duration-1000 relative"
                  style={{ width: `${(month.value / month.goal) * 100}%` }}
                >
                  <div 
                    className="absolute right-0 top-0 w-2 h-4 bg-blue-400 rounded-r-full"
                    style={{ marginRight: '-2px' }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">🌟 Positive Insights</h3>
          <ul className="space-y-3 text-green-700 dark:text-green-400">
            <li className="flex items-start space-x-2">
              <span>✅</span>
              <span>Your consistency has improved by 12% this month</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>✅</span>
              <span>Morning devotionals are your most productive time</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>✅</span>
              <span>Community engagement is growing steadily</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">💡 Recommendations</h3>
          <ul className="space-y-3 text-blue-700 dark:text-blue-400">
            <li className="flex items-start space-x-2">
              <span>🎯</span>
              <span>Try extending your prayer time by 5 minutes daily</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🎯</span>
              <span>Consider joining a weekly Bible study group</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🎯</span>
              <span>Set specific goals for scripture memorization</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}