'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/PageHeader'
// import MetricsCards from '@/components/analytics/MetricsCards'
import UserGrowthChart from '@/components/analytics/UserGrowthChart'
// import RevenueChart from '@/components/analytics/RevenueChart'
import DemographicsPie from '@/components/analytics/DemographicsPie'
import GeographicMap from '@/components/analytics/GeographicMap'
import HeatMap from '@/components/analytics/HeatMap'
import TrendAnalysis from '@/components/analytics/TrendAnalysis'
import AnalyticsFilters from '@/components/analytics/AnalyticsFilters'
import DateRangePicker from '@/components/analytics/DateRangePicker'
import ExportData from '@/components/analytics/ExportData'
import {
  FunnelIcon,
  ArrowDownTrayIcon,
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
  const [selectedRange, setSelectedRange] = useState(DATE_RANGES[2]) // Last 30 days
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

  // Analytics data states
  const [metrics, setMetrics] = useState(MOCK_METRICS)
  const [userGrowth, setUserGrowth] = useState(MOCK_USER_GROWTH)
  const [revenueData, setRevenueData] = useState(MOCK_REVENUE_DATA)
  const [sessionsData, setSessionsData] = useState(MOCK_SESSIONS_DATA)
  const [demographics, setDemographics] = useState(MOCK_USER_DEMOGRAPHICS)
  const [therapistAnalytics, setTherapistAnalytics] = useState(MOCK_THERAPIST_ANALYTICS)
  const [sessionAnalytics, setSessionAnalytics] = useState(MOCK_SESSION_ANALYTICS)
  const [resourceAnalytics, setResourceAnalytics] = useState(MOCK_RESOURCE_ANALYTICS)
  const [revenueAnalytics, setRevenueAnalytics] = useState(MOCK_REVENUE_ANALYTICS)
  const [platformAnalytics, setPlatformAnalytics] = useState(MOCK_PLATFORM_ANALYTICS)

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
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsLoading(false)
    }
    loadData()
  }, [selectedRange, filters])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
    setShowFilters(false)
  }

  const getLocationData = () => {
    return demographics.locations.map(loc => ({
      country: loc.country,
      count: loc.count,
      percentage: loc.percentage,
      lat: loc.lat,
      lng: loc.lng,
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading analytics...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Preparing your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title="Analytics Dashboard"
        subtitle="Comprehensive insights and metrics for your platform"
      >
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <DateRangePicker
            selected={selectedRange}
            ranges={DATE_RANGES}
            onChange={setSelectedRange}
          />

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                {Object.keys(filters).length}
              </span>
            )}
          </button>

          {/* Export Button */}
          <ExportData
            dateRange={selectedRange}
            metrics={metrics}
          />

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Refresh data"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </PageHeader>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6">
          <AnalyticsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <nav className="flex -mb-px space-x-8 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <MetricsCards metrics={metrics} />

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserGrowthChart 
              data={userGrowth}
              title="User Growth"
              height={350}
            />
            <RevenueChart 
              data={revenueData}
              title="Revenue Over Time"
              height={350}
            />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HeatMap 
                type="sessions"
                title="Session Activity Heat Map"
                height={350}
              />
            </div>
            <div>
              <DemographicsPie 
                data={demographics.ageGroups}
                title="Age Distribution"
                type="doughnut"
                height={350}
              />
            </div>
          </div>

          {/* Geographic Distribution */}
          <GeographicMap 
            data={getLocationData()}
            title="User Distribution by Location"
            height={400}
          />

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Therapists</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {therapistAnalytics.activeTherapists}
              </p>
              <p className="text-xs text-green-500 mt-2">+2 this week</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessionAnalytics.totalSessions}
              </p>
              <p className="text-xs text-green-500 mt-2">+{sessionAnalytics.completedSessions} completed</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Resource Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resourceAnalytics.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-green-500 mt-2">+{resourceAnalytics.totalDownloads} downloads</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Platform Uptime</p>
              <p className="text-2xl font-bold text-green-500">{platformAnalytics.uptime}%</p>
              <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserGrowthChart 
              data={userGrowth}
              title="User Growth Trend"
              height={400}
              showControls={true}
            />
            <DemographicsPie 
              data={demographics.genders}
              title="Gender Distribution"
              type="pie"
              height={400}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DemographicsPie 
              data={demographics.ageGroups}
              title="Age Distribution"
              type="doughnut"
              height={350}
            />
            <DemographicsPie 
              data={demographics.devices}
              title="Device Usage"
              type="pie"
              height={350}
            />
          </div>

          <GeographicMap 
            data={getLocationData()}
            title="Geographic Distribution"
            height={450}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Browser Usage</p>
              <div className="mt-4 space-y-3">
                {demographics.browsers.map(browser => (
                  <div key={browser.browser} className="flex items-center justify-between">
                    <span className="text-sm">{browser.browser}</span>
                    <span className="text-sm font-medium">{browser.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">User Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-2xl font-bold">{metrics[0].value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{metrics[1].value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Active Users (30d)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{metrics[4].value}%</p>
                  <p className="text-sm text-gray-500">Retention Rate</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">User Activity</p>
              <div className="mt-4 space-y-4">
                <HeatMap 
                  type="users"
                  title=""
                  height={200}
                  showLegend={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
              <p className="text-2xl font-bold">{sessionAnalytics.totalSessions}</p>
              <p className="text-xs text-green-500 mt-2">↑ 12% vs last period</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-green-500">{sessionAnalytics.sessionMetrics.completionRate}%</p>
              <p className="text-xs text-gray-500 mt-2">{sessionAnalytics.completedSessions} completed</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Duration</p>
              <p className="text-2xl font-bold">{sessionAnalytics.averageDuration} min</p>
              <p className="text-xs text-gray-500 mt-2">+2 min vs average</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Rating</p>
              <p className="text-2xl font-bold text-yellow-500">{sessionAnalytics.averageRating} ★</p>
              <p className="text-xs text-gray-500 mt-2">from {sessionAnalytics.totalSessions} reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              data={revenueData}
              title="Session Revenue"
              height={350}
            />
            <HeatMap 
              type="sessions"
              title="Session Heat Map"
              height={350}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Session Types</h3>
              <div className="space-y-4">
                {sessionAnalytics.sessionTypes.map(type => (
                  <div key={type.type}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{type.type}</span>
                      <span className="font-medium">{type.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 rounded-full h-2"
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
              <div className="space-y-3">
                {sessionAnalytics.peakHours.map(hour => (
                  <div key={hour.hour} className="flex items-center justify-between">
                    <span className="text-sm">{hour.hour}:00</span>
                    <div className="flex items-center gap-4 flex-1 ml-4">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 rounded-full h-2"
                          style={{ width: `${hour.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12">{hour.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Cancellation Reasons</h3>
              <div className="space-y-3">
                {sessionAnalytics.cancellationReasons.map(reason => (
                  <div key={reason.reason} className="flex items-center justify-between">
                    <span className="text-sm">{reason.reason}</span>
                    <span className="text-sm font-medium">{reason.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Therapists Tab */}
      {activeTab === 'therapists' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Therapists</p>
              <p className="text-2xl font-bold">{therapistAnalytics.totalTherapists}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-500">{therapistAnalytics.activeTherapists}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Verification</p>
              <p className="text-2xl font-bold text-yellow-500">{therapistAnalytics.pendingVerification}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Rating</p>
              <p className="text-2xl font-bold text-yellow-500">{therapistAnalytics.averageRating} ★</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Therapists</h3>
              <div className="space-y-4">
                {therapistAnalytics.topPerformers.map(therapist => (
                  <div key={therapist.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">{therapist.name}</p>
                      <p className="text-sm text-gray-500">{therapist.sessions} sessions · {therapist.rating} ★</p>
                    </div>
                    <p className="text-lg font-semibold text-primary-500">
                      ${therapist.revenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Specialization Breakdown</h3>
              <div className="space-y-4">
                {therapistAnalytics.specializationBreakdown.map(spec => (
                  <div key={spec.specialization}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{spec.specialization}</span>
                      <span className="font-medium">{spec.count} therapists ({spec.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 rounded-full h-2"
                        style={{ width: `${spec.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {therapistAnalytics.ratingDistribution.map(r => (
                  <div key={r.rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{r.rating} ★</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 rounded-full h-2"
                        style={{ width: `${(r.count / therapistAnalytics.totalSessions) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm w-16">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Session Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium text-green-500">{therapistAnalytics.sessionMetrics.completed}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: '94%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Cancelled</span>
                    <span className="text-sm font-medium text-yellow-500">{therapistAnalytics.sessionMetrics.cancelled}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 rounded-full h-2" style={{ width: '5%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">No Show</span>
                    <span className="text-sm font-medium text-red-500">{therapistAnalytics.sessionMetrics.noShow}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 rounded-full h-2" style={{ width: '2%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
              <div className="h-32">
                <TrendAnalysis 
                  metric="sessions"
                  data={therapistAnalytics.performanceOverTime}
                  showConfidence={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Resources</p>
              <p className="text-2xl font-bold">{resourceAnalytics.totalResources}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold">{resourceAnalytics.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Downloads</p>
              <p className="text-2xl font-bold">{resourceAnalytics.totalDownloads.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Engagement</p>
              <p className="text-2xl font-bold">{resourceAnalytics.averageEngagement}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Resources</h3>
              <div className="space-y-4">
                {resourceAnalytics.popularResources.map(resource => (
                  <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-gray-500">{resource.type} · {resource.views} views</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">❤️ {resource.likes}</span>
                      <span className="text-sm">🔄 {resource.shares}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
              <div className="space-y-4">
                {resourceAnalytics.categoryBreakdown.map(cat => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{cat.category}</span>
                      <span className="font-medium">{cat.views.toLocaleString()} views</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 rounded-full h-2"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Resource Types</h3>
              <div className="space-y-3">
                {resourceAnalytics.typeBreakdown.map(type => (
                  <div key={type.type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type.type}</span>
                    <span className="text-sm font-medium">{type.count} ({type.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Top Tags</h3>
              <div className="flex flex-wrap gap-2">
                {resourceAnalytics.topTags.map(tag => (
                  <span
                    key={tag.tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    #{tag.tag} ({tag.views})
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Engagement Over Time</h3>
              <div className="h-32">
                <UserGrowthChart 
                  data={resourceAnalytics.engagementOverTime}
                  title=""
                  height={120}
                  showControls={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold">${revenueAnalytics.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-2">↑ {revenueAnalytics.revenueGrowth}%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Order</p>
              <p className="text-2xl font-bold">${revenueAnalytics.averageOrderValue}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Customer LTV</p>
              <p className="text-2xl font-bold">${revenueAnalytics.customerLifetimeValue}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">MRR</p>
              <p className="text-2xl font-bold">${revenueAnalytics.subscriptionMetrics.mrr.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              data={revenueAnalytics.revenueByMonth}
              title="Revenue Trend"
              height={350}
              detailed={true}
            />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Therapist</h3>
              <div className="space-y-4">
                {revenueAnalytics.revenueByTherapist.slice(0, 5).map(therapist => (
                  <div key={therapist.therapistId} className="flex items-center justify-between">
                    <span className="text-sm">{therapist.therapistName}</span>
                    <span className="text-sm font-medium">${therapist.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {revenueAnalytics.revenueByPaymentMethod.map(method => (
                  <div key={method.method}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{method.method}</span>
                      <span className="font-medium">{method.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 rounded-full h-2"
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Session Type Revenue</h3>
              <div className="space-y-3">
                {revenueAnalytics.revenueBySessionType.map(type => (
                  <div key={type.type} className="flex items-center justify-between">
                    <span className="text-sm">{type.type}</span>
                    <span className="text-sm font-medium">${type.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Subscription Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">{revenueAnalytics.subscriptionMetrics.activeSubscriptions}</p>
                  <p className="text-sm text-gray-500">Active Subscriptions</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-lg font-semibold text-green-500">+{revenueAnalytics.subscriptionMetrics.newSubscriptions}</p>
                    <p className="text-xs text-gray-500">New</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-red-500">-{revenueAnalytics.subscriptionMetrics.cancelledSubscriptions}</p>
                    <p className="text-xs text-gray-500">Cancelled</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Churn Rate</p>
                  <p className="text-xl font-semibold">{revenueAnalytics.subscriptionMetrics.churnRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <TrendAnalysis 
            metric="revenue"
            data={revenueAnalytics.revenueByMonth}
            predictions={revenueAnalytics.projectedRevenue}
            showConfidence={true}
          />
        </div>
      )}

      {/* Platform Tab */}
      {activeTab === 'platform' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
              <p className="text-2xl font-bold text-green-500">{platformAnalytics.uptime}%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">API Requests</p>
              <p className="text-2xl font-bold">{platformAnalytics.apiRequests.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold">{platformAnalytics.apiResponseTime}ms</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Error Rate</p>
              <p className="text-2xl font-bold text-yellow-500">{platformAnalytics.errorRate}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">{platformAnalytics.performanceMetrics.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 ${
                        platformAnalytics.performanceMetrics.cpu > 80 ? 'bg-red-500' :
                        platformAnalytics.performanceMetrics.cpu > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${platformAnalytics.performanceMetrics.cpu}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">{platformAnalytics.performanceMetrics.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 ${
                        platformAnalytics.performanceMetrics.memory > 80 ? 'bg-red-500' :
                        platformAnalytics.performanceMetrics.memory > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${platformAnalytics.performanceMetrics.memory}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Disk Usage</span>
                    <span className="text-sm font-medium">{platformAnalytics.performanceMetrics.disk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 ${
                        platformAnalytics.performanceMetrics.disk > 80 ? 'bg-red-500' :
                        platformAnalytics.performanceMetrics.disk > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${platformAnalytics.performanceMetrics.disk}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Error Types</h3>
              <div className="space-y-3">
                {platformAnalytics.errorsByType.map(error => (
                  <div key={error.type} className="flex items-center justify-between">
                    <span className="text-sm">{error.type}</span>
                    <span className="text-sm font-medium">{error.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Top API Endpoints</h3>
              <div className="space-y-3">
                {platformAnalytics.requestsByEndpoint.map(endpoint => (
                  <div key={endpoint.endpoint} className="flex items-center justify-between">
                    <div>
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium block">{endpoint.count.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{endpoint.avgTime}ms avg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">User Satisfaction</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary-500">{platformAnalytics.userSatisfaction.nps}</p>
                  <p className="text-xs text-gray-500 mt-1">NPS Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-500">{platformAnalytics.userSatisfaction.csat}</p>
                  <p className="text-xs text-gray-500 mt-1">CSAT</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-500">{platformAnalytics.userSatisfaction.ces}</p>
                  <p className="text-xs text-gray-500 mt-1">CES</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer satisfaction is {platformAnalytics.userSatisfaction.csat >= 4.5 ? 'excellent' : 'good'}. 
                  NPS indicates strong user loyalty.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="w-8 h-8" />
              <h2 className="text-2xl font-bold">AI-Powered Insights</h2>
            </div>
            <p className="text-primary-100 text-lg mb-6">
              Intelligent analysis of your platform data to help you make better decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Growth Opportunities
              </h3>
              <ul className="space-y-4">
                <li className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-medium text-green-800 dark:text-green-400">User growth accelerating</p>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    New user signups have increased 23% this month. Consider expanding marketing efforts.
                  </p>
                </li>
                <li className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-medium text-blue-800 dark:text-blue-400">Peak hours identified</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Most sessions occur between 10 AM - 2 PM. Consider scheduling more therapists during these hours.
                  </p>
                </li>
                <li className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="font-medium text-purple-800 dark:text-purple-400">Resource engagement high</p>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                    Anxiety-related resources have 45% higher engagement. Create more content in this category.
                  </p>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Areas for Improvement
              </h3>
              <ul className="space-y-4">
                <li className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="font-medium text-yellow-800 dark:text-yellow-400">Session cancellations up</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                    Cancellation rate increased by 5%. Consider implementing reminder system.
                  </p>
                </li>
                <li className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="font-medium text-orange-800 dark:text-orange-400">Therapist availability gaps</p>
                  <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                    Evenings and weekends have 40% fewer available slots. Recruit more therapists for these times.
                  </p>
                </li>
                <li className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="font-medium text-red-800 dark:text-red-400">Payment failures increasing</p>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Payment failure rate at 3.2%. Review payment gateway configuration.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Predicted Growth (Next Month)</p>
              <p className="text-3xl font-bold text-green-500">+12.5%</p>
              <p className="text-xs text-gray-400 mt-2">Based on current trends</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Recommended Actions</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-gray-400 mt-2">High priority: 3</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-2">Confidence Score</p>
              <p className="text-3xl font-bold text-primary-500">92%</p>
              <p className="text-xs text-gray-400 mt-2">Based on data quality</p>
            </div>
          </div>

          <TrendAnalysis 
            metric="users"
            showConfidence={true}
          />
        </div>
      )}
    </>
  )
}