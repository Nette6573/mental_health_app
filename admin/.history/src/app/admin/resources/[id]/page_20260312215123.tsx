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
  StarIcon,
  ChartBarIcon,
  DownloadIcon,
  PrinterIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { MOCK_RESOURCES, RESOURCE_TYPES, RESOURCE_CATEGORIES } from '@/constants/resources'

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

export default function ResourceViewPage() {
  const router = useRouter()
  const params = useParams()
  const [resource, setResource] = useState<Resource | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('content')
  const [showShareModal, setShowShareModal] = useState(false)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [relatedResources, setRelatedResources] = useState<Resource[]>([])

  useEffect(() => {
    const fetchResource = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const found = MOCK_RESOURCES.find(r => r.id === params.id)
        
        if (found) {
          setResource(found)
          
          // Find related resources (same category or similar tags)
          const related = MOCK_RESOURCES
            .filter(r => r.id !== found.id && (
              r.category === found.category ||
              r.tags.some(tag => found.tags.includes(tag))
            ))
            .slice(0, 3)
          setRelatedResources(related)
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

  const getTypeIcon = (type: string) => {
    const found = RESOURCE_TYPES.find(t => t.value === type)
    return found ? found.icon : '📄'
  }

  const getTypeColor = (type: string) => {
    const found = RESOURCE_TYPES.find(t => t.value === type)
    return found ? found.color : 'gray'
  }

  const getCategoryName = (slug: string) => {
    const found = RESOURCE_CATEGORIES.find(c => c.slug === slug)
    return found ? found.name : slug
  }

  const getCategoryIcon = (slug: string) => {
    const found = RESOURCE_CATEGORIES.find(c => c.slug === slug)
    return found ? found.icon : '📁'
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleLike = () => {
    setLiked(!liked)
    // In a real app, you'd call an API to update likes
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    // In a real app, you'd call an API to save bookmark
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleDownload = () => {
    if (resource?.fileUrl) {
      window.open(resource.fileUrl, '_blank')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading resource...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Please wait while we fetch the content</p>
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XMarkIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {error || 'Resource Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The resource you're looking for doesn't exist or has been removed. It might have been archived or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors inline-flex items-center justify-center"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Go Back
            </button>
            <Link
              href="/admin/resources"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center justify-center"
            >
              Browse Resources
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'content', name: 'Content', icon: DocumentTextIcon },
    { id: 'details', name: 'Details', icon: ChartBarIcon },
    { id: 'comments', name: 'Comments', icon: TagIcon },
    { id: 'history', name: 'History', icon: ClockIcon },
  ]

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Go back"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/admin/resources" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Resources
              </Link>
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
                {resource.title}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* View Stats */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{resource.views.toLocaleString()}</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-1">
                <HeartIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{resource.likes}</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-1">
                <ShareIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{resource.shares}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg transition-colors ${
                liked 
                  ? 'bg-red-50 text-red-500 dark:bg-red-900/20' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <HeartIcon className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked 
                  ? 'bg-yellow-50 text-yellow-500 dark:bg-yellow-900/20' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <BookmarkIcon className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Share"
            >
              <ShareIcon className="w-5 h-5" />
            </button>

            {resource.fileUrl && (
              <button
                onClick={handleDownload}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Download"
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={handlePrint}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 print:hidden"
              title="Print"
            >
              <PrinterIcon className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

            <Link
              href={`/admin/resources/${resource.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden print:shadow-none">
        {resource.coverImage ? (
          <div className="relative h-80 w-full">
            <Image
              src={resource.coverImage}
              alt={resource.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{getTypeIcon(resource.type)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getTypeColor(resource.type)}-500/20 backdrop-blur-sm`}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(resource.status)}`}>
                  {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                </span>
                {resource.featured && (
                  <span className="px-3 py-1 bg-yellow-500/20 backdrop-blur-sm text-yellow-300 rounded-full text-sm flex items-center">
                    <StarIconSolid className="w-4 h-4 mr-1" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-3">{resource.title}</h1>
              <p className="text-lg text-white/90 max-w-3xl">{resource.description}</p>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-white/80">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {resource.author}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Published {formatDate(resource.publishedAt || resource.createdAt)}
                </div>
                {resource.duration && (
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {formatDuration(resource.duration)}
                  </div>
                )}
                {resource.pages && (
                  <div className="flex items-center">
                    <BookOpenIcon className="w-4 h-4 mr-2" />
                    {resource.pages} pages
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-64 bg-gradient-to-r from-primary-600 to-primary-800 flex items-end">
            <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-center">
              {getTypeIcon(resource.type)}
            </div>
            <div className="relative p-8 text-white w-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{getTypeIcon(resource.type)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getTypeColor(resource.type)}-500/20 backdrop-blur-sm`}>
                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(resource.status)}`}>
                  {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                </span>
                {resource.featured && (
                  <span className="px-3 py-1 bg-yellow-500/20 backdrop-blur-sm text-yellow-300 rounded-full text-sm flex items-center">
                    <StarIconSolid className="w-4 h-4 mr-1" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-3">{resource.title}</h1>
              <p className="text-lg text-white/90 max-w-3xl">{resource.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-white/80">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {resource.author}
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Published {formatDate(resource.publishedAt || resource.createdAt)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:grid-cols-1">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          {/* Category Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">CATEGORY</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon(resource.category)}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {getCategoryName(resource.category)}
              </span>
            </div>
          </div>

          {/* Tags Card */}
          {resource.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map(tag => (
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

          {/* Type-specific Details */}
          {(resource.type === 'book' || resource.type === 'video' || resource.type === 'audio' || resource.type === 'podcast') && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">DETAILS</h3>
              <div className="space-y-3">
                {resource.type === 'book' && (
                  <>
                    {resource.publisher && (
                      <div>
                        <span className="text-xs text-gray-500">Publisher</span>
                        <p className="font-medium">{resource.publisher}</p>
                      </div>
                    )}
                    {resource.isbn && (
                      <div>
                        <span className="text-xs text-gray-500">ISBN</span>
                        <p className="font-medium font-mono">{resource.isbn}</p>
                      </div>
                    )}
                    {resource.publicationDate && (
                      <div>
                        <span className="text-xs text-gray-500">Published</span>
                        <p className="font-medium">{formatDate(resource.publicationDate)}</p>
                      </div>
                    )}
                  </>
                )}
                {(resource.type === 'video' || resource.type === 'audio' || resource.type === 'podcast') && resource.duration && (
                  <div>
                    <span className="text-xs text-gray-500">Duration</span>
                    <p className="font-medium">{formatDuration(resource.duration)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File/External Links */}
          {(resource.fileUrl || resource.externalUrl) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">LINKS</h3>
              <div className="space-y-2">
                {resource.fileUrl && (
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <DocumentTextIcon className="w-5 h-5 text-primary-500" />
                    <span className="flex-1 text-sm truncate">Download File</span>
                    <DownloadIcon className="w-4 h-4 text-gray-400" />
                  </a>
                )}
                {resource.externalUrl && (
                  <a
                    href={resource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <LinkIcon className="w-5 h-5 text-primary-500" />
                    <span className="flex-1 text-sm truncate">External Link</span>
                    <ShareIcon className="w-4 h-4 text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          {resource.metadata && Object.keys(resource.metadata).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">METADATA</h3>
              <div className="space-y-2">
                {Object.entries(resource.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">RELATED</h3>
              <div className="space-y-3">
                {relatedResources.map(related => (
                  <Link
                    key={related.id}
                    href={`/admin/resources/${related.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xl">
                      {getTypeIcon(related.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {related.title}
                      </p>
                      <p className="text-xs text-gray-500">{related.views.toLocaleString()} views</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden print:hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2
                        ${activeTab === tab.id
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 print:p-4">
              {/* Audio/Video Player */}
              {(resource.type === 'audio' || resource.type === 'podcast') && resource.fileUrl && (
                <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <audio controls className="w-full">
                    <source src={resource.fileUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {resource.type === 'video' && resource.fileUrl && (
                <div className="mb-8 aspect-video bg-black rounded-lg overflow-hidden">
                  <video controls className="w-full h-full">
                    <source src={resource.fileUrl} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              )}

              {/* Main Content */}
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: resource.content }} />
              </div>

              {/* Publication Info */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Created: {formatDate(resource.createdAt)}</span>
                    {resource.updatedAt !== resource.createdAt && (
                      <span>Updated: {formatDate(resource.updatedAt)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Last verified: {formatDate(resource.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Resource Details</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Resource ID</p>
                    <p className="font-mono text-sm">{resource.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="capitalize">{resource.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p>{getCategoryName(resource.category)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p>{resource.author}</p>
                  </div>
                  {resource.authorId && (
                    <div>
                      <p className="text-sm text-gray-500">Author ID</p>
                      <p className="font-mono text-sm">{resource.authorId}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Featured</p>
                    <p>{resource.featured ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="font-medium">{resource.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Engagement</p>
                    <p>{resource.likes} likes · {resource.shares} shares</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {resource.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-center py-12">
                <TagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Comments Coming Soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  The comments feature is under development.
                </p>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Version History</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Published</p>
                    <p className="text-sm text-gray-500">by System · {formatDate(resource.publishedAt || resource.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <PencilIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-gray-500">by System · {formatDate(resource.updatedAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-gray-500">by System · {formatDate(resource.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto print:hidden">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setShowShareModal(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Resource</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/admin/resources/${resource.id}`}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/admin/resources/${resource.id}`)
                        alert('Link copied to clipboard!')
                      }}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    F
                  </button>
                  <button className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                    T
                  </button>
                  <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    W
                  </button>
                  <button className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    L
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}