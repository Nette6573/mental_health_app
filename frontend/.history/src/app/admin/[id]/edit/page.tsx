'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import ResourceForm from '@/components/resources/ResourceForm'
import { MOCK_RESOURCES } from '@/constants/resources'

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams()
  const [resource, setResource] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const found = MOCK_RESOURCES.find(r => r.id === params.id)
      setResource(found)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleSubmit = async (formData: any) => {
    console.log('Updating resource:', formData)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push(`/admin/resources/${params.id}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading resource data...</p>
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Resource not found</p>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title="Edit Resource"
        subtitle={`Editing: ${resource.title}`}
      />

      <div className="mt-6">
        <ResourceForm 
          initialData={resource}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/admin/resources/${params.id}`)}
        />
      </div>
    </>
  )
}