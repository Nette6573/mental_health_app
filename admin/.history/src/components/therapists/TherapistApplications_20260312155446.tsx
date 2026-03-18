'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  // support both field names
  applicationDate?: string
  submittedAt?: string
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
  onReview,
}: TherapistApplicationsProps) {
  const [filter, setFilter] = useState<string>('all')

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const filteredApplications = applications.filter(app =>
    filter === 'all' ? true : app.status === filter
  )

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    underReview: applications.filter(a => a.status === 'under-review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  const filterCards = [
    { key: 'all',          label: 'Total',        count: stats.total,       ring: 'ring-primary-500', text: 'text-gray-900 dark:text-white' },
    { key: 'pending',      label: 'Pending',      count: stats.pending,     ring: 'ring-yellow-500',  text: 'text-yellow-500' },
    { key: 'under-review', label: 'Under Review', count: stats.underReview, ring: 'ring-blue-500',    text: 'text-blue-500' },
    { key: 'approved',     label: 'Approved',     count: stats.approved,    ring: 'ring-green-500',   text: 'text-green-500' },
    { key: 'rejected',     label: 'Rejected',     count: stats.rejected,    ring: 'ring-red-500',     text: 'text-red-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {filterCards.map(card => (
          <div
            key={card.key}
            onClick={() => setFilter(card.key)}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer transition-all ${
              filter === card.key ? `ring-2 ${card.ring}` : 'hover:shadow-md'
            }`}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <p className={`text-2xl font-bold ${card.text}`}>{card.count}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Applicant', 'Credentials', 'Specializations', 'License #', 'Applied', 'Status', 'Actions'].map(h => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                      h === 'Actions' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApplications.map((app) => {
                const badge = getStatusBadge(app.status)
                const StatusIcon = badge.icon
                // safe initials — guard against undefined/empty strings
                const initials = `${app.firstName?.[0] ?? '?'}${app.lastName?.[0] ?? '?'}`
                // support both date field names
                const dateStr = app.submittedAt ?? app.applicationDate
                const displayDate = dateStr
                  ? new Date(dateStr).toLocaleDateString()
                  : '—'

                return (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    {/* Applicant */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                            {initials}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {app.firstName ?? ''} {app.lastName ?? ''}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{app.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Credentials */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(app.credentials ?? []).map(cred => (
                          <span
                            key={cred}
                            className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded"
                          >
                            {cred}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Specializations */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(app.specializations ?? []).slice(0, 2).map(spec => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {spec}
                          </span>
                        ))}
                        {(app.specializations?.length ?? 0) > 2 && (
                          <span className="text-xs text-gray-400">
                            +{app.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* License */}
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {app.licenseNumber ?? '—'}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {displayDate}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {app.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
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