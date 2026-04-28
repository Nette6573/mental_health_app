'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import TherapistApplications from '@/components/therapists/TherapistApplications'
import { MOCK_APPLICATIONS } from '@/constants/therapists'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setApplications(MOCK_APPLICATIONS)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleApprove = async (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'approved' } : app
    ))
  }

  const handleReject = async (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'rejected' } : app
    ))
  }

  const handleReview = async (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'under-review' } : app
    ))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title="Therapist Applications"
        subtitle="Review and manage therapist applications"
      />

      <div className="mt-6">
        <TherapistApplications 
          applications={applications}
          onApprove={handleApprove}
          onReject={handleReject}
          onReview={handleReview}
        />
      </div>
    </>
  )
}