'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'

export default function MoodInsights({ refreshTrigger }) {
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Generate mock insights
      const mockInsights = {
        averageMood: 7.2,
        moodTrend: 'improving',
        bestDay: 'Friday',
        commonActivities: ['Exercise', 'Social', 'Hobby'],
        sleepCorrelation: 0.72,
        weeklyPattern: 'Your mood tends to be highest on weekends',
        recommendation: 'Try incorporating more outdoor activities - they seem to boost your mood!'
      }
      
      setInsights(mockInsights)
      setIsLoading(false)
    }

    fetchInsights()
  }, [refreshTrigger])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mood Insights
        </h2>
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {/* Average Mood */}
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm text-blue-800 dark:text-blue-300">Average Mood</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{insights.averageMood}/10</span>
        </div>

        {/* Trend */}
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <span className="text-sm text-green-800 dark:text-green-300">Trend</span>
          <div className="flex items-center">
            <span className="text-lg font-bold text-green-600 dark:text-green-400 mr-2">
              {insights.moodTrend === 'improving' ? '↗ Improving' : '↘ Declining'}
            </span>
          </div>
        </div>

        {/* Best Day */}
        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <span className="text-sm text-purple-800 dark:text-purple-300">Best Day</span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{insights.bestDay}</span>
        </div>

        {/* Sleep Correlation */}
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-orange-800 dark:text-orange-300">Sleep Correlation</span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {(insights.sleepCorrelation * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${insights.sleepCorrelation * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Weekly Pattern */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {insights.weeklyPattern}
          </p>
        </div>

        {/* Recommendation */}
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <h4 className="text-sm font-semibold text-primary-800 dark:text-primary-300 mb-1">
            💡 Recommendation
          </h4>
          <p className="text-sm text-primary-700 dark:text-primary-400">
            {insights.recommendation}
          </p>
        </div>
      </div>
    </Card>
  )
}