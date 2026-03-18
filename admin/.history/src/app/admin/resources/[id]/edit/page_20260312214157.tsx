'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/shared/PageHeader'
import ResourceForm from '@/components/resources/ResourceForm'
import { MOCK_RESOURCES } from '@/constants/resources'
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface Resource {
  id: string
  title: string
  description: string
  content: string
  type: 'article' | 'video' | 'audio' | 'podcast' | 'book' | 'guide' | 'worksheet' | 'external'
  category: string
  tags: string[]
  author: string
  authorId: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views: number
  likes: number
  shares: number
  thumbnail?: string
  coverImage?: string
  fileUrl?: string
  externalUrl?: string
  duration?: number
  pages?: number
  publisher?: string
  isbn?: string
  publicationDate?: string
  createdAt: string
  publishedAt?: string
  updatedAt: string
  metadata?: Record<string, any>
}

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams()
  const [resource, setResource] = useState<Resource | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const fetchResource = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const found = MOCK_RESOURCES.find(r => r.id === params.id)
        
        if (found) {
          setResource(found)
        } else {
          setError('Resource not found')
        }
      } catch (err) {
        setError('Failed to load resource')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResource()
  }, [params.id])

  const handleSubmit = async (formData: any) => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Updating resource:', {
        ...formData,
        id: params.id,
        updatedAt: new Date().toISOString(),
      })
      
      // Show success message (you could add a toast notification here)
      alert('Resource updated successfully!')
      
      // Redirect to resource details page
      router.push(`/admin/resources/${params.id}`)
    } catch (err) {
      alert('Failed to update resource. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Deleting resource:', params.id)
      
      // Show success message
      alert('Resource deleted successfully!')
      
      // Redirect to resources list
      router.push('/admin/resources')
    } catch (err) {
      alert('Failed to delete resource. Please try again.')
    }
  }

  const handlePublish = async () => {
    if (!resource) return
    
    setIsSaving(true)
    try {
      // Update resource status to published
      const updatedResource = {
        ...resource,
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Publishing resource:', updatedResource)
      setResource(updatedResource)
      
      alert('Resource published successfully!')
    } catch (err) {
      alert('Failed to publish resource. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchive = async () => {
    if (!resource) return
    
    setIsSaving(true)
    try {
      // Update resource status to archived
      const updatedResource = {
        ...resource,
        status: 'archived' as const,
        updatedAt: new Date().toISOString(),
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Archiving resource:', updatedResource)
      setResource(updatedResource)
      
      alert('Resource archived successfully!')
    } catch (err) {
      alert('Failed to archive resource. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading resource...</p>
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Resource Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/admin/resources')}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Resources
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Resource
          </button>

          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${resource.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
              ${resource.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
              ${resource.status === 'archived' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : ''}
            `}>
              {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
            </span>

            {/* Quick Actions */}
            {resource.status === 'draft' && (
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>Publish</span>
                  </>
                )}
              </button>
            )}

            {resource.status === 'published' && (
              <button
                onClick={handleArchive}
                disabled={isSaving}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Archiving...</span>
                  </>
                ) : (
                  <>
                    <span>Archive</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Resource Info Bar */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Created</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(resource.createdAt).toLocaleDateString()}
              </p>
            </div>
            {resource.publishedAt && (
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Published</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(resource.publishedAt).toLocaleDateString()}
                </p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(resource.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Views</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {resource.views.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Likes</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {resource.likes}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Shares</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {resource.shares}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PageHeader 
        title="Edit Resource"
        subtitle={`Editing: ${resource.title}`}
      />

      <div className="mt-6">
        <ResourceForm 
          initialData={resource}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/admin/resources/${params.id}`)}
          isSaving={isSaving}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setShowDeleteModal(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Resource
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}