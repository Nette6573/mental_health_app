'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  NoSymbolIcon,
  PlayCircleIcon,
  StopCircleIcon,
  ShieldCheckIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

interface Therapist {
  id: string
  firstName: string
  lastName: string
  email: string
  credentials: string[]
  specializations: string[]
  status: 'active' | 'inactive' | 'suspended' | 'on-leave'
  verificationStatus: 'pending' | 'verified' | 'rejected'
  averageRating: number
  totalSessions: number
  totalClients: number
  joinedDate: string
}

interface TherapistTableProps {
  therapists: Therapist[]
  onStatusChange: (id: string, status: string) => void
  onVerificationChange: (id: string, status: string) => void
  onDelete: (id: string) => void
  onSuspend: (id: string) => void
  onActivate: (id: string) => void
}

export default function TherapistTable({
  therapists,
  onStatusChange,
  onVerificationChange,
  onDelete,
  onSuspend,
  onActivate,
}: TherapistTableProps) {
  const [selectedTherapists, setSelectedTherapists] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Therapist>('joinedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const toggleSelect = (id: string) => {
    setSelectedTherapists(prev =>
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedTherapists.length === therapists.length) {
      setSelectedTherapists([])
    } else {
      setSelectedTherapists(therapists.map(t => t.id))
    }
  }

  const handleSort = (field: keyof Therapist) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedTherapists = [...therapists].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
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
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationBadge = (status: string) => {
    switch(status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
          {rating.toFixed(1)}
        </span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Bulk Actions */}
      {selectedTherapists.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {selectedTherapists.length} therapist(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                selectedTherapists.forEach(id => onActivate(id))
                setSelectedTherapists([])
              }}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Activate All
            </button>
            <button
              onClick={() => {
                selectedTherapists.forEach(id => onSuspend(id))
                setSelectedTherapists([])
              }}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Suspend All
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete ${selectedTherapists.length} therapists?`)) {
                  selectedTherapists.forEach(id => onDelete(id))
                  setSelectedTherapists([])
                }
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete All
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedTherapists.length === therapists.length && therapists.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('firstName')}
              >
                Therapist
                {sortField === 'firstName' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Credentials
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Specializations
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('status')}
              >
                Status
                {sortField === 'status' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('verificationStatus')}
              >
                Verification
                {sortField === 'verificationStatus' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('averageRating')}
              >
                Rating
                {sortField === 'averageRating' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('totalSessions')}
              >
                Sessions
                {sortField === 'totalSessions' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTherapists.map((therapist) => (
              <tr key={therapist.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTherapists.includes(therapist.id)}
                    onChange={() => toggleSelect(therapist.id)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/admin/therapists/${therapist.id}`}
                    className="flex items-center group"
                  >
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/30 transition-colors">
                      <span className="text-primary-600 dark:text-primary-400 font-medium">
                        {therapist.firstName[0]}{therapist.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {therapist.firstName} {therapist.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {therapist.email}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {therapist.credentials.map(cred => (
                      <span
                        key={cred}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded"
                      >
                        {cred}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {therapist.specializations.slice(0, 2).map(spec => (
                      <span
                        key={spec}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded"
                      >
                        {spec}
                      </span>
                    ))}
                    {therapist.specializations.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{therapist.specializations.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={therapist.status}
                    onChange={(e) => onStatusChange(therapist.id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 ${getStatusBadge(therapist.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={therapist.verificationStatus}
                    onChange={(e) => onVerificationChange(therapist.id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 ${getVerificationBadge(therapist.verificationStatus)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {renderStars(therapist.averageRating)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {therapist.totalSessions.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {therapist.totalClients} clients
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/therapists/${therapist.id}`}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="View Profile"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/therapists/${therapist.id}/edit`}
                      className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    {therapist.status === 'active' ? (
                      <button
                        onClick={() => onSuspend(therapist.id)}
                        className="text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors"
                        title="Suspend"
                      >
                        <StopCircleIcon className="w-5 h-5" />
                      </button>
                    ) : therapist.status === 'suspended' ? (
                      <button
                        onClick={() => onActivate(therapist.id)}
                        className="text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                        title="Activate"
                      >
                        <PlayCircleIcon className="w-5 h-5" />
                      </button>
                    ) : null}
                    {therapist.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => onVerificationChange(therapist.id, 'verified')}
                        className="text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                        title="Verify"
                      >
                        <ShieldCheckIcon className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(therapist.id)}
                      className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {therapists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No therapists found</p>
        </div>
      )}

      {/* Pagination */}
      {therapists.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing 1 to {therapists.length} of {therapists.length} results
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
  )
}