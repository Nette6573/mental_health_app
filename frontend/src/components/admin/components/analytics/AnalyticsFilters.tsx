'use client'

import { Fragment, useState } from 'react'
import { Listbox, Transition, Popover } from '@headlessui/react'
import {
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import DateRangePicker from './DateRangePicker'
import { DATE_RANGES, COMPARISON_OPTIONS, GROUP_BY_OPTIONS } from '@/constants/analytics'

interface AnalyticsFiltersProps {
  filters: any
  onFilterChange: (filters: any) => void
  onClose?: () => void
}

export default function AnalyticsFilters({ filters, onFilterChange, onClose }: AnalyticsFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const metricCategories = [
    {
      id: 'users',
      name: 'User Metrics',
      icon: UserGroupIcon,
      metrics: [
        { id: 'totalUsers', label: 'Total Users' },
        { id: 'activeUsers', label: 'Active Users' },
        { id: 'newUsers', label: 'New Users' },
        { id: 'churnRate', label: 'Churn Rate' },
        { id: 'retentionRate', label: 'Retention Rate' },
      ],
    },
    {
      id: 'sessions',
      name: 'Session Metrics',
      icon: CalendarIcon,
      metrics: [
        { id: 'totalSessions', label: 'Total Sessions' },
        { id: 'completedSessions', label: 'Completed Sessions' },
        { id: 'averageRating', label: 'Average Rating' },
        { id: 'averageDuration', label: 'Average Duration' },
      ],
    },
    {
      id: 'revenue',
      name: 'Revenue Metrics',
      icon: CurrencyDollarIcon,
      metrics: [
        { id: 'totalRevenue', label: 'Total Revenue' },
        { id: 'averageOrderValue', label: 'Average Order Value' },
        { id: 'mrr', label: 'MRR' },
        { id: 'arr', label: 'ARR' },
      ],
    },
    {
      id: 'resources',
      name: 'Resource Metrics',
      icon: DocumentTextIcon,
      metrics: [
        { id: 'totalViews', label: 'Total Views' },
        { id: 'totalDownloads', label: 'Total Downloads' },
        { id: 'engagement', label: 'Engagement Rate' },
      ],
    },
  ]

  const segments = [
    { id: 'newUsers', label: 'New Users' },
    { id: 'returningUsers', label: 'Returning Users' },
    { id: 'premiumUsers', label: 'Premium Users' },
    { id: 'freeUsers', label: 'Free Users' },
    { id: 'mobile', label: 'Mobile Users' },
    { id: 'desktop', label: 'Desktop Users' },
  ]

  const handleApply = () => {
    onFilterChange(localFilters)
    if (onClose) onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      dateRange: DATE_RANGES[2],
      comparison: 'none',
      groupBy: 'day',
      segments: [],
      metrics: [],
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const handleMetricToggle = (metricId: string) => {
    const current = localFilters.metrics || []
    const updated = current.includes(metricId)
      ? current.filter((m: string) => m !== metricId)
      : [...current, metricId]
    setLocalFilters({ ...localFilters, metrics: updated })
  }

  const handleSegmentToggle = (segmentId: string) => {
    const current = localFilters.segments || []
    const updated = current.includes(segmentId)
      ? current.filter((s: string) => s !== segmentId)
      : [...current, segmentId]
    setLocalFilters({ ...localFilters, segments: updated })
  }

  const activeFilterCount = [
    localFilters.comparison !== 'none' ? 1 : 0,
    localFilters.groupBy !== 'day' ? 1 : 0,
    localFilters.segments?.length || 0,
    localFilters.metrics?.length || 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium">Analytics Filters</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium px-2 py-0.5 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Reset
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-6 space-y-6">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <DateRangePicker
            selected={localFilters.dateRange}
            ranges={DATE_RANGES}
            onChange={(range) => setLocalFilters({ ...localFilters, dateRange: range })}
          />
        </div>

        {/* Comparison */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Compare With
          </label>
          <Listbox
            value={localFilters.comparison}
            onChange={(value) => setLocalFilters({ ...localFilters, comparison: value })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2.5 pl-4 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <span className="block truncate">
                  {COMPARISON_OPTIONS.find(o => o.value === localFilters.comparison)?.label || 'No Comparison'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {COMPARISON_OPTIONS.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.label}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                              <CheckIcon className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Group By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Group By
          </label>
          <Listbox
            value={localFilters.groupBy}
            onChange={(value) => setLocalFilters({ ...localFilters, groupBy: value })}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2.5 pl-4 pr-10 text-left border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <span className="block truncate">
                  {GROUP_BY_OPTIONS.find(o => o.value === localFilters.groupBy)?.label || 'Day'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {GROUP_BY_OPTIONS.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-900 dark:text-white'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.label}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                              <CheckIcon className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Metrics Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Metrics
          </label>
          <div className="space-y-3">
            {metricCategories.map((category) => {
              const Icon = category.icon
              const selectedCount = (localFilters.metrics || []).filter((m: string) =>
                category.metrics.some(cm => cm.id === m)
              ).length

              return (
                <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => setActiveSection(activeSection === category.id ? null : category.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedCount > 0 && (
                        <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                          {selectedCount}
                        </span>
                      )}
                      <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>

                  {activeSection === category.id && (
                    <div className="px-4 pb-3 pt-1 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-2">
                        {category.metrics.map((metric) => (
                          <label key={metric.id} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={(localFilters.metrics || []).includes(metric.id)}
                              onChange={() => handleMetricToggle(metric.id)}
                              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-2"
                            />
                            {metric.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Segments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Segments
          </label>
          <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {segments.map((segment) => (
              <label key={segment.id} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={(localFilters.segments || []).includes(segment.id)}
                  onChange={() => handleSegmentToggle(segment.id)}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 mr-2"
                />
                {segment.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}