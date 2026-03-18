'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  NoSymbolIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  role: 'user' | 'premium' | 'counselor' | 'admin'
  emailVerified: boolean
  twoFactorEnabled: boolean
  totalSessions: number
  totalResources: number
  lastActive: string
  joinedDate: string
  avatar?: string
  tags?: string[]
  suspendedUntil?: string
  suspensionReason?: string
}

interface UsersTableProps {
  users: User[]
  selectedUsers: string[]
  onSelectUser: (userId: string) => void
  onSelectAll: (selected: boolean) => void
  onStatusChange: (userId: string, newStatus: string) => void
  onSuspend: (userId: string, reason: string, duration: string) => void
  onActivate: (userId: string) => void
}

export default function UsersTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onStatusChange,
  onSuspend,
  onActivate,
}: UsersTableProps) {
  const [sortField, setSortField] = useState<keyof User>('joinedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showSuspendModal, setShowSuspendModal] = useState<string | null>(null)
  const [suspendReason, setSuspendReason] = useState('')
  const [suspendDuration, setSuspendDuration] = useState('7')

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === 'joinedDate' || sortField === 'lastActive') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'premium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'counselor':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const SortIcon = ({ field }: { field: keyof User }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 inline ml-1" />
      : <ChevronDownIcon className="w-4 h-4 inline ml-1" />
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('firstName')}
                >
                  User <SortIcon field="firstName" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('role')}
                >
                  Role <SortIcon field="role" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('status')}
                >
                  Status <SortIcon field="status" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Verification
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('totalSessions')}
                >
                  Sessions <SortIcon field="totalSessions" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('lastActive')}
                >
                  Last Active <SortIcon field="lastActive" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('joinedDate')}
                >
                  Joined <SortIcon field="joinedDate" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => onSelectUser(user.id)}
                      className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/admin/users/${user.id}`}
                      className="flex items-center group"
                    >
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors">
                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <EnvelopeIcon className="w-3 h-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <PhoneIcon className="w-3 h-3" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'suspended' ? (
                      <div className="group relative">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(user.status)}`}>
                          Suspended
                        </span>
                        {user.suspensionReason && (
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                            <p className="font-medium">Reason:</p>
                            <p>{user.suspensionReason}</p>
                            {user.suspendedUntil && (
                              <p className="mt-1 text-gray-300">
                                Until: {new Date(user.suspendedUntil).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <select
                        value={user.status}
                        onChange={(e) => {
                          const newStatus = e.target.value
                          if (newStatus === 'suspended') {
                            setShowSuspendModal(user.id)
                          } else {
                            onStatusChange(user.id, newStatus)
                          }
                        }}
                        className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 ${getStatusBadge(user.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.emailVerified ? (
                        <CheckCircleSolid className="w-5 h-5 text-green-500" title="Email verified" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-gray-400" title="Email not verified" />
                      )}
                      {user.twoFactorEnabled && (
                        <ShieldCheckIcon className="w-5 h-5 text-blue-500" title="2FA enabled" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.totalSessions}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.totalResources} resources
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      {user.status === 'suspended' ? (
                        <button
                          onClick={() => onActivate(user.id)}
                          className="p-1 text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                          title="Activate"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowSuspendModal(user.id)}
                          className="p-1 text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors"
                          title="Suspend"
                        >
                          <NoSymbolIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        )}

        {/* Pagination */}
        {users.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing 1 to {users.length} of {users.length} results
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setShowSuspendModal(null)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Suspend User Account</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Suspension
                  </label>
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter reason for suspension..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suspension Duration
                  </label>
                  <select
                    value={suspendDuration}
                    onChange={(e) => setSuspendDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="permanent">Permanent</option>
                  </select>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowSuspendModal(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (showSuspendModal && suspendReason.trim()) {
                        onSuspend(showSuspendModal, suspendReason, suspendDuration)
                        setShowSuspendModal(null)
                        setSuspendReason('')
                        setSuspendDuration('7')
                      }
                    }}
                    disabled={!suspendReason.trim()}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suspend Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}