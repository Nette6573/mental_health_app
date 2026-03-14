'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  StarIcon,
  ShieldCheckIcon,
  MapPinIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import PageHeader from '@/components/shared/PageHeader'

interface Therapist {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  credentials: string[]
  specializations: string[]
  licenseNumber: string
  licenseIssuingBoard: string
  licenseExpiryDate: string
  yearsOfExperience: number
  education: Array<{
    degree: string
    institution: string
    year: number
  }>
  practiceName?: string
  practiceAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  offersOnlineTherapy: boolean
  offersInPersonTherapy: boolean
  languages: string[]
  sessionTypes: {
    individual: boolean
    couples: boolean
    family: boolean
    group: boolean
  }
  sessionRate: {
    individual?: number
    couples?: number
    family?: number
    group?: number
  }
  acceptsInsurance: boolean
  insuranceProviders: string[]
  slidingScale: boolean
  slidingScaleRange?: {
    min: number
    max: number
  }
  bio: string
  profileCompleted: boolean
  verificationStatus: 'pending' | 'verified' | 'rejected'
  status: 'active' | 'inactive' | 'suspended' | 'on-leave'
  totalSessions: number
  totalClients: number
  averageRating: number
  totalReviews: number
  joinedDate: string
  lastActive?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
}

const MOCK_THERAPIST: Therapist = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@hopepath.org',
  phone: '+1-876-555-0101',
  dateOfBirth: '1980-03-15',
  gender: 'female',
  credentials: ['PhD', 'LPC'],
  specializations: ['Anxiety', 'Depression', 'Trauma', 'Faith-Based Counseling'],
  licenseNumber: 'LPC-12345',
  licenseIssuingBoard: 'Jamaica Council of Professions',
  licenseExpiryDate: '2026-12-31',
  yearsOfExperience: 12,
  education: [
    {
      degree: 'PhD in Clinical Psychology',
      institution: 'University of the West Indies',
      year: 2012,
    },
    {
      degree: 'MA in Counseling',
      institution: 'Northern Caribbean University',
      year: 2008,
    },
  ],
  practiceName: 'HopePath Counseling Center',
  practiceAddress: {
    street: '123 Hope Road',
    city: 'Kingston',
    state: 'Kingston',
    zipCode: 'KGN-5',
    country: 'Jamaica',
  },
  offersOnlineTherapy: true,
  offersInPersonTherapy: true,
  languages: ['English', 'Spanish'],
  sessionTypes: {
    individual: true,
    couples: true,
    family: false,
    group: true,
  },
  sessionRate: {
    individual: 120,
    couples: 150,
    group: 60,
  },
  acceptsInsurance: true,
  insuranceProviders: ['Blue Cross Blue Shield', 'Aetna'],
  slidingScale: true,
  slidingScaleRange: {
    min: 80,
    max: 120,
  },
  bio: "Dr. Sarah Johnson is a licensed professional counselor with over 12 years of experience helping individuals and couples navigate life's challenges. She specializes in anxiety, depression, and trauma recovery, integrating faith-based approaches for those seeking spiritual support in their healing journey.",
  profileCompleted: true,
  verificationStatus: 'verified',
  status: 'active',
  totalSessions: 1243,
  totalClients: 89,
  averageRating: 4.8,
  totalReviews: 67,
  joinedDate: '2024-01-15',
  lastActive: '2025-03-10',
  emergencyContact: {
    name: 'Michael Johnson',
    relationship: 'Spouse',
    phone: '+1-876-555-0199',
    email: 'michael.johnson@email.com',
  },
}

