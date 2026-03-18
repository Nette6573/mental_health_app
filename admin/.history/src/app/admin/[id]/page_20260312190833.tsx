'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeftIcon,
  PencilIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ClockIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PlayIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { MOCK_RESOURCES, RESOURCE_TYPES } from '@/constants/resources'

export default function ResourceDetailsPage() {
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

  const getTypeIcon = (type: string) => {
    const found = RESOURCE_TYPES.find(t => t.value === type)
    return found ? found.icon : '📄'
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'archived':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}min`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading resource details...</p>
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
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Resources
        </button>
        <Link
          href={`/admin/resources/${resource.id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PencilIcon className="w-5 h-5 mr-2" />
          Edit Resource
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="relative h-64 bg-gradient-to-r from-primary-500 to-primary-600">
          {resource.coverImage ? (
            <Image
              src={resource.coverImage}
              alt={resource.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-20">{getTypeIcon(resource.type)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(resource.status)}`}>
                  {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                </span>
                {resource.featured && (
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
              <p className="text-white/80 max-w-3xl">{resource.description}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <EyeIcon className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{resource.views.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Views</p>
          </div>
          <div className="text-center">
            <HeartIcon className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{resource.likes}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Likes</p>
          </div>
          <div className="text-center">
            <ShareIcon className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{resource.shares}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Shares</p>
          </div>
          <div className="text-center">
            <CalendarIcon className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Date(resource.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Content</h2>
                <div className="prose dark:prose-invert max-w-none">
                  {resource.content}
                </div>
              </div>

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-6">
              {/* Author Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Author
                </h3>
                <p className="text-gray-900 dark:text-white">{resource.author}</p>
              </div>

              {/* Category */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium mb-3 flex items-center">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Category
                </h3>
                <p className="text-gray-900 dark:text-white capitalize">
                  {resource.category.replace('-', ' ')}
                </p>
              </div>

              {/* Type-specific details */}
              {(resource.type === 'video' || resource.type === 'audio' || resource.type === 'podcast') && resource.duration && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    Duration
                  </h3>
                  <p className="text-gray-900 dark:text-white">{formatDuration(resource.duration)}</p>
                </div>
              )}

              {resource.type === 'book' && (
                <>
                  {resource.pages && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <BookOpenIcon className="w-5 h-5 mr-2" />
                        Pages
                      </h3>
                      <p className="text-gray-900 dark:text-white">{resource.pages} pages</p>
                    </div>
                  )}
                  {resource.publisher && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Publisher</h3>
                      <p className="text-gray-900 dark:text-white">{resource.publisher}</p>
                    </div>
                  )}
                  {resource.isbn && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">ISBN</h3>
                      <p className="text-gray-900 dark:text-white">{resource.isbn}</p>
                    </div>
                  )}
                </>
              )}

              {/* File/External Link */}
              {resource.fileUrl && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    File
                  </h3>
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 break-all"
                  >
                    {resource.fileUrl}
                  </a>
                </div>
              )}

              {resource.externalUrl && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items