'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/shared/PageHeader'
import UsersTable from '@/components/users/UsersTabl'
import UserFilters from '@/components/users/UserFilters'
import UserStats from '@/components/users/UserStats'
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline'
import { MOCK_USERS, MOCK_USER_STATS } from '@/constants/user'

export default function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    verified: '',
    dateRange: '',
  })

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = [...users]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status)
    }

    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role)
    }

    if (filters.verified) {
      const verified = filters.verified === 'verified'
      filtered = filtered.filter(user => user.emailVerified === verified)
    }

    setFilteredUsers(filtered)
    setSelectedUsers([])
  }, [users, searchQuery, filters])

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { 
        ...user, 
        status: newStatus as any,
        updatedAt: new Date().toISOString()
      } : user
    ))
  }

  const handleSuspend = (userId: string, reason: string, duration: string) => {
    const suspendedUntil = duration === 'permanent' 
      ? 'permanent'
      : new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000).toISOString()

    setUsers(users.map(user => 
      user.id === userId ? { 
        ...user, 
        status: 'suspended',
        suspendedUntil: suspendedUntil === 'permanent' ? undefined : suspendedUntil,
        suspensionReason: reason,
        updatedAt: new Date().toISOString()
      } : user
    ))
  }

  const handleActivate = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { 
        ...user, 
        status: 'active',
        suspendedUntil: undefined,
        suspensionReason: undefined,
        updatedAt: new Date().toISOString()
      } : user
    ))
  }

  const handleBulkAction = (action: 'activate' | 'suspend' | 'delete') => {
    if (selectedUsers.length === 0) return

    const confirmMessage = {
      activate: `Activate ${selectedUsers.length} user(s)?`,
      suspend: `Suspend ${selectedUsers.length} user(s)?`,
      delete: `Delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
    }[action]

    if (!confirm(confirmMessage)) return

    if (action === 'activate') {
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
      ))
    } else if (action === 'suspend') {
      // For bulk suspend, we'll use a default reason
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? { 
          ...user, 
          status: 'suspended',
          suspensionReason: 'Admin action',
          updatedAt: new Date().toISOString()
        } : user
      ))
    } else if (action === 'delete') {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)))
    }

    setSelectedUsers([])
  }

  const handleExport = () => {
    // In a real app, this would generate a CSV/Excel file
    const data = filteredUsers.map(user => ({
      Name: `${user.firstName} ${user.lastName}`,
      Email: user.email,
      Status: user.status,
      Role: user.role,
      'Joined Date': new Date(user.joinedDate).toLocaleDateString(),
      'Last Active': new Date(user.lastActive).toLocaleDateString(),
      Sessions: user.totalSessions,
    }))

    console.log('Export data:', data)
    alert('Export functionality would generate a file here')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title="User Management"
        subtitle="Manage and monitor all platform users"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
            {Object.values(filters).some(v => v) && (
              <span className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setSearchQuery('')
              setFilters({ status: '', role: '', verified: '', dateRange: '' })
            }}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Reset filters"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <UserStats stats={MOCK_USER_STATS} />

      {/* Search and Filters */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, phone, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mt-4">
            <UserFilters filters={filters} setFilters={setFilters} />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="mt-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="font-medium text-primary-700 dark:text-primary-300">
              {selectedUsers.length} user(s) selected
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Activate All
            </button>
            <button
              onClick={() => handleBulkAction('suspend')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Suspend All
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete All
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <span>Showing {filteredUsers.length} of {users.length} users</span>
        <span className="text-xs">
          Page 1 of {Math.ceil(filteredUsers.length / 10)}
        </span>
      </div>

      {/* Users Table */}
      <div className="mt-4">
        <UsersTable 
          users={filteredUsers}
          selectedUsers={selectedUsers}
          onSelectUser={(userId) => {
            setSelectedUsers(prev =>
              prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
            )
          }}
          onSelectAll={(selected) => {
            setSelectedUsers(selected ? filteredUsers.map(u => u.id) : [])
          }}
          onStatusChange={handleStatusChange}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
        />
      </div>
    </>
  )
}