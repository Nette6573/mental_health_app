'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  credentials: string[]
  specializations: string[]
  licenseNumber: string
  applicationDate: string
  status: 'pending' | 'under-review' | 'approved' | 'rejected'
}

interface TherapistApplicationsProps {
  applications: Application[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onReview: (id: string) => void
}

export default function TherapistApplications({ 
  applications, 
  onApprove, 
  onReject, 
  onReview 
}: TherapistApplicationsProps) {
  const [filter, setFilter] = useState<string>('all')

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return { bg: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircleSolid }
      case 'rejected':
        return { bg: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircleIcon }
      case 'under-review':
        return { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: ClockIcon }
      default:
        return { bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: ClockIcon }
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    underReview: applications.filter(a => a.status === 'under-review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
            filter === 'all' ? 'ring-2 ring-primary-500' : ''
          }`}
          onClick={() => setFilter('all')}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
            filter === 'pending' ? 'ring-2 ring-yellow-500' : ''
          }`}
          onClick={() => setFilter('pending')}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
            filter === 'under-review' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setFilter('under-review')}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Under Review</p>
          <p className="text-2xl font-bold text-blue-500">{stats.underReview}</p>
        </div>
        <div 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
            filter === 'approved' ? 'ring-2 ring-green-500' : ''
          }`}
          onClick={() => setFilter('approved')}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
          <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
        </div>
        <div 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer transition-colors ${
            filter === 'rejected' ? 'ring-2 ring-red-500' : ''
          }`}
          onClick={() => setFilter('rejected')}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Credentials
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Specializations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  License #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApplications.map((app) => {
                const StatusBadge = getStatusBadge(app.status)
                const StatusIcon = StatusBadge.icon

                return (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 dark:text-primary-400 font-medium">
                            {app.firstName[0]}{app.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {app.firstName} {app.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {app.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {app.credentials.map(cred => (
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
                        {app.specializations.slice(0, 2).map(spec => (
                          <span
                            key={spec}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded"
                          >
                            {spec}
                          </span>
                        ))}
                        {app.specializations.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{app.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {app.licenseNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${StatusBadge.bg}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {app.status.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/therapists/applications/${app.id}`}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/therapists/applications/${app.id}/documents`}
                          className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                          title="View Documents"
                        >
                          <DocumentTextIcon className="w-5 h-5" />
                        </Link>
                        {app.status === 'pending' && (
                          <button
                            onClick={() => onReview(app.id)}
                            className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                            title="Mark as Under Review"
                          >
                            <ClockIcon className="w-5 h-5" />
                          </button>
                        )}
                        {(app.status === 'pending' || app.status === 'under-review') && (
                          <>
                            <button
                              onClick={() => onApprove(app.id)}
                              className="text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                              title="Approve"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onReject(app.id)}
                              className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                              title="Reject"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No applications found</p>
          </div>
        )}
      </div>
    </div>
  )
}