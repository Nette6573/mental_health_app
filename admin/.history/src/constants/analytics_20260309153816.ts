import { DateRange, MetricCard, TimeSeriesData } from '@/types/analytics'

export const DATE_RANGES: DateRange[] = [
  {
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
    label: 'Last 7 days',
  },
  {
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
    label: 'Last 30 days',
  },
  {
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    end: new Date(),
    label: 'Last 3 months',
  },
  {
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date(),
    label: 'Last 6 months',
  },
  {
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    end: new Date(),
    label: 'Last 12 months',
  },
]

export const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#6b7280',
]

export const MOCK_METRICS: MetricCard[] = [
  {
    id: 'totalUsers',
    title: 'Total Users',
    value: 15432,
    change: 12.5,
    trend: 'up',
    icon: 'users',
    color: 'blue',
    format: 'number',
  },
  {
    id: 'activeUsers',
    title: 'Active Users',
    value: 8765,
    change: 8.2,
    trend: 'up',
    icon: 'activity',
    color: 'green',
    format: 'number',
  },
  {
    id: 'totalSessions',
    title: 'Total Sessions',
    value: 3421,
    change: -2.4,
    trend: 'down',
    icon: 'calendar',
    color: 'orange',
    format: 'number',
  },
  {
    id: 'revenue',
    title: 'Revenue',
    value: 128450,
    change: 15.8,
    trend: 'up',
    icon: 'dollar',
    color: 'purple',
    format: 'currency',
  },
]

export const MOCK_USER_GROWTH: TimeSeriesData[] = Array.from({ length: 30 }, (_, i) => ({
  timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
  value: Math.floor(Math.random() * 100) + 15000,
}))

export const MOCK_REVENUE_DATA: TimeSeriesData[] = Array.from({ length: 12 }, (_, i) => ({
  timestamp: new Date(2025, i, 1).toISOString(),
  value: Math.floor(Math.random() * 50000) + 100000,
}))