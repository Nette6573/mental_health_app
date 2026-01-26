'use client'

import { useState, useEffect } from 'react'

export default function ProgressOverview({ user, data }) {
  const [weeklyData, setWeeklyData] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])

  useEffect(() => {
    // Generate mock weekly data
    const mockWeeklyData = [
      { day: 'Mon', devotional: 15, prayer: 20, scripture: 10, community: 5 },
      { day: 'Tue', devotional: 20, prayer: 15, scripture: 15, community: 10 },
      { day: 'Wed', devotional: 10, prayer: 25, scripture: 5, community: 15 },
      { day: 'Thu', devotional: 25, prayer: 10, scripture: 20, community: 8 },
      { day: 'Fri', devotional: 15, prayer: 20, scripture: 15, community: 12 },
      { day: 'Sat', devotional: 30, prayer: 15, scripture: 25, community: 20 },
      { day: 'Sun', devotional: 20, prayer: 30, scripture: 20, community: 25 }
    ]

    // Generate mock monthly trend
    const mockMonthlyTrend = [
      { month: 'Jan', progress: 45 },
      { month: 'Feb', progress: 52 },
      { month: 'Mar', progress: 48 },
      { month: 'Apr', progress: 60 },
      { month: 'May', progress: 65 },
      { month: 'Jun', progress: 68 }
    ]

    setWeeklyData(mockWeeklyData)
    setMonthlyTrend(mockMonthlyTrend)
  }, [])

  const ProgressCard = ({ title, value, subtitle, icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center mt-3 text-sm ${
          trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          <svg className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          {Math.abs(trend)}% from last week
        </div>
      )}
    </div>
  )

  const ActivityTypeCard = ({ type, count, duration, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{type}</h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{count} sessions</span>
            <span>•</span>
            <span>{duration} total</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard
          title="Overall Progress"
          value={data?.overallProgress || 0}
          subtitle="Journey completion"
          icon="📊"
          color="bg-blue-500"
          trend={5}
        />
        <ProgressCard
          title="Spiritual Health"
          value={data?.spiritualHealth || 0}
          subtitle="Based on consistency"
          icon="💫"
          color="bg-purple-500"
          trend={3}
        />
        <ProgressCard
          title="Weekly Consistency"
          value={data?.weeklyConsistency || 0}
          subtitle="Activity rate"
          icon="🔥"
          color="bg-orange-500"
          trend={8}
        />
        <ProgressCard
          title="Monthly Growth"
          value={data?.monthlyGrowth || 0}
          subtitle="Progress increase"
          icon="📈"
          color="bg-green-500"
          trend={12}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Weekly Activity</h2>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>

            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex space-x-1 h-8">
                      <div 
                        className="bg-blue-500 rounded-l-lg transition-all duration-500 hover:bg-blue-600"
                        style={{ width: `${day.devotional}%` }}
                        title={`Devotional: ${day.devotional}min`}
                      ></div>
                      <div 
                        className="bg-green-500 transition-all duration-500 hover:bg-green-600"
                        style={{ width: `${day.prayer}%` }}
                        title={`Prayer: ${day.prayer}min`}
                      ></div>
                      <div 
                        className="bg-purple-500 transition-all duration-500 hover:bg-purple-600"
                        style={{ width: `${day.scripture}%` }}
                        title={`Scripture: ${day.scripture}min`}
                      ></div>
                      <div 
                        className="bg-orange-500 rounded-r-lg transition-all duration-500 hover:bg-orange-600"
                        style={{ width: `${day.community}%` }}
                        title={`Community: ${day.community}min`}
                      ></div>
                    </div>
                  </div>
                  <span className="w-16 text-right text-sm text-gray-600 dark:text-gray-400">
                    {day.devotional + day.prayer + day.scripture + day.community}m
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {[
                { color: 'bg-blue-500', label: 'Devotional' },
                { color: 'bg-green-500', label: 'Prayer' },
                { color: 'bg-purple-500', label: 'Scripture' },
                { color: 'bg-orange-500', label: 'Community' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Types */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Summary</h2>
          <div className="space-y-4">
            <ActivityTypeCard
              type="devotional"
              count={23}
              duration="5h 45m"
              icon="📖"
              color="bg-blue-500"
            />
            <ActivityTypeCard
              type="prayer"
              count={45}
              duration="7h 20m"
              icon="🙏"
              color="bg-green-500"
            />
            <ActivityTypeCard
              type="scripture"
              count={18}
              duration="6h 15m"
              icon="📚"
              color="bg-purple-500"
            />
            <ActivityTypeCard
              type="community"
              count={32}
              duration="4h 10m"
              icon="👥"
              color="bg-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {data?.recentActivities?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                  activity.type === 'devotional' ? 'bg-blue-500' :
                  activity.type === 'prayer' ? 'bg-green-500' :
                  activity.type === 'scripture' ? 'bg-purple-500' : 'bg-orange-500'
                }`}>
                  {activity.type === 'devotional' ? '📖' :
                   activity.type === 'prayer' ? '🙏' :
                   activity.type === 'scripture' ? '📚' : '👥'}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{activity.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString()} • {activity.duration}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.type === 'devotional' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                activity.type === 'prayer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                activity.type === 'scripture' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
              }`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-8 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-4xl mb-4 block">💫</span>
          <h3 className="text-2xl font-bold mb-4">Your spiritual journey is making a difference!</h3>
          <p className="text-primary-100 text-lg">
            &quot;The steadfast love of the LORD never ceases; his mercies never come to an end; 
            they are new every morning; great is your faithfulness.&quot;
          </p>
          <p className="text-primary-200 mt-4">- Lamentations 3:22-23</p>
        </div>
      </div>
    </div>
  )
}