'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import TherapistProfile from '@/components/dashboard/therapists/TherapistProfile'

export default function TherapistProfilePageClient({ params }) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [therapist, setTherapist] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const therapistId = params?.id

  // ===============================
  // ✅ FETCH REAL THERAPIST
  // ===============================
  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        setIsLoading(true)

        const res = await fetch(`/api/therapists/${therapistId}`)
        const data = await res.json()

        if (data) {
          setTherapist(data)
        } else {
          setError('Therapist not found')
        }

      } catch (err) {
        console.error(err)
        setError('Failed to load therapist')
      } finally {
        setIsLoading(false)
      }
    }

    if (therapistId) {
      fetchTherapist()
    }
  }, [therapistId])

  // ===============================
  // ✅ START CHAT FROM PROFILE
  // ===============================
  const startChat = () => {
    localStorage.setItem('activeTherapist', therapistId)
    router.push('/dashboard/chat')
  }

  // ===============================
  // AUTH CHECK
  // ===============================
  if (authLoading) return <div>Loading...</div>

  if (!user) {
    router.push('/auth/login')
    return null
  }

  // ===============================
  // ERROR STATE
  // ===============================
  if (error) {
    return (
      <DashboardLayout user={user}>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold">{error}</h2>
          <button onClick={() => router.push('/dashboard/therapists')}>
            Back
          </button>
        </div>
      </DashboardLayout>
    )
  }

  // ===============================
  // UI
  // ===============================
  return (
    <DashboardLayout user={user}>
      {isLoading ? (
        <p>Loading therapist...</p>
      ) : (
        therapist && (
          <>
            <TherapistProfile therapist={therapist} />

            {/* ✅ CHAT BUTTON */}
            <div className="mt-6">
              <button
                onClick={startChat}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg"
              >
                Start Chat
              </button>
            </div>
          </>
        )
      )}
    </DashboardLayout>
  )
}