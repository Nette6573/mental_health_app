'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import { Pie, Doughnut } from 'react-chartjs-2'
import { CHART_COLORS } from '@/constants/analytics'
import { UserIcon, ChartBarIcon } from '@heroicons/react/24/outline'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface DemographicsPieProps {
  data?: Array<{
    group?: string
    gender?: string
    category?: string
    count: number
    percentage?: number
  }>
  title?: string
  type?: 'pie' | 'doughnut'
  height?: number
  showLegend?: boolean
  showPercentages?: boolean
  onSegmentClick?: (index: number) => void
}

export default function DemographicsPie({
  data = [],
  title = 'Demographics',
  type = 'pie',
  height = 300,
  showLegend = true,
  showPercentages = true,
  onSegmentClick,
}: DemographicsPieProps) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })
  const [total, setTotal] = useState(0)
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null)

  const chartRef = useRef<ChartJS>(null)

  useEffect(() => {
    if (data.length === 0) {
      // Mock data
      const mockData = [
        { group: '18-24', count: 2345, percentage: 15.2 },
        { group: '25-34', count: 5678, percentage: 36.8 },
        { group: '35-44', count: 4321, percentage: 28.0 },
        { group: '45-54', count: 2345, percentage: 15.2 },
        { group: '55+', count: 743, percentage: 4.8 },
      ]
      processChartData(mockData)
    } else {
      processChartData(data)
    }
  }, [data])

  const processChartData = (rawData: any[]) => {
    const labels = rawData.map(item => 
      item.group || item.gender || item.category || 'Unknown'
    )
    
    const values = rawData.map(item => item.count)
    const total = values.reduce((a, b) => a + b, 0)
    setTotal(total)

    const percentages = rawData.map(item => 
      item.percentage || ((item.count / total) * 100).toFixed(1)
    )

    setChartData({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: CHART_COLORS.slice(0, values.length),
          borderColor: 'white',
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    } as any)
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
          },
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
        callbacks: {
          label: function(context: any) {
            const label = context.label || ''
            const value = context.raw || 0
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value.toLocaleString()} (${percentage}%)`
          },
        },
      },
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index
        setSelectedSegment(index)
        if (onSegmentClick) onSegmentClick(index)
      }
    },
  }

  const handleExport = () => {
    const csvContent = [
      ['Category', 'Count', 'Percentage'].join(','),
      ...chartData.labels.map((label: string, i: number) => {
        const value = chartData.datasets[0].data[i]
        const percentage = ((value / total) * 100).toFixed(1)
        return [label, value, `${percentage}%`].join(',')
      }),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`
    a.click()
  }

  const ChartComponent = type === 'pie' ? Pie : Doughnut

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <button
            onClick={handleExport}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Export
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div style={{ height: `${height}px` }} className="relative">
          <ChartComponent data={chartData} options={options} ref={chartRef} />
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {total.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500">Categories</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {chartData.labels?.length || 0}
            </p>
          </div>
        </div>

        {/* Data Table (for small screens) */}
        <div className="mt-4 md:hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 text-left">Category</th>
                <th className="py-2 text-right">Count</th>
                <th className="py-2 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels?.map((label: string, i: number) => {
                const value = chartData.datasets[0]?.data[i]
                const percentage = ((value / total) * 100).toFixed(1)
                return (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2">{label}</td>
                    <td className="py-2 text-right">{value.toLocaleString()}</td>
                    <td className="py-2 text-right">{percentage}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}