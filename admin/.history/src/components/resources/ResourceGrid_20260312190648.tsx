'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon as StarIconSolid,
  DocumentDuplicateIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
} from '@heroicons/react/24/solid'
import {
  StarIcon as StarIconOutline,
  PlayIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  BookOpenIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { RESOURCE_TYPES } from '@/constants/resources'

interface Resource {
  id: string
  title: string
  description: string
  type: string
  category: string
  author: string
  status: string
  views: number
  likes: number
  shares: number
  featured: boolean
  thumbnail?: string
  duration?: number
  pages?: number
  createdAt: string
  tags: string[]
}

interface ResourceGridProps {
  resources: Resource[]
  viewMode: 'grid' | 'list'
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: string) => void
  onFeaturedToggle: (id: string) => void
  onDuplicate: (id: string) => void
}

export default function ResourceGrid({
  resources,
  viewMode,
  onDelete,
  onStatusChange,
  onFeaturedToggle,
  onDuplicate,
}: ResourceGridProps) {
  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelectedResources(prev =>
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedResources.length === resources.length) {
      setSelectedResources([])
    } else {
      setSelectedResources(resources.map(r => r.id))
    }
  }

  const getTypeIcon = (type: string) => {
    const found = RESOURCE_TYPES.find(t => t.value === type)
    return found ? found.icon : '📄'
  }

  const getTypeColor = (type: string) => {
    const found = RESOURCE_TYPES.find(t => t.value === type)
    return found ? found.color : 'gray'
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

  if (viewMode === 'grid') {
    return (
      <div className="space-y-4">
        {selectedResources.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {selectedResources.length} resource(s) selected
            </span>
            <button
              onClick={() => {
                if (confirm(`Delete ${selectedResources.length} resources?`)) {
                  selectedResources.forEach(id => onDelete(id))
                  setSelectedResources([])
                }
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Selected
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <Link href={`/admin/resources/${resource.id}`} className="block relative aspect-video bg-gray-100 dark:bg-gray-700">
                {resource.thumbnail ? (
                  <Image
                    src={resource.thumbnail}
                    alt={resource.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {getTypeIcon(resource.type)}
                  </div>
                )}
                
                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getTypeColor(resource.type)}-100 text-${getTypeColor(resource.type)}-800 dark:bg-${getTypeColor(resource.type)}-900/20 dark:text-${getTypeColor(resource.type)}-400`}>
                    {getTypeIcon(resource.type)} {resource.type}
                  </span>
                </div>

                {/* Featured Badge */}
                {resource.featured && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <StarIconSolid className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="checkbox"
                    checked={selectedResources.includes(resource.id)}
                    onChange={() => toggleSelect(resource.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/admin/resources/${resource.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400">
                    {resource.title}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {resource.description}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center">
                    <UserIcon className="w-3 h-3 mr-1" />
                    {resource.author}
                  </span>
                  <span className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                  {resource.duration && (
                    <span className="flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {formatDuration(resource.duration)}
                    </span>
                  )}
                  {resource.pages && (
                    <span className="flex items-center">
                      <BookOpenIcon className="w-3 h-3 mr-1" />
                      {resource.pages} pages
                    </span>
                  )}
                </div>

                {/* Tags */}
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{resource.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>👁️ {resource.views.toLocaleString()}</span>
                  <span>❤️ {resource.likes}</span>
                  <span>🔄 {resource.shares}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <select
                    value={resource.status}
                    onChange={(e) => onStatusChange(resource.id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-2 py-1 border-0 ${getStatusColor(resource.status)}`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onFeaturedToggle(resource.id)}
                      className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                      title={resource.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {resource.featured ? (
                        <StarIconSolid className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <StarIconOutline className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`/admin/resources/${resource.id}`}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/resources/${resource.id}/edit`}
                      className="p-1 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDuplicate(resource.id)}
                      className="p-1 text-green-400 hover:text-green-600 dark:hover:text-green-300"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(resource.id)}
                      className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No resources found</p>
          </div>
        )}
      </div>
    )
  }

  // List View
  return (
    <div className="space-y-4">
      {selectedResources.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {selectedResources.length} resource(s) selected
          </span>
          <button
            onClick={() => {
              if (confirm(`Delete ${selectedResources.length} resources?`)) {
                selectedResources.forEach(id => onDelete(id))
                setSelectedResources([])
              }
            }}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedResources.length === resources.length && resources.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedResources.includes(resource.id)}
                    onChange={() => toggleSelect(resource.id)}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/resources/${resource.id}`} className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mr-3 text-xl">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {resource.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {resource.description}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getTypeColor(resource.type)}-100 text-${getTypeColor(resource.type)}-800`}>
                    {getTypeIcon(resource.type)} {resource.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {resource.author}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={resource.status}
                    onChange={(e) => onStatusChange(resource.id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${getStatusColor(resource.status)}`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {resource.views.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onFeaturedToggle(resource.id)}
                    className="focus:outline-none"
                  >
                    {resource.featured ? (
                      <StarIconSolid className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <StarIconOutline className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/resources/${resource.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/resources/${resource.id}/edit`}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => onDuplicate(resource.id)}
                      className="text-green-400 hover:text-green-600"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(resource.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No resources found</p>
          </div>
        )}
      </div>
    </div>
  )
}