'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import TherapistForm from '@/components/therapists/TherapistForm'

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
  emergencyContact: {
    name: 'Michael Johnson',
    relationship: 'Spouse',
    phone: '+1-876-555-0199',
    email: 'michael.johnson@email.com',
  },
}

export default function EditTherapistPage() {
  const router = useRouter()
  const params = useParams()
  const [therapist, setTherapist] = useState<Therapist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTherapist(MOCK_THERAPIST)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleSubmit = async (formData: Therapist) => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Updated therapist:', formData)
    setIsSaving(false)
    router.push(`/admin/therapists/${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading therapist data...</p>
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

  return (
    <>
      <PageHeader 
        title={`Edit Dr. ${therapist.firstName} ${therapist.lastName}`}
        subtitle="Update therapist information and credentials"
      />

      <div className="mt-6">
        <TherapistForm 
          initialData={therapist}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/admin/therapists/${params.id}`)}
          isSaving={isSaving}
        />
      </div>
    </>
  )
}