'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/shared/PageHeader'
import TherapistTable from '@/components/therapists/TherapistTable'
import TherapistFilters from '@/components/therapists/TherapistFilters'
import TherapistStats from '@/components/therapists/TherapistStats'
import { 
  UserPlusIcon, 
  DocumentCheckIcon, 
  FunnelIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline'

interface Therapist {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  credentials: string[]
  specializations: string[]
  status: 'active' | 'inactive' | 'suspended' | 'on-leave'
  verificationStatus: 'pending' | 'verified' | 'rejected'
  averageRating: number
  totalSessions: number
  totalClients: number
  joinedDate: string
  profileImage?: string
}

const MOCK_THERAPISTS: Therapist[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@hopepath.org',
    phone: '+1-876-555-0101',
    credentials: ['PhD', 'LPC'],
    specializations: ['Anxiety', 'Depression', 'Trauma', 'Faith-Based Counseling'],
    status: 'active',
    verificationStatus: 'verified',
    averageRating: 4.8,
    totalSessions: 1243,
    totalClients: 89,
    joinedDate: '2024-01-15',
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@hopepath.org',
    phone: '+1-876-555-0102',
    credentials: ['PsyD', 'LMFT'],
    specializations: ['Relationship Issues', 'Family Conflict', 'Premarital Counseling'],
    status: 'active',
    verificationStatus: 'verified',
    averageRating: 4.9,
    totalSessions: 876,
    totalClients: 54,
    joinedDate: '2024-03-20',
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'White',
    email: 'emily.white@hopepath.org',
    phone: '+1-876-555-0103',
    credentials: ['LCSW'],
    specializations: ['Trauma', 'PTSD', 'Grief', 'Anxiety'],
    status: 'active',
    verificationStatus: 'verified',
    averageRating: 4.7,
    totalSessions: 432,
    totalClients: 38,
    joinedDate: '2024-06-10',
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@hopepath.org',
    phone: '+1-876-555-0104',
    credentials: ['PhD', 'LPCC'],
    specializations: ['Addiction', 'OCD', 'Bipolar Disorder'],
    status: 'inactive',
    verificationStatus: 'pending',
    averageRating: 0,
    totalSessions: 0,
    totalClients: 0,
    joinedDate: '2025-02-28',
  },
  {
    id: '5',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@hopepath.org',
    phone: '+1-876-555-0105',
    credentials: ['LMFT'],
    specializations: ['Couples Counseling', 'Family Therapy'],
    status: 'on-leave',
    verificationStatus: 'verified',
    averageRating: 4.6,
    totalSessions: 234,
    totalClients: 28,
    joinedDate: '2024-09-15',
  },
  {
    id: '6',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@hopepath.org',
    phone: '+1-876-555-0106',
    credentials: ['LPC'],
    specializations: ['Anxiety', 'Depression', 'Stress Management'],
    status: 'suspended',
    verificationStatus: 'rejected',
    averageRating: 3.2,
    totalSessions: 45,
    totalClients: 12,
    joinedDate: '2024-11-01',
  },
]

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    verificationStatus: '',
    specialization: '',
    minRating: '',
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTherapists(MOCK_THERAPISTS)
      setFilteredTherapists(MOCK_THERAPISTS)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = [...therapists]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(query) ||
        t.email.toLowerCase().includes(query) ||
        t.specializations.some(s => s.toLowerCase().includes(query))
      )
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status)
    }

    if (filters.verificationStatus) {
      filtered = filtered.filter(t => t.verificationStatus === filters.verificationStatus)
    }

    if (filters.specialization) {
      filtered = filtered.filter(t => 
        t.specializations.includes(filters.specialization)
      )
    }

    if (filters.minRating) {
      filtered = filtered.filter(t => 
        t.averageRating >= parseFloat(filters.minRating)
      )
    }

    setFilteredTherapists(filtered)
  }, [therapists, searchQuery, filters])

  const handleStatusChange = (id: string, newStatus: string) => {
    setTherapists(therapists.map(t => 
      t.id === id ? { ...t, status: newStatus as any } : t
    ))
  }

  const handleVerificationChange = (id: string, newStatus: string) => {
    setTherapists(therapists.map(t => 
      t.id === id ? { ...t, verificationStatus: newStatus as any } : t
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this therapist? This action cannot be undone.')) {
      setTherapists(therapists.filter(t => t.id !== id))
    }
  }

  const handleSuspend = (id: string) => {
    handleStatusChange(id, 'suspended')
  }

  const handleActivate = (id: string) => {
    handleStatusChange(id, 'active')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading therapists...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title="Therapist Management"
        subtitle="Manage therapists, verify credentials, and monitor their activity"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/therapists/applications"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <DocumentCheckIcon className="w-5 h-5 mr-2" />
            Applications
            <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </Link>
          <Link
            href="/admin/therapists/new"
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <UserPlusIcon className="w-5 h-5 mr-2" />
            Add Therapist
          </Link>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <TherapistStats therapists={therapists} />

      {/* Search and Filters */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search therapists by name, email, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
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
        </div>

        {showFilters && (
          <div className="mt-4">
            <TherapistFilters filters={filters} setFilters={setFilters} />
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredTherapists.length} of {therapists.length} therapists
      </div>

      {/* Therapists Table */}
      <div className="mt-4">
        <TherapistTable 
          therapists={filteredTherapists}
          onStatusChange={handleStatusChange}
          onVerificationChange={handleVerificationChange}
          onDelete={handleDelete}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
        />
      </div>
    </>
  )
}