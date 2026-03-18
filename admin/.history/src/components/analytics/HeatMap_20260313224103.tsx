'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'
import { Chart } from 'react-chartjs-2'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

ChartJS.register(
  LinearScale,
  CategoryScale,
  MatrixController,
  MatrixElement,
  Tooltip,
  Legend
)

interface HeatMapProps {
  type?: 'sessions' | 'users' | 'resources'
  title?: string
  data?: number[][]
  showLegend?: boolean
  onCellClick?: (day: number, hour: number, value: number) => void
}

export default function HeatMap({
  type = 'sessions',
  title = 'Activity Heat Map',
  data,
  showLegend = true,
  onCellClick,
}: HeatMapProps) {
  const [heatmapData, setHeatmapData] = useState<any>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [stats, setStats] = useState({
    peakDay: '',
    peakHour: '',
    totalActivity: 0,
    averagePerHour: 0,
  })

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12
    const ampm = i < 12 ? 'AM' : 'PM'
    return `${hour} ${ampm}`
  })

  useEffect(() => {
    if (data) {
      processData(data)
    } else {
      // Generate mock data
      const mockData = generateMockData()
      processData(mockData)
    }
  }, [data, type])

  const generateMockData = () => {
    const matrix = []
    let total = 0
    let maxDay = 0
    let maxHour = 0
    let maxValue = 0

    for (let day = 0; day < 7; day++) {
      const row = []
      for (let hour = 0; hour < 24; hour++) {
        let value = 0
        
        // Generate realistic patterns
        if (hour >= 9 && hour <= 17 && day < 5) {
          value = Math.floor(Math.random() * 70) + 30 // Weekday business hours
        } else if ((hour >= 18 && hour <= 22) || (day >= 5 && hour >= 10 && hour <= 23)) {
          value = Math.floor(Math.random() * 50) + 20 // Evening and weekends
        } else if (hour >= 23 || hour <= 5) {
          value = Math.floor(Math.random() * 15) // Late night
        } else {
          value = Math.floor(Math.random() * 25) + 5 // Other times
        }

        row.push(value)
        total += value
        
        if (value > maxValue) {
          maxValue = value
          maxDay = day
          maxHour = hour
        }
      }
      matrix.push(row)
    }

    setStats({
      peakDay: days[maxDay],
      peakHour: hours[maxHour],
      totalActivity: total,
      averagePerHour: Math.round(total / (7 * 24)),
    })

    return matrix
  }

  const processData = (matrixData: number[][]) => {
    const points = []
    let max = 0

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const value = matrixData[day]?.[hour] || 0
        points.push({
          x: hour,
          y: day,
          v: value,
        })
        if (value > max) max = value
      }
    }

    setHeatmapData({
      datasets: [{
        label: 'Activity',
        data: points,
        backgroundColor(context: any) {
          const value = context.dataset.data[context.dataIndex].v
          const alpha = value / max
          return `rgba(59, 130, 246, ${alpha})`
        },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        width: ({ chart }: any) => {
          const { ctx, scales } = chart
          const xAxis = scales.x
          const yAxis = scales.y
          const xSize = Math.abs(xAxis.getPixelForValue(1) - xAxis.getPixelForValue(0))
          const ySize = Math.abs(yAxis.getPixelForValue(1) - yAxis.getPixelForValue(0))
          return Math.min(xSize, ySize) * 0.9
        },
        height: ({ chart }: any) => {
          const { ctx, scales } = chart
          const xAxis = scales.x
          const yAxis = scales.y
          const xSize = Math.abs(xAxis.getPixelForValue(1) - xAxis.getPixelForValue(0))
          const ySize = Math.abs(yAxis.getPixelForValue(1) - yAxis.getPixelForValue(0))
          return Math.min(xSize, ySize) * 0.9
        },
      }],
    })
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title() {
            return ''
          },
          label(context: any) {
            const data = context.dataset.data[context.dataIndex]
            const day = days[data.y]
            const hour = hours[data.x]
            return [
              `${day}, ${hour}`,
              `Activity: ${data.v}`,
              `Peak: ${Math.round((data.v / stats.totalActivity) * 100)}% of total`,
            ]
          },
        },
      },
    },
    scales: {
      y: {
        type: 'category' as const,
        labels: days,
        position: 'left' as const,
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 12 },
        },
      },
      x: {
        type: 'category' as const,
        labels: hours,
        position: 'top' as const,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          font: { size: 10 },
          callback: function(val: any, index: number) {
            // Show every 3rd hour to avoid overcrowding
            return index % 3 === 0 ? this.getLabelForValue(val) : ''
          },
        },
      },
    },
    onClick(event: any, elements: any[]) {
      if (elements.length > 0) {
        const element = elements[0]
        const data = heatmapData.datasets[0].data[element.dataIndex]
        setSelectedDay(data.y)
        setSelectedHour(data.x)
        if (onCellClick) {
          onCellClick(data.y, data.x, data.v)
        }
      }
    },
  }

  const getHeatSummary = () => {
    if (selectedDay !== null && selectedHour !== null && heatmapData) {
      const value = heatmapData.datasets[0].data.find(
        (d: any) => d.y === selectedDay && d.x === selectedHour
      )?.v
      return {
        day: days[selectedDay],
        hour: hours[selectedHour],
        value,
        percentage: Math.round((value / stats.totalActivity) * 100),
      }
    }
    return null
  }

  const selected = getHeatSummary()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visualize activity patterns by day and hour
        </p>
      </div>

      {/* Heat Map */}
      <div className="p-6">
        <div style={{ height: '400px' }}>
          {heatmapData && (
            <Chart type="matrix" data={heatmapData} options={options} />
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-300 rounded"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-900 rounded"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Peak</span>
            </div>
          </div>
        )}

        {/* Selected Cell Info */}
        {selected && (
          <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <p className="text-sm font-medium text-primary-800 dark:text-primary-400">
              Selected: {selected.day}, {selected.hour}
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-300 mt-1">
              {selected.value} activities
            </p>
            <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
              {selected.percentage}% of total activity
            </p>
          </div>
        )}

        {/* Statistics Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs">Peak Day</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.peakDay}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs">Peak Hour</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.peakHour}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Activity</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.totalActivity.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg per Hour</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.averagePerHour}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}