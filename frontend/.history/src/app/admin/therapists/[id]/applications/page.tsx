'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline'
import PageHeader from '@/components/shared/PageHeader'

interface ApplicationDetails {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  credentials: string[]
  specializations: string[]
  licenseNumber: string
  licenseImage?: string
  resume?: string
  applicationDate: string
  status: 'pending' | 'under-review' | 'approved' | 'rejected'
  education: {
    degree: string
    institution: string
    year: number
  }[]
  experience: {
    position: string
    organization: string
    startDate: string
    endDate?: string
    current: boolean
  }[]
  references: {
    name: string
    title: string
    organization: string
    email: string
    phone: string
  }[]
  notes?: string
}

const MOCK_APPLICATION: ApplicationDetails = {
  id: 'app1',
  firstName: 'David',
  lastName: 'Chen',
  email: 'david.chen@example.com',
  phone: '+1-876-555-0104',
  credentials: ['PhD', 'LPCC'],
  specializations: ['Addiction', 'OCD', 'Bipolar Disorder'],
  licenseNumber: 'LPCC-98765',
  applicationDate: '2025-02-28',
  status: 'pending',
  education: [
    {
      degree: 'PhD in Clinical Psychology',
      institution: 'Loma Linda University',
      year: 2008,
    },
    {
      degree: 'MA in Counseling',
      institution: 'Andrews University',
      year: 2004,
    },
  ],
  experience: [
    {
      position: 'Clinical Psychologist',
      organization: 'HopePath Counseling Center',
      startDate: '2020-01',
      current: true,
    },
    {
      position: 'Associate Therapist',
      organization: 'Wellness Institute',
      startDate: '2015-06',
      endDate: '2019-12',
      current: false,
    },
  ],
  references: [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Clinical Director',
      organization: 'HopePath',
      email: 'sarah.johnson@hopepath.org',
      phone: '+1-876-555-0101',
    },
  ],
}

export default function ApplicationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [application, setApplication] = useState<ApplicationDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reviewNotes, setReviewNotes] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setApplication(MOCK_APPLICATION)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'under-review': return 'bg-blue-100 text-blue-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleApprove = async () => {
    if (!reviewNotes.trim()) {
      alert('Please add review notes before approving')
      return
    }
    // API call to approve
    router.push('/admin/therapists/applications')
  }

  const handleReject = async () => {
    if (!reviewNotes.trim()) {
      alert('Please add review notes before rejecting')
      return
    }
    // API call to reject
    router.push('/admin/therapists/applications')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading application...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Application not found</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Applications
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReject}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            <XCircleIcon className="w-5 h-5 inline mr-2" />
            Reject
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <CheckCircleIcon className="w-5 h-5 inline mr-2" />
            Approve
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{application.firstName} {application.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{application.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{application.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Applied Date</p>
                <p className="font-medium">{new Date(application.applicationDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5" />
              Professional Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Credentials</p>
                <div className="flex flex-wrap gap-2">
                  {application.credentials.map(cred => (
                    <span key={cred} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {cred}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {application.specializations.map(spec => (
                    <span key={spec} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="font-medium">{application.licenseNumber}</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5" />
              Education
            </h2>
            <div className="space-y-4">
              {application.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary-500 pl-4">
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Experience</h2>
            <div className="space-y-4">
              {application.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-green-500 pl-4">
                  <p className="font-medium">{exp.position}</p>
                  <p className="text-sm text-gray-600">{exp.organization}</p>
                  <p className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* References */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">References</h2>
            <div className="space-y-4">
              {application.references.map((ref, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="font-medium">{ref.name}</p>
                  <p className="text-sm text-gray-600">{ref.title} at {ref.organization}</p>
                  <p className="text-sm text-gray-500">{ref.email} • {ref.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Application Status</h3>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Documents</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-left">License Document.pdf</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                <span className="flex-1 text-left">Resume.pdf</span>
              </button>
            </div>
          </div>

          {/* Review Notes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Review Notes</h3>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add notes about this application..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Schedule Interview
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Request More Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}