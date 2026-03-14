'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/shared/PageHeader'
import ResourceGrid from '@/components/resources/ResourceGrid'
import ResourceFilters from '@/components/resources/ResourceFilters'
import ResourceStats from '@/components/resources/ResourceStats'
import { 
  PlusIcon, 
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from '@heroicons/react/24/outline'
import { MOCK_RESOURCES, RESOURCE_TYPES, RESOURCE_CATEGORIES } from '@/constants/resources'

export default function ResourcesPage() {
  const [resources, setResources] = useState(MOCK_RESOURCES)
  const [filteredResources, setFilteredResources] = useState(MOCK_RESOURCES)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    search: '',
    featured: '',
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = [...resources]

    // Apply search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower) ||
        r.author.toLowerCase().includes(searchLower) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type)
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category)
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status)
    }

    // Apply featured filter
    if (filters.featured) {
      filtered = filtered.filter(r => r.featured === (filters.featured === 'true'))
    }

    setFilteredResources(filtered)
  }, [filters, resources])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id))
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, status: newStatus as any } : r
    ))
  }

  const handleFeaturedToggle = (id: string) => {
    setResources(resources.map(r => 
      r.id === id ? { ...r, featured: !r.featured } : r
    ))
  }

  const handleDuplicate = (id: string) => {
    const resourceToDuplicate = resources.find(r => r.id === id)
    if (resourceToDuplicate) {
      const newResource = {
        ...resourceToDuplicate,
        id: `new-${Date.now()}`,
        title: `${resourceToDuplicate.title} (Copy)`,
        status: 'draft' as const,
        views: 0,
        likes: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setResources([...resources, newResource])
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader 
        title="Resources Library"
        subtitle="Manage all your mental health resources - books, podcasts, videos, and more"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/resources/new"
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Resource
          </Link>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <ResourceStats resources={resources} />

      {/* Search and Filters */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources by title, description, author, or tags..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filters
              {Object.values(filters).some(v => v && v !== '') && (
                <span className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(v => v && v !== '').length}
                </span>
              )}
            </button>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4">
            <ResourceFilters filters={filters} setFilters={setFilters} />
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredResources.length} of {resources.length} resources
      </div>

      {/* Resources Display */}
      <div className="mt-4">
        <ResourceGrid 
          resources={filteredResources}
          viewMode={viewMode}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onFeaturedToggle={handleFeaturedToggle}
          onDuplicate={handleDuplicate}
        />
      </div>
    </>
  )
}