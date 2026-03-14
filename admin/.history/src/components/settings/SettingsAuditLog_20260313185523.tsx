'use client'

import { useState } from 'react'
import {
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
  FunnelIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

interface AuditLog {
  id: string
  userId: string
  userName: string
  action: 'update' | 'delete' | 'create' | 'toggle'
  section: string
  setting: string
  oldValue?: any
  newValue?: any
  ipAddress?: string
  timestamp: string
  metadata?: Record<string, any>
}

interface SettingsAuditLogProps {
  settings: any
  onSettingChange: (section: string, key: string, value: any) => void
  onNestedChange: (section: string, parent: string, key: string, value: any) => void
}

export default function SettingsAuditLog({ settings }: SettingsAuditLogProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterSection, setFilterSection] = useState('')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const itemsPerPage = 10

  // Load mock data
  useState(() => {
    // Simulate API call
    setTimeout(() => {
      setLogs(MOCK_AUDIT_LOGS)
      setIsLoading(false)
    }, 1000)
  })

  // Mock data - in production this would come from an API
  const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
      id: 'log-001',
      userId: 'admin1',
      userName: 'Super Admin',
      action: 'update',
      section: 'security',
      setting: 'passwordMinLength',
      oldValue: 6,
      newValue: 8,
      ipAddress: '192.168.1.100',
      timestamp: '2025-03-12T09:30:00Z',
    },
    {
      id: 'log-002',
      userId: 'admin2',
      userName: 'John Doe',
      action: 'toggle',
      section: 'maintenance',
      setting: 'maintenanceMode',
      oldValue: false,
      newValue: true,
      ipAddress: '192.168.1.101',
      timestamp: '2025-03-12T10:15:00Z',
    },
    {
      id: 'log-003',
      userId: 'admin1',
      userName: 'Super Admin',
      action: 'update',
      section: 'payments',
      setting: 'sessionPricing.individual',
      oldValue: 100,
      newValue: 120,
      ipAddress: '192.168.1.100',
      timestamp: '2025-03-11T14:20:00Z',
    },
    {
      id: 'log-004',
      userId: 'admin3',
      userName: 'Jane Smith',
      action: 'create',
      section: 'api',
      setting: 'apiKeys',
      oldValue: null,
      newValue: { name: 'Mobile App', permissions: ['read:users'] },
      ipAddress: '192.168.1.102',
      timestamp: '2025-03-11T11:05:00Z',
    },
    {
      id: 'log-005',
      userId: 'admin2',
      userName: 'John Doe',
      action: 'delete',
      section: 'integrations',
      setting: 'webhooks',
      oldValue: { id: 'webhook-001', url: 'https://example.com/webhook' },
      newValue: null,
      ipAddress: '192.168.1.101',
      timestamp: '2025-03-10T16:45:00Z',
    },
    {
      id: 'log-006',
      userId: 'admin1',
      userName: 'Super Admin',
      action: 'update',
      section: 'email',
      setting: 'smtpHost',
      oldValue: 'smtp.gmail.com',
      newValue: 'smtp.office365.com',
      ipAddress: '192.168.1.100',
      timestamp: '2025-03-10T09:20:00Z',
    },
    {
      id: 'log-007',
      userId: 'admin3',
      userName: 'Jane Smith',
      action: 'toggle',
      section: 'notifications',
      setting: 'notificationTypes.newUser',
      oldValue: false,
      newValue: true,
      ipAddress: '192.168.1.102',
      timestamp: '2025-03-09T14:30:00Z',
    },
    {
      id: 'log-008',
      userId: 'admin2',
      userName: 'John Doe',
      action: 'update',
      section: 'backup',
      setting: 'frequency',
      oldValue: 'daily',
      newValue: 'weekly',
      ipAddress: '192.168.1.101',
      timestamp: '2025-03-09T10:15:00Z',
    },
    {
      id: 'log-009',
      userId: 'admin1',
      userName: 'Super Admin',
      action: 'create',
      section: 'users',
      setting: 'defaultUserRole',
      oldValue: null,
      newValue: 'user',
      ipAddress: '192.168.1.100',
      timestamp: '2025-03-08T15:40:00Z',
    },
    {
      id: 'log-010',
      userId: 'admin3',
      userName: 'Jane Smith',
      action: 'update',
      section: 'general',
      setting: 'platformName',
      oldValue: 'HopePath',
      newValue: 'HopePath Mental Health',
      ipAddress: '192.168.1.102',
      timestamp: '2025-03-08T11:25:00Z',
    },
    {
      id: 'log-011',
      userId: 'admin2',
      userName: 'John Doe',
      action: 'delete',
      section: 'api',
      setting: 'apiKeys',
      oldValue: { id: 'key-002', name: 'Test Key' },
      newValue: null,
      ipAddress: '192.168.1.101',
      timestamp: '2025-03-07T13:50:00Z',
    },
    {
      id: 'log-012',
      userId: 'admin1',
      userName: 'Super Admin',
      action: 'toggle',
      section: 'security',
      setting: 'twoFactorRequired',
      oldValue: false,
      newValue: true,
      ipAddress: '192.168.1.100',
      timestamp: '2025-03-07T09:10:00Z',
    },
  ]

  // Filter logs
  const filteredLogs = logs.filter(log => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matches = 
        log.userName.toLowerCase().includes(query) ||
        log.section.toLowerCase().includes(query) ||
        log.setting.toLowerCase().includes(query) ||
        JSON.stringify(log.oldValue).toLowerCase().includes(query) ||
        JSON.stringify(log.newValue).toLowerCase().includes(query)
      if (!matches) return false
    }

    // Action filter
    if (filterAction && log.action !== filterAction) return false

    // Section filter
    if (filterSection && log.section !== filterSection) return false

    // Date range filter
    if (dateRange !== 'all') {
      const logDate = new Date(log.timestamp)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      if (dateRange === 'today') {
        if (logDate < today) return false
      } else if (dateRange === 'week') {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        if (logDate < weekAgo) return false
      } else if (dateRange === 'month') {
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        if (logDate < monthAgo) return false
      }
    }

    return true
  })

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In production, fetch new logs from API
    setIsRefreshing(false)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `audit-log-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const getActionColor = (action: string) => {
    switch(action) {
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'toggle':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getSectionIcon = (section: string) => {
    switch(section) {
      case 'security': return '🔒'
      case 'general': return '🏠'
      case 'email': return '📧'
      case 'notifications': return '🔔'
      case 'users': return '👥'
      case 'payments': return '💰'
      case 'integrations': return '🔌'
      case 'backup': return '💾'
      case 'maintenance': return '🔧'
      case 'api': return '🌐'
      default: return '📋'
    }
  }

  const formatValue = (value: any) => {
    if (value === undefined || value === null) return 'null'
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-primary-500" />
              <h2 className="text-xl font-semibold">Audit Log</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Export Logs
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track all changes made to system settings
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs by user, section, setting, or value..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Actions</option>
                <option value="update">Update</option>
                <option value="create">Create</option>
                <option value="delete">Delete</option>
                <option value="toggle">Toggle</option>
              </select>
            </div>

            {/* Section Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section
              </label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Sections</option>
                <option value="security">Security</option>
                <option value="general">General</option>
                <option value="email">Email</option>
                <option value="notifications">Notifications</option>
                <option value="users">Users</option>
                <option value="payments">Payments</option>
                <option value="integrations">Integrations</option>
                <option value="backup">Backup</option>
                <option value="maintenance">Maintenance</option>
                <option value="api">API</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'} found
                </p>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || filterAction || filterSection || dateRange !== 'all') && (
            <div className="flex flex-wrap gap-2 pt-2">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-primary-900">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filterAction && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  Action: {filterAction}
                  <button onClick={() => setFilterAction('')} className="hover:text-primary-900">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filterSection && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  Section: {filterSection}
                  <button onClick={() => setFilterSection('')} className="hover:text-primary-900">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {dateRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  Range: {dateRange}
                  <button onClick={() => setDateRange('all')} className="hover:text-primary-900">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Setting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Changes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-2">
                        <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                          {log.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {log.userId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getSectionIcon(log.section)}</span>
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {log.section}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {log.setting}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-red-600 line-through decoration-2 max-w-[150px] truncate">
                        {formatValue(log.oldValue)}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-600 max-w-[150px] truncate">
                        {formatValue(log.newValue)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.ipAddress ? (
                      <div className="flex items-center text-sm text-gray-500">
                        <GlobeAltIcon className="w-4 h-4 mr-1" />
                        {log.ipAddress}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedLog(log)
                        setShowDetailsModal(true)
                      }}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No audit logs found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setShowDetailsModal(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Audit Log Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Log ID</p>
                    <p className="font-mono text-sm">{selectedLog.id}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                    <p className="font-medium">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                {/* User Info */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">User Information</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLog.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">User ID</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{selectedLog.userId}</p>
                    </div>
                    {selectedLog.ipAddress && (
                      <div>
                        <p className="text-sm font-medium">IP Address</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLog.ipAddress}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Change Details */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Change Details</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-20">Section:</span>
                      <span className="text-sm capitalize flex items-center gap-1">
                        {getSectionIcon(selectedLog.section)} {selectedLog.section}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-20">Setting:</span>
                      <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                        {selectedLog.setting}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-20">Action:</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getActionColor(selectedLog.action)}`}>
                        {selectedLog.action}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Value Changes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400 mb-2">Old Value</p>
                    <pre className="text-sm bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-40">
                      {JSON.stringify(selectedLog.oldValue, null, 2)}
                    </pre>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-2">New Value</p>
                    <pre className="text-sm bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-40">
                      {JSON.stringify(selectedLog.newValue, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Metadata */}
                {selectedLog.metadata && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Additional Metadata</p>
                    <pre className="text-sm bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}