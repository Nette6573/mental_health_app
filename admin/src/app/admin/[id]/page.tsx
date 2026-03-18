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
    setTimeout(() => {
      const found = MOCK_RESOURCES.find(r => r.id === params.id)
      setResource(found ?? null)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const getTypeIcon = (type: string) => {
    const found = RESOURCE_TYPES.find(t => t.value === type)
    return found ? found.icon : '📄'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
    <div>
      {/* Top bar */}
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

      {/* Hero */}
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
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="p-8 text-white">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                  {resource.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(resource.status)}`}>
                  {resource.status}
                </span>
                {resource.featured && (
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm flex items-center gap-1">
                    <StarIcon className="w-4 h-4" />
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
          {[
            { icon: EyeIcon,      label: 'Views',     value: resource.views?.toLocaleString() ?? '0' },
            { icon: HeartIcon,    label: 'Likes',     value: resource.likes ?? 0 },
            { icon: ShareIcon,    label: 'Shares',    value: resource.shares ?? 0 },
            { icon: CalendarIcon, label: 'Published', value: resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon className="w-5 h-5 mx-auto text-gray-400 mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Description, Content, Tags */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Description</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{resource.description}</p>
              </div>

              {resource.content && (
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Content</h2>
                  <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    {resource.content}
                  </div>
                </div>
              )}

              {resource.tags && resource.tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Tags</h2>
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

            {/* Right — Metadata */}
            <div className="space-y-4">

              {/* Author */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                  <UserIcon className="w-5 h-5" />
                  Author
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{resource.author ?? '—'}</p>
              </div>

              {/* Category */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                  <TagIcon className="w-5 h-5" />
                  Category
                </h3>
                <p className="text-gray-700 dark:text-gray-300 capitalize">
                  {resource.category?.replace('-', ' ') ?? '—'}
                </p>
              </div>

              {/* Duration */}
              {['video', 'audio', 'podcast'].includes(resource.type) && resource.duration && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                    <ClockIcon className="w-5 h-5" />
                    Duration
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{formatDuration(resource.duration)}</p>
                </div>
              )}

              {/* Book-specific */}
              {resource.type === 'book' && (
                <>
                  {resource.pages && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                        <BookOpenIcon className="w-5 h-5" />
                        Pages
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">{resource.pages} pages</p>
                    </div>
                  )}
                  {resource.publisher && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Publisher</h3>
                      <p className="text-gray-700 dark:text-gray-300">{resource.publisher}</p>
                    </div>
                  )}
                  {resource.isbn && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h3 className="font-medium mb-2 text-gray-900 dark:text-white">ISBN</h3>
                      <p className="text-gray-700 dark:text-gray-300">{resource.isbn}</p>
                    </div>
                  )}
                </>
              )}

              {/* File URL */}
              {resource.fileUrl && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                    <DocumentTextIcon className="w-5 h-5" />
                    File
                  </h3>
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 break-all text-sm"
                  >
                    {resource.fileUrl}
                  </a>
                </div>
              )}

              {/* External URL */}
              {resource.externalUrl && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                    <LinkIcon className="w-5 h-5" />
                    External Link
                  </h3>
                  <a
                    href={resource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 break-all text-sm"
                  >
                    {resource.externalUrl}
                  </a>
                </div>
              )}

              {/* Publication Date */}
              {resource.publicationDate && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                    <CalendarIcon className="w-5 h-5" />
                    Publication Date
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(resource.publicationDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Metadata */}
              {resource.metadata && Object.keys(resource.metadata).length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Additional Info</h3>
                  <div className="space-y-2">
                    {Object.entries(resource.metadata).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}: </span>
                        <span className="text-sm text-gray-900 dark:text-white">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}