export default function TherapistDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTherapist(MOCK_THERAPIST)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'on-leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationColor = (status: string) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading therapist details...</p>
        </div>
      </div>
    )
  }

  if (!therapist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Therapist not found</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserGroupIcon },
    { id: 'professional', name: 'Professional', icon: AcademicCapIcon },
    { id: 'practice', name: 'Practice', icon: BriefcaseIcon },
    { id: 'schedule', name: 'Schedule', icon: ClockIcon },
    { id: 'clients', name: 'Clients', icon: UserGroupIcon },
    { id: 'reviews', name: 'Reviews', icon: StarIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
  ]

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Therapists
        </button>
        <Link
          href={`/admin/therapists/${therapist.id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PencilIcon className="w-5 h-5 mr-2" />
          Edit Therapist
        </Link>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-4xl text-primary-600 dark:text-primary-400 font-medium">
              {therapist.firstName[0]}{therapist.lastName[0]}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dr. {therapist.firstName} {therapist.lastName}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(therapist.status)}`}>
                {therapist.status.charAt(0).toUpperCase() + therapist.status.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getVerificationColor(therapist.verificationStatus)}`}>
                {therapist.verificationStatus.charAt(0).toUpperCase() + therapist.verificationStatus.slice(1)}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {therapist.credentials.join(', ')} • {therapist.yearsOfExperience} years experience
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{therapist.email}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                {therapist.phone}
              </div>
              {therapist.practiceAddress && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  {therapist.practiceAddress.city}, {therapist.practiceAddress.state}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 flex-shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{therapist.totalSessions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{therapist.totalClients}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
                {therapist.averageRating}
                <StarIcon className="w-5 h-5 text-yellow-400 ml-1" />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <nav className="flex -mb-px space-x-8 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2
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

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Professional Bio</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{therapist.bio}</p>
            </div>

            {/* Specializations */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {therapist.specializations.map(spec => (
                  <span
                    key={spec}
                    className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {therapist.languages.map(lang => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center gap-1"
                  >
                    <LanguageIcon className="w-4 h-4" />
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Session Rate</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(therapist.sessionRate.individual)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Insurance</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {therapist.acceptsInsurance ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Online Therapy</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {therapist.offersOnlineTherapy ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">In-Person</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {therapist.offersInPersonTherapy ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Professional Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-6">
            {/* Education */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Education</h3>
              <div className="space-y-4">
                {therapist.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AcademicCapIcon className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{edu.degree}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Class of {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* License Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">License Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">License Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{therapist.licenseNumber}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Issuing Board</p>
                  <p className="font-medium text-gray-900 dark:text-white">{therapist.licenseIssuingBoard}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(therapist.licenseExpiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Credentials</h3>
              <div className="flex flex-wrap gap-2">
                {therapist.credentials.map(cred => (
                  <span
                    key={cred}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium"
                  >
                    {cred}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            {/* Practice Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Practice Information</h3>
              {therapist.practiceName && (
                <p className="text-gray-900 dark:text-white font-medium mb-2">{therapist.practiceName}</p>
              )}
              
              {therapist.practiceAddress && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {therapist.practiceAddress.street}<br />
                    {therapist.practiceAddress.city}, {therapist.practiceAddress.state} {therapist.practiceAddress.zipCode}<br />
                    {therapist.practiceAddress.country}
                  </p>
                </div>
              )}
            </div>

            {/* Session Types & Rates */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Session Types & Rates</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(therapist.sessionTypes).map(([type, enabled]) => {
                  if (!enabled) return null
                  return (
                    <div key={type} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{type}</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(therapist.sessionRate[type as keyof typeof therapist.sessionRate])}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Insurance */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Insurance</h3>
              {therapist.acceptsInsurance ? (
                <div className="space-y-3">
                  <p className="text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5" />
                    Accepts Insurance
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {therapist.insuranceProviders.map(provider => (
                      <span
                        key={provider}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Does not accept insurance</p>
              )}
            </div>

            {/* Sliding Scale */}
            {therapist.slidingScale && therapist.slidingScaleRange && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Sliding Scale</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  ${therapist.slidingScaleRange.min} - ${therapist.slidingScaleRange.max} per session
                </p>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="text-center py-8">
            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Schedule management coming soon</p>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="text-center py-8">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Client list coming soon</p>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="text-center py-8">
            <StarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Reviews coming soon</p>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">License Certificate</p>
                  <p className="text-sm text-gray-500">Uploaded on Jan 15, 2024</p>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Professional Liability Insurance</p>
                  <p className="text-sm text-gray-500">Uploaded on Jan 15, 2024</p>
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">CV/Resume</p>
                  <p className="text-sm text-gray-500">Uploaded on Jan 15, 2024</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact Section */}
      {therapist.emergencyContact && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{therapist.emergencyContact.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Relationship</p>
              <p className="font-medium text-gray-900 dark:text-white">{therapist.emergencyContact.relationship}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="font-medium text-gray-900 dark:text-white">{therapist.emergencyContact.phone}</p>
            </div>
            {therapist.emergencyContact.email && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{therapist.emergencyContact.email}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}