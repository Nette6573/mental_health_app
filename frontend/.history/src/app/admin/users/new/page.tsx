'use client'

import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import UserForm from '@/components/users/UserForm'

export default function NewUserPage() {
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    console.log('Creating user:', formData)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/admin/users')
  }

  return (
    <>
      <PageHeader 
        title="Add New User"
        subtitle="Create a new user account"
      />

      <div className="mt-6">
        <UserForm 
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/users')}
        />
      </div>
    </>
  )
}