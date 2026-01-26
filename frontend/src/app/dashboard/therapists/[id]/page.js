'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import TherapistProfile from '@/components/dashboard/therapists/TherapistProfile'

// Mock data - replace with API call
const getTherapistById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const therapists = {
    1: {
      id: 1,
      name: 'Dr. Sarah Johnson',
      title: 'Clinical Psychologist',
      specialty: ['anxiety', 'depression', 'cbt', 'faith'],
      location: 'kingston',
      online: true,
      available: true,
      image: '/images/therapists/dr-johnson.jpg',
      rating: 4.9,
      reviews: 156,
      experience: '12 years',
      languages: ['English', 'Spanish'],
      bio: 'Specialized in cognitive behavioral therapy with a focus on anxiety disorders and depression. Integrates faith-based approaches when requested.',
      availability: 'Accepting new patients',
      faithBased: true,
      price: '$120/session',
      insurance: ['Blue Cross', 'Aetna', 'Sagicor'],
      education: [
        'PhD in Clinical Psychology, University of the West Indies',
        'MA in Counseling Psychology, Northern Caribbean University',
        'BA in Psychology, University of Technology, Jamaica'
      ],
      certifications: [
        'Licensed Clinical Psychologist (Jamaica)',
        'Certified Cognitive Behavioral Therapist',
        'Faith-Based Counseling Certification'
      ],
      approach: 'I believe in a collaborative approach to therapy, combining evidence-based techniques with compassionate care. My practice integrates Cognitive Behavioral Therapy (CBT) with faith-based principles when appropriate, helping clients develop practical skills while exploring spiritual dimensions of healing.',
      treatmentPhilosophy: 'I view mental health as an integral part of overall well-being. My approach is holistic, addressing mind, body, and spirit. I create a safe, non-judgmental space where clients can explore their challenges and discover their strengths.',
      specializations: [
        'Anxiety Disorders (Generalized Anxiety, Panic, Social Anxiety)',
        'Depression and Mood Disorders',
        'Faith and Spirituality in Mental Health',
        'Stress Management and Coping Skills',
        'Relationship and Family Issues',
        'Trauma and PTSD'
      ],
      sessionDetails: {
        duration: '50-60 minutes',
        format: 'In-person or Online',
        frequency: 'Weekly or bi-weekly',
        initialAssessment: '75 minutes ($150)'
      },
      acceptsInsurance: true,
      eveningHours: true,
      weekendHours: false,
      nextAvailable: 'Tomorrow at 2:00 PM'
    }
  }
  
  return therapists[id] || null
}

export default function TherapistProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [therapist, setTherapist] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        setIsLoading(true)
        const therapistData = await getTherapistById(params.id)
        if (therapistData) {
          setTherapist(therapistData)
        } else {
          setError('Therapist not found')
        }
      } catch (err) {
        setError('Failed to load therapist profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTherapist()
  }, [params.id])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  if (error) {
    return (
      <DashboardLayout user={user}>
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error}</h2>
          <button
            onClick={() => router.push('/dashboard/therapists')}
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Back to Therapists
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-4"></div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-96"></div>
        </div>
      ) : (
        <TherapistProfile therapist={therapist} />
      )}
    </DashboardLayout>
  )
}