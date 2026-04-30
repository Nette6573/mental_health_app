'use client'

import { useState, useEffect, useCallback } from 'react'
import ResourceCard from './ResourceCard'
import SearchBar from './SearchBar'
import ResourceFilter from './ResourceFilter'
import ResourceViewerModal from './ResourceViewerModal'

const categories = [
  { id: 'all', name: 'All Resources', count: 0 },
  { id: 'anxiety', name: 'Anxiety', count: 12 },
  { id: 'depression', name: 'Depression', count: 8 },
  { id: 'stress', name: 'Stress Management', count: 15 },
  { id: 'relationships', name: 'Relationships', count: 6 },
  { id: 'self-care', name: 'Self-Care', count: 10 },
  { id: 'faith', name: 'Faith & Spirituality', count: 7 },
  { id: 'crisis', name: 'Crisis Support', count: 5 }
]

const resourceTypes = [
  { id: 'all', name: 'All Types' },
  { id: 'article', name: 'Articles' },
  { id: 'video', name: 'Videos' },
  { id: 'audio', name: 'Audio Guides' },
  { id: 'worksheet', name: 'Worksheets' },
  { id: 'course', name: 'Courses' }
]

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export default function ResourceLibrary() {
  const [selectedResource, setSelectedResource] = useState(null)
  const [resources, setResources] = useState([]) // Always initialize as array
  const [filteredResources, setFilteredResources] = useState([]) // Always initialize as array
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [favorites, setFavorites] = useState(new Set())
  const [trackingResourceId, setTrackingResourceId] = useState(null)

  const trackResourceUsage = useCallback(async (resourceId) => {
    let uid = localStorage.getItem('uid')
    if (!uid) uid = localStorage.getItem('userId')
    if (!uid) uid = localStorage.getItem('user_id')
    
    if (!uid) {
      console.warn('No user ID found, skipping resource tracking')
      return
    }

    setTrackingResourceId(resourceId)

    try {
      const response = await fetch(`${API_BASE_URL}/api/use-resource/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource_id: resourceId }),
      })

      if (!response.ok) {
        console.error('Failed to track resource usage:', response.status)
      }
    } catch (error) {
      console.error('Error tracking resource usage:', error)
    } finally {
      setTrackingResourceId(null)
    }
  }, [])

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/resources`)
        
        if (response.ok) {
          const data = await response.json()
          // Ensure data is an array
          const resourcesArray = Array.isArray(data) ? data : []
          setResources(resourcesArray)
          setFilteredResources(resourcesArray)
        } else {
          console.warn('API fetch failed, using mock data')
          setResources(mockResources)
          setFilteredResources(mockResources)
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
        setResources(mockResources)
        setFilteredResources(mockResources)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  useEffect(() => {
    // Ensure resources is an array before filtering
    if (!Array.isArray(resources)) {
      setFilteredResources([])
      return
    }

    let filtered = [...resources]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(resource =>
        resource && resource.title && resource.title.toLowerCase().includes(query) ||
        resource && resource.description && resource.description.toLowerCase().includes(query) ||
        (resource && resource.tags && Array.isArray(resource.tags) && resource.tags.some(tag => tag && tag.toLowerCase().includes(query)))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource && resource.category === selectedCategory)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource && resource.type === selectedType)
    }

    setFilteredResources(filtered)
  }, [searchQuery, selectedCategory, selectedType, resources])

  const handleFavorite = async (resourceId) => {
    return new Promise((resolve) => {
      setFavorites(prev => {
        const newFavorites = new Set(prev)
        if (newFavorites.has(resourceId)) {
          newFavorites.delete(resourceId)
        } else {
          newFavorites.add(resourceId)
        }
        return newFavorites
      })
      resolve()
    })
  }

  const handleResourceView = (resource) => {
    if (!resource || !resource.id) return
    trackResourceUsage(resource.id).catch(console.error)
    setSelectedResource(resource)
  }

  // Safe check for featured resources
  const hasFeaturedResources = Array.isArray(filteredResources) && filteredResources.filter(r => r && r.featured).length > 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 h-80 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search resources, topics, or keywords..."
            />
          </div>
          <div className="flex space-x-4">
            <ResourceFilter
              label="Category"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <ResourceFilter
              label="Type"
              options={resourceTypes}
              value={selectedType}
              onChange={setSelectedType}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
              {categories.find(c => c.id === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-2 hover:text-primary-600"
              >
                ×
              </button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {resourceTypes.find(t => t.id === selectedType)?.name}
              <button
                onClick={() => setSelectedType('all')}
                className="ml-2 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedType('all')
                setSearchQuery('')
              }}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {hasFeaturedResources && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredResources
              .filter(resource => resource && resource.featured)
              .map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isFavorite={favorites.has(resource.id)}
                  onFavorite={() => handleFavorite(resource.id)}
                  onView={() => handleResourceView(resource)}
                  featured
                  isTracking={trackingResourceId === resource.id}
                />
              ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Resources
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Array.isArray(filteredResources) ? filteredResources.length : 0} resource{filteredResources.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {!Array.isArray(filteredResources) || filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedType('all')
              }}
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isFavorite={favorites.has(resource.id)}
                onFavorite={() => handleFavorite(resource.id)}
                onView={() => handleResourceView(resource)}
                isTracking={trackingResourceId === resource.id}
              />
            ))}
          </div>
        )}
      </div>

      {selectedResource && (
        <ResourceViewerModal
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  )
}

