'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout'
import TherapistCard from '@/components/dashboard/therapists/TherapistCard'
import SpecialtyFilters from '@/components/dashboard/therapists/SpecialtyFilters'
import SearchBar from '@/components/dashboard/resources/SearchBar'

export default function TherapistsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [therapists, setTherapists] = useState([])
  const [filteredTherapists, setFilteredTherapists] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [sortBy, setSortBy] = useState('rating')

  // ===============================
  // ✅ FETCH REAL THERAPISTS
  // ===============================
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setIsLoading(true)

        const res = await fetch('/api/therapists')
        const data = await res.json()

        setTherapists(data)
        setFilteredTherapists(data)

      } catch (err) {
        console.error('Failed to fetch therapists:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTherapists()
  }, [])

  // ===============================
  // ✅ START CHAT
  // ===============================
  const startChat = (therapistId) => {
    localStorage.setItem('activeTherapist', therapistId)
    router.push('/dashboard/chat')
  }

  // ===============================
  // ✅ FILTER LOGIC (SAFE VERSION)
  // ===============================
  useEffect(() => {
    let filtered = therapists

    if (searchQuery) {
      filtered = filtered.filter(t =>
        (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.bio || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(t =>
        (t.specialization || []).includes(selectedSpecialty)
      )
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(t =>
        t.location === selectedLocation
      )
    }

    setFilteredTherapists(filtered)
  }, [searchQuery, selectedSpecialty, selectedLocation, therapists])

  // ===============================
  // AUTH CHECK
  // ===============================
  if (authLoading) {
    return <div className="p-10">Loading...</div>
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Find Your Therapist</h1>
          <p className="text-gray-600">
            Connect with real therapists on the platform
          </p>
        </div>

        {/* SEARCH */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search therapists..."
        />

        {/* CONTENT */}
        {isLoading ? (
          <p>Loading therapists...</p>
        ) : filteredTherapists.length === 0 ? (
          <p>No therapists found</p>
        ) : (
          <div className="space-y-4">
            {filteredTherapists.map((therapist) => (
              <TherapistCard
                key={therapist._id} // ✅ FIXED
                therapist={therapist}
                onChat={() => startChat(therapist._id)} // ✅ NEW
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}