'use client'

import { useRouter } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import ResourceForm from '@/components/resources/ResourceForm'

export default function NewResourcePage() {
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    console.log('Creating resource:', formData)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/admin/resources')
  }

  return (
    <>
      <PageHeader 
        title="Create New Resource"
        subtitle="Add a new resource to the library"
      />

      <div className="mt-6">
        <ResourceForm 
          onSubmit={handleSubmit}
          onCancel={() => router.push('/admin/resources')}
        />
      </div>
    </>
  )
}