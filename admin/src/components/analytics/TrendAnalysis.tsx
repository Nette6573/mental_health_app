'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { ArrowUpIcon, ArrowDownIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { format, addDays, addWeeks, addMonths, subDays } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface TrendAnalysisProps {
  metric?: 'users' | 'sessions' | 'revenue' | 'resources'
  data?: Array<{ timestamp: string; value: number }>
  predictions?: Array<{ timestamp: string; value: number }>
  showConfidence?: boolean
  onPeriodChange?: (period: string) => void
}

export default function TrendAnalysis({
  metric = 'users',
  data,
  predictions,
  showConfidence = true,
  onPeriodChange,
}: TrendAnalysisProps) {
  const [period, setPeriod] = useState('30d')
  const [chartData, setChartData] = useState<any>(null)
  const [trends, setTrends] = useState({
    daily: { value: 2.3, direction: 'up' },
    weekly: { value: 8.7, direction: 'up' },
    monthly: { value: 15.2, direction: 'up' },
    quarterly: { value: 28.5, direction: 'up' },
    yearly: { value: 145.3, direction: 'up' },
  })
  const [forecast, setForecast] = useState({
    nextWeek: 5.2,
    nextMonth: 12.8,
    nextQuarter: 32.4,
    confidence: 85,
  })
  const [insights, setInsights] = useState<string[]>([])

  const periods = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ]

  const metricLabels = {
    users: { name: 'Users', color: '#3b82f6' },
    sessions: { name: 'Sessions', color: '#10b981' },
    revenue: { name: 'Revenue', color: '#f59e0b' },
    resources: { name: 'Resources', color: '#8b5cf6' },
  }

  useEffect(() => {
    if (data) {
      processData(data, predictions)
    } else {
      // Generate mock data
      const mockData = generateMockData()
      const mockPredictions = generateMockPredictions(mockData)
      processData(mockData, mockPredictions)
    }
  }, [data, predictions, period, metric])

  const generateMockData = () => {
    const points = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 52
    const baseValue = metric === 'revenue' ? 100000 : metric === 'users' ? 15000 : metric === 'sessions' ? 3000 : 5000
    
    return Array.from({ length: points }, (_, i) => {
      const date = period === '1y' 
        ? subDays(new Date(), (points - 1 - i) * 7)
        : subDays(new Date(), points - 1 - i)
      const trend = i * (baseValue * 0.01) // 1% growth trend
      const noise = Math.random() * baseValue * 0.1 - baseValue * 0.05
      return {
        timestamp: date.toISOString(),
        value: Math.round(baseValue + trend + noise),
      }
    })
  }

  const generateMockPredictions = (historicalData: any[]) => {
    const lastValue = historicalData[historicalData.length - 1].value
    const points = period === '7d' ? 3 : period === '30d' ? 7 : period === '90d' ? 12 : 8
    
    return Array.from({ length: points }, (_, i) => {
      const date = period === '1y'
        ? addWeeks(new Date(), i + 1)
        : addDays(new Date(), (i + 1) * (period === '7d' ? 1 : period === '30d' ? 1 : period === '90d' ? 7 : 30))
      const growth = lastValue * 0.02 * (i + 1) // 2% growth per period
      const uncertainty = growth * 0.2 // 20% uncertainty
      return {
        timestamp: date.toISOString(),
        value: Math.round(lastValue + growth),
        upper: Math.round(lastValue + growth + uncertainty),
        lower: Math.round(lastValue + growth - uncertainty),
      }
    })
  }

  const processData = (historical: any[], predicted: any[] = []) => {
    const labels = historical.map(d => {
      const date = new Date(d.timestamp)
      if (period === '7d') return format(date, 'EEE')
      if (period === '30d') return format(date, 'MMM d')
      if (period === '90d') return format(date, 'MMM d')
      return format(date, 'MMM yyyy')
    })

    if (predicted.length > 0) {
      labels.push(...predicted.map(d => {
        const date = new Date(d.timestamp)
        if (period === '7d') return format(date, 'EEE')
        if (period === '30d') return format(date, 'MMM d')
        if (period === '90d') return format(date, 'MMM d')
        return format(date, 'MMM yyyy')
      }))
    }

    const datasets = [
      {
        label: 'Historical',
        data: historical.map(d => d.value),
        borderColor: metricLabels[metric].color,
        backgroundColor: 'transparent',
        pointRadius: 2,
        pointHoverRadius: 6,
        tension: 0.4,
      },
    ]

    if (predicted.length > 0) {
      datasets.push({
        label: 'Predicted',
        data: [...Array(historical.length).fill(null), ...predicted.map(d => d.value)],
        borderColor: '#94a3b8',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.4,
      })

      if (showConfidence) {
        // Add confidence interval as filled area
        const upper = [...Array(historical.length).fill(null), ...predicted.map(d => d.upper)]
        const lower = [...Array(historical.length).fill(null), ...predicted.map(d => d.lower)]
        
        datasets.push({
          label: 'Confidence Interval',
          data: upper,
          borderColor: 'transparent',
          backgroundColor: 'rgba(148, 163, 184, 0.1)',
          fill: '+1',
          pointRadius: 0,
        })
        
        datasets.push({
          label: 'Confidence Interval',
          data: lower,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          fill: false,
          pointRadius: 0,
        })
      }
    }

    setChartData({ labels, datasets })

    // Generate insights based on trends
    generateInsights(historical, predicted)
  }

  const generateInsights = (historical: any[], predicted: any[]) => {
    const firstValue = historical[0].value
    const lastValue = historical[historical.length - 1].value
    const totalGrowth = ((lastValue - firstValue) / firstValue) * 100
    
    const insights = []
    
    if (totalGrowth > 20) {
      insights.push(`Strong growth of ${totalGrowth.toFixed(1)}% over the period`)
    } else if (totalGrowth > 10) {
      insights.push(`Moderate growth of ${totalGrowth.toFixed(1)}% over the period`)
    } else if (totalGrowth > 0) {
      insights.push(`Slight growth of ${totalGrowth.toFixed(1)}% over the period`)
    } else {
      insights.push(`Decline of ${Math.abs(totalGrowth).toFixed(1)}% over the period`)
    }

    // Calculate volatility
    const changes = historical.slice(1).map((d, i) => 
      Math.abs((d.value - historical[i].value) / historical[i].value)
    )
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length
    
    if (avgChange > 0.1) {
      insights.push('High volatility detected - values fluctuate significantly')
    } else if (avgChange > 0.05) {
      insights.push('Moderate volatility - some fluctuation in values')
    } else {
      insights.push('Stable trend with minimal fluctuation')
    }

    // Seasonality check
    if (period === '1y') {
      const monthlyAvg = historical.reduce((acc, d, i) => {
        const month = new Date(d.timestamp).getMonth()
        acc[month] = (acc[month] || 0) + d.value
        return acc
      }, {})
      
      const months = Object.values(monthlyAvg) as number[]
      const maxMonth = Math.max(...months)
      const minMonth = Math.min(...months)
      
      if (maxMonth / minMonth > 1.5) {
        insights.push('Strong seasonal patterns detected')
      }
    }

    if (predicted.length > 0) {
      const lastPredicted = predicted[predicted.length - 1].value
      const predictedGrowth = ((lastPredicted - lastValue) / lastValue) * 100
      insights.push(`Projected growth of ${predictedGrowth.toFixed(1)}% over next period`)
    }

    setInsights(insights)
  }

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    if (onPeriodChange) onPeriodChange(newPeriod)
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${metricLabels[metric].name} Trend Analysis`,
        align: 'start' as const,
        font: { size: 16 },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: function(value: any) {
            if (metric === 'revenue') {
              return '$' + value.toLocaleString()
            }
            return value.toLocaleString()
          },
        },
      },
      x: {
        grid: { display: false },
      },
    },
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold">Trend Analysis</h3>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            {periods.map(p => (
              <button
                key={p.value}
                onClick={() => handlePeriodChange(p.value)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  period === p.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div style={{ height: '300px' }}>
          {chartData && <Line data={chartData} options={options} />}
        </div>
      </div>

      {/* Trend Metrics */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(trends).map(([period, data]) => (
          <div key={period} className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-1">
              {period}
            </p>
            <div className="flex items-center justify-center gap-1">
              {data.direction === 'up' ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.value}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Forecast
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Next Week</p>
            <p className="text-xl font-semibold text-primary-500">
              +{forecast.nextWeek}%
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Next Month</p>
            <p className="text-xl font-semibold text-primary-500">
              +{forecast.nextMonth}%
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Next Quarter</p>
            <p className="text-xl font-semibold text-primary-500">
              +{forecast.nextQuarter}%
            </p>
            {showConfidence && (
              <p className="text-xs text-gray-400 mt-1">
                {forecast.confidence}% confidence
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <LightBulbIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              AI-Powered Insights
            </h4>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-primary-500">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}