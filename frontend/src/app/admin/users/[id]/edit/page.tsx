'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import UserForm from '@/components/users/UserForm'

interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'user' | 'premium' | 'counselor'
  status: 'active' | 'inactive' | 'suspended'
  dateOfBirth: string
  address: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  preferences: {
    newsletter: boolean
    notifications: boolean
    twoFactor: boolean
  }
}

const MOCK_USER: UserFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1-876-555-0123',
  role: 'premium',
  status: 'active',
  dateOfBirth: '1990-05-15',
  address: '123 Main St, Kingston, Jamaica',
  emergencyContact: {
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+1-876-555-0124',
  },
  preferences: {
    newsletter: true,
    notifications: true,
    twoFactor: false,
  },
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<UserFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser(MOCK_USER)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleSubmit = async (formData: UserFormData) => {
    console.log('Updating user:', formData)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push(`/admin/users/${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title="Edit User"
        subtitle={`Editing ${user?.firstName} ${user?.lastName}`}
      />

      <div className="mt-6">
        <UserForm 
          initialData={user!}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/admin/users/${params.id}`)}
        />
      </div>
    </>
  )
}