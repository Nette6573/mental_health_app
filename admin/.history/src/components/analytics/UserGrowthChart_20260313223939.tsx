'use client'

import { useEffect, useRef, useState } from 'react'
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
  TimeScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format, parseISO, subDays, subMonths, subWeeks } from 'date-fns'
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
)

interface UserGrowthChartProps {
  data?: Array<{
    timestamp: string
    value: number
    newUsers?: number
    activeUsers?: number
  }>
  title?: string
  height?: number
  showControls?: boolean
  onTimeRangeChange?: (range: string) => void
}

export default function UserGrowthChart({ 
  data = [], 
  title = 'User Growth',
  height = 400,
  showControls = true,
  onTimeRangeChange 
}: UserGrowthChartProps) {
  const [timeRange, setTimeRange] = useState('30d')
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    peak: 0,
    growth: 0,
  })

  const chartRef = useRef<ChartJS>(null)
  const [selectedMetric, setSelectedMetric] = useState('total')

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ]

  const metrics = [
    { value: 'total', label: 'Total Users', color: '#3b82f6' },
    { value: 'new', label: 'New Users', color: '#10b981' },
    { value: 'active', label: 'Active Users', color: '#f59e0b' },
  ]

  useEffect(() => {
    if (data.length === 0) {
      // Generate mock data based on time range
      const mockData = generateMockData(timeRange)
      processChartData(mockData)
    } else {
      processChartData(data)
    }
  }, [data, timeRange, selectedMetric])

  const generateMockData = (range: string) => {
    const now = new Date()
    let points = 30
    let interval = 'day'

    switch(range) {
      case '24h':
        points = 24
        interval = 'hour'
        break
      case '7d':
        points = 7
        break
      case '30d':
        points = 30
        break
      case '90d':
        points = 90
        break
      case '1y':
        points = 12
        interval = 'month'
        break
      default:
        points = 30
    }

    return Array.from({ length: points }, (_, i) => {
      let timestamp
      if (interval === 'hour') {
        timestamp = subDays(now, 0)
        timestamp.setHours(now.getHours() - (points - 1 - i))
      } else if (interval === 'month') {
        timestamp = subMonths(now, points - 1 - i)
      } else {
        timestamp = subDays(now, points - 1 - i)
      }

      const baseValue = 15000 + Math.floor(Math.random() * 1000)
      return {
        timestamp: timestamp.toISOString(),
        value: baseValue + Math.floor(i * 50),
        newUsers: Math.floor(Math.random() * 100) + 50,
        activeUsers: Math.floor(baseValue * 0.6) + Math.floor(Math.random() * 500),
      }
    })
  }

  const processChartData = (rawData: any[]) => {
    const labels = rawData.map(d => {
      const date = parseISO(d.timestamp)
      if (timeRange === '24h') return format(date, 'HH:00')
      if (timeRange === '7d' || timeRange === '30d') return format(date, 'MMM d')
      if (timeRange === '90d') return format(date, 'MMM d')
      if (timeRange === '1y') return format(date, 'MMM yyyy')
      return format(date, 'MMM d, yyyy')
    })

    let datasets = []

    if (selectedMetric === 'total') {
      datasets = [{
        label: 'Total Users',
        data: rawData.map(d => d.value),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      }]
    } else if (selectedMetric === 'new') {
      datasets = [{
        label: 'New Users',
        data: rawData.map(d => d.newUsers || Math.floor(d.value * 0.1)),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      }]
    } else if (selectedMetric === 'active') {
      datasets = [{
        label: 'Active Users',
        data: rawData.map(d => d.activeUsers || Math.floor(d.value * 0.6)),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
      }]
    }

    setChartData({ labels, datasets } as any)

    // Calculate stats
    const values = datasets[0].data
    const total = values.reduce((a: number, b: number) => a + b, 0)
    const average = total / values.length
    const peak = Math.max(...values)
    const growth = ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1)

    setStats({
      total,
      average,
      peak,
      growth: parseFloat(growth),
    })
  }

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    if (onTimeRangeChange) onTimeRangeChange(range)
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      title: {
        display: true,
        text: title,
        align: 'start' as const,
        font: {
          size: 16,
          weight: 'normal',
        },
        padding: { bottom: 20 },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value)
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          maxTicksLimit: 10,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header with Controls */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">User Growth</h3>
            {showControls && (
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {showControls && (
            <div className="flex items-center gap-3">
              {/* Metric Selector */}
              <div className="relative">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {metrics.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Time Range Selector */}
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {timeRanges.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div style={{ height: `${height}px` }}>
          <Line data={chartData} options={options} ref={chartRef} />
        </div>
      </div>

      {/* Stats Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('en-US').format(stats.total)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Daily Average</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('en-US').format(Math.round(stats.average))}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Peak</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('en-US').format(stats.peak)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Growth Rate</p>
          <p className={`text-lg font-semibold ${
            stats.growth >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {stats.growth >= 0 ? '+' : ''}{stats.growth}%
          </p>
        </div>
      </div>
    </div>
  )
}