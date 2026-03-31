'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import UserGrowthChart from '@/components/analytics/UserGrowthChart'
import DemographicsPie from '@/components/analytics/DemographicsPie'
import GeographicMap from '@/components/analytics/Geographicmapwrapper'
import HeatMap from '@/components/analytics/HeatMap'
import TrendAnalysis from '@/components/analytics/TrendAnalysis'
import AnalyticsFilters from '@/components/analytics/AnalyticsFilters'
import DateRangePicker from '@/components/analytics/DateRangePicker'
import ExportData from '@/components/analytics/ExportData'

// ✅ TEMP FIX: fallback RevenueChart (prevents crash if missing)
const RevenueChart = ({ title }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-gray-500">Revenue chart placeholder</p>
  </div>
)

import {
  FunnelIcon,
  ArrowPathIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
  ServerIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

import {
  MOCK_METRICS,
  MOCK_USER_GROWTH,
  MOCK_REVENUE_DATA,
  MOCK_SESSIONS_DATA,
  MOCK_USER_DEMOGRAPHICS,
  MOCK_THERAPIST_ANALYTICS,
  MOCK_SESSION_ANALYTICS,
  MOCK_RESOURCE_ANALYTICS,
  MOCK_REVENUE_ANALYTICS,
  MOCK_PLATFORM_ANALYTICS,
  DATE_RANGES,
} from '@/constants/analytics'

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState(DATE_RANGES[2])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const [filters, setFilters] = useState({
    dateRange: DATE_RANGES[2],
    comparison: 'previous_period',
    groupBy: 'day',
    segments: [],
    metrics: [],
  })

  const [metrics] = useState(MOCK_METRICS)
  const [userGrowth] = useState(MOCK_USER_GROWTH)
  const [revenueData] = useState(MOCK_REVENUE_DATA)
  const [sessionsData] = useState(MOCK_SESSIONS_DATA)
  const [demographics] = useState(MOCK_USER_DEMOGRAPHICS)
  const [therapistAnalytics] = useState(MOCK_THERAPIST_ANALYTICS)
  const [sessionAnalytics] = useState(MOCK_SESSION_ANALYTICS)
  const [resourceAnalytics] = useState(MOCK_RESOURCE_ANALYTICS)
  const [revenueAnalytics] = useState(MOCK_REVENUE_ANALYTICS)
  const [platformAnalytics] = useState(MOCK_PLATFORM_ANALYTICS)

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'users', name: 'Users', icon: UserGroupIcon },
    { id: 'sessions', name: 'Sessions', icon: CalendarIcon },
    { id: 'therapists', name: 'Therapists', icon: UserGroupIcon },
    { id: 'resources', name: 'Resources', icon: BookOpenIcon },
    { id: 'revenue', name: 'Revenue', icon: CurrencyDollarIcon },
    { id: 'platform', name: 'Platform', icon: ServerIcon },
    { id: 'insights', name: 'AI Insights', icon: SparklesIcon },
  ]

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsLoading(false)
    }
    loadData()
  }, [selectedRange, filters])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsRefreshing(false)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setShowFilters(false)
  }

  const getLocationData = () =>
    demographics.locations.map(loc => ({
      country: loc.country,
      count: loc.count,
      percentage: loc.percentage,
      lat: loc.lat,
      lng: loc.lng,
    }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Analytics Dashboard" subtitle="Platform insights">
        <div className="flex items-center gap-3">
          <DateRangePicker
            selected={selectedRange}
            ranges={DATE_RANGES}
            onChange={setSelectedRange}
          />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-lg flex items-center gap-2"
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>

          <ExportData dateRange={selectedRange} metrics={metrics} />

          <button onClick={handleRefresh} title="Refresh analytics">
            <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </PageHeader>

      {showFilters && (
        <AnalyticsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 flex items-center gap-2 ${
                activeTab === tab.id ? 'border-b-2 border-primary-500' : ''
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          )
        })}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <UserGrowthChart data={userGrowth} title="User Growth" height={350} />
            <RevenueChart title="Revenue Over Time" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* ✅ removed height prop */}
              <HeatMap type="sessions" title="Session Activity Heat Map" />
            </div>

            <DemographicsPie
              data={demographics.ageGroups}
              title="Age Distribution"
              type="doughnut"
              height={350}
            />
          </div>

          <GeographicMap
            data={getLocationData()}
            title="User Distribution"
            height={400}
          />
        </div>
      )}

      {/* USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <UserGrowthChart data={userGrowth} title="Users" height={400} />

          {/* ✅ removed height */}
          <HeatMap type="users" showLegend={false} />
        </div>
      )}

      {/* REVENUE */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <RevenueChart title="Revenue Trend" />

          <TrendAnalysis
            metric="revenue"
            data={revenueAnalytics.revenueByMonth}
            predictions={revenueAnalytics.projectedRevenue}
            showConfidence
          />
        </div>
      )}

      {/* INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-linear-to-br from-primary-500 to-primary-600 p-8 text-white rounded-lg">
            <h2 className="text-2xl font-bold">AI Insights</h2>
            <p>Smart recommendations based on your data</p>
          </div>

          <TrendAnalysis metric="users" showConfidence />
        </div>
      )}
    </>
  )
}