// Mock data (keep this as is from previous code)
const mockResources = [
  {
    id: 1,
    title: 'Understanding Anxiety Disorders',
    description: 'A comprehensive guide to understanding different types of anxiety disorders...',
    category: 'anxiety',
    type: 'article',
    duration: '15 min read',
    level: 'Beginner',
    rating: 4.8,
    reviews: 124,
    featured: true,
    tags: ['Anxiety', 'Mental Health', 'Education'],
    content: { intro: 'Anxiety disorders are among the most common mental health conditions...', sections: [] }
  },
  {
    id: 2,
    title: 'Mindfulness Meditation for Stress',
    description: 'Guided meditation sessions designed to help reduce stress...',
    category: 'stress',
    type: 'audio',
    duration: '20 min',
    level: 'All Levels',
    rating: 4.9,
    reviews: 89,
    featured: true,
    tags: ['Meditation', 'Mindfulness', 'Stress Relief'],
    audioUrl: '/audio/mindfulness.mp3',
    content: { intro: 'This guided meditation helps you slow down...' }
  },
  {
    id: 3,
    title: 'Cognitive Behavioral Therapy (CBT) Basics',
    description: 'A 6-module self-paced course to help you understand and manage negative thought patterns...',
    category: 'depression',
    type: 'course',
    duration: '6 modules',
    level: 'Intermediate',
    rating: 4.7,
    reviews: 203,
    featured: false,
    tags: ['CBT', 'Therapy', 'Skills'],
    content: { intro: 'Cognitive Behavioral Therapy (CBT) is a structured approach...', sections: [] }
  },
  {
    id: 4,
    title: 'Daily Self-Care Checklist',
    description: 'Printable worksheet to track your daily self-care activities...',
    category: 'self-care',
    type: 'worksheet',
    duration: '5 min daily',
    level: 'Beginner',
    rating: 4.6,
    reviews: 67,
    featured: false,
    tags: ['Self-Care', 'Worksheet', 'Habits'],
    pdfUrl: '/worksheets/daily-self-care-checklist.pdf'
  },
  {
    id: 5,
    title: 'Finding Strength in Faith',
    description: 'Exploring how spiritual practices can support mental wellness...',
    category: 'faith',
    type: 'article',
    duration: '12 min read',
    level: 'All Levels',
    rating: 4.9,
    reviews: 156,
    featured: true,
    tags: ['Faith', 'Spirituality', 'Hope'],
    content: { intro: 'Spirituality and faith have been central sources of comfort...', sections: [] }
  },
  {
    id: 6,
    title: 'Crisis Coping Strategies',
    description: 'Immediate techniques and resources for managing mental health crises...',
    category: 'crisis',
    type: 'video',
    duration: '25 min',
    level: 'All Levels',
    rating: 4.8,
    reviews: 92,
    featured: true,
    tags: ['Crisis', 'Emergency', 'Support'],
    embedUrls: ['https://www.youtube.com/embed/5-PgSUTOSeM']
  }
]