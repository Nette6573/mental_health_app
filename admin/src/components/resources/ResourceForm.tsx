'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  PlusIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { RESOURCE_TYPES, RESOURCE_CATEGORIES, RESOURCE_STATUS } from '@/constants/resources'
import Link from 'next/link'

const resourceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  type: z.enum(['article', 'video', 'audio', 'podcast', 'book', 'guide', 'worksheet', 'external']),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  author: z.string().min(2, 'Author name is required'),
  authorId: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  thumbnail: z.any().optional(),
  coverImage: z.any().optional(),
  fileUrl: z.string().optional(),
  externalUrl: z.string().url().optional(),
  duration: z.number().optional(),
  pages: z.number().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  publicationDate: z.string().optional(),
  metadata: z.record(z.any()).optional(),
}).refine((data) => {
  if (data.type === 'external' && !data.externalUrl) {
    return false
  }
  return true
}, {
  message: "External URL is required for external resources",
  path: ["externalUrl"],
})

type ResourceFormData = z.infer<typeof resourceSchema>

interface ResourceFormProps {
  initialData?: ResourceFormData & { id?: string }
  onSubmit: (data: ResourceFormData) => Promise<void>
  onCancel: () => void
  isSaving?: boolean
}

export default function ResourceForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSaving = false 
}: ResourceFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [tagInput, setTagInput] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      content: '',
      type: 'article',
      category: '',
      tags: [],
      author: '',
      authorId: '',
      status: 'draft',
      featured: false,
      thumbnail: null,
      coverImage: null,
      fileUrl: '',
      externalUrl: '',
      duration: undefined,
      pages: undefined,
      publisher: '',
      isbn: '',
      publicationDate: '',
      metadata: {},
    },
  })

  const watchType = watch('type')
  const watchStatus = watch('status')
  const watchFeatured = watch('featured')
  const watchTags = watch('tags')

  // Auto-save functionality
  useEffect(() => {
    if (!isDirty || !initialData) return

    const autoSave = setTimeout(() => {
      setAutoSaveStatus('saving')
      // Simulate auto-save
      setTimeout(() => {
        setAutoSaveStatus('saved')
        setTimeout(() => setAutoSaveStatus('idle'), 2000)
      }, 1000)
    }, 3000)

    return () => clearTimeout(autoSave)
  }, [isDirty, getValues, initialData])

  const handleAddTag = () => {
    if (tagInput.trim() && !watchTags.includes(tagInput.trim())) {
      setValue('tags', [...watchTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchTags.filter(tag => tag !== tagToRemove))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'coverImage' | 'fileUrl') => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you'd upload this to a server
      // For now, we'll create a local URL for preview
      const url = URL.createObjectURL(file)
      setValue(field as any, {
        file,
        preview: url,
        name: file.name,
      })
    }
  }

  const handleDuplicate = () => {
    const currentData = getValues()
    // Navigate to new resource page with current data as template
    // This would be implemented with your routing logic
    console.log('Duplicate resource with data:', currentData)
  }

  const tabs = [
    { id: 'basic', name: 'Basic Info' },
    { id: 'content', name: 'Content' },
    { id: 'media', name: 'Media' },
    { id: 'metadata', name: 'Metadata' },
    { id: 'seo', name: 'SEO' },
    { id: 'settings', name: 'Settings' },
  ]

  return (
    <div className="space-y-6">
      {/* Form Header with Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {initialData ? 'Edit Resource' : 'Create New Resource'}
            </h2>
            
            {/* Auto-save Indicator */}
            {initialData && (
              <div className="flex items-center text-sm">
                {autoSaveStatus === 'saving' && (
                  <span className="text-gray-500 flex items-center">
                    <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </span>
                )}
                {autoSaveStatus === 'saved' && (
                  <span className="text-green-500">✓ Saved</span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
            >
              <EyeIcon className="w-5 h-5" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>

            {/* Duplicate Action (only for existing resources) */}
            {initialData && (
              <button
                type="button"
                onClick={handleDuplicate}
                className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
              >
                <DocumentDuplicateIcon className="w-5 h-5" />
                Duplicate
              </button>
            )}

            {/* Status Toggle */}
            <select
              value={watchStatus}
              onChange={(e) => setValue('status', e.target.value as any)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium border-0
                ${watchStatus === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : ''}
                ${watchStatus === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : ''}
                ${watchStatus === 'archived' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : ''}
              `}
            >
              {RESOURCE_STATUS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Featured Toggle */}
            <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={watchFeatured}
                onChange={(e) => setValue('featured', e.target.checked)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>
        </div>

        {/* Dirty Fields Indicator */}
        {isDirty && (
          <div className="mt-2 text-xs text-gray-500">
            Unsaved changes: {Object.keys(dirtyFields).length} field(s) modified
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="flex -mb-px space-x-8 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Preview Mode */}
      {previewMode ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="max-w-3xl mx-auto prose dark:prose-invert">
            <h1>{watch('title') || 'Untitled'}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 not-prose mb-8">
              <span>By {watch('author') || 'Unknown Author'}</span>
              {initialData?.publicationDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(initialData.publicationDate).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>

            <p className="lead">{watch('description')}</p>
            
            <div className="mt-8">
              {watch('content') || 'No content yet.'}
            </div>

            {watchTags.length > 0 && (
              <div className="mt-8 not-prose">
                <div className="flex flex-wrap gap-2">
                  {watchTags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter resource title"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the resource"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {watch('description')?.length || 0}/20+ characters
                </p>
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resource Type *
                  </label>
                  <select
                    {...register('type')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {RESOURCE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a category</option>
                    {RESOURCE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author Name *
                  </label>
                  <input
                    {...register('author')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Author name"
                  />
                  {errors.author && (
                    <p className="mt-1 text-xs text-red-600">{errors.author.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author ID (Optional)
                  </label>
                  <input
                    {...register('authorId')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Author ID"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {watchTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Content</h3>
                <div className="text-sm text-gray-500">
                  {watch('content')?.length || 0}/50+ characters
                </div>
              </div>

              {/* Main Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  {...register('content')}
                  rows={16}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                  placeholder="Resource content (supports HTML/markdown)"
                />
                {errors.content && (
                  <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  You can use HTML or Markdown formatting
                </p>
              </div>

              {/* Quick Formatting Tools */}
              <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <button type="button" className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">B</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">I</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">H1</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">H2</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">Link</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">List</button>
                <button type="button" className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">Quote</button>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold">Media & Files</h3>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                    <ArrowUpTrayIcon className="w-5 h-5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'thumbnail')}
                      className="hidden"
                    />
                  </label>
                  {watch('thumbnail') && (
                    <div className="flex items-center gap-2">
                      <img
                        src={(watch('thumbnail') as any)?.preview || watch('thumbnail')}
                        alt="Thumbnail preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span className="text-sm text-gray-500">
                        {(watch('thumbnail') as any)?.name || 'File selected'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image (for books)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                    <ArrowUpTrayIcon className="w-5 h-5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'coverImage')}
                      className="hidden"
                    />
                  </label>
                  {watch('coverImage') && (
                    <div className="flex items-center gap-2">
                      <img
                        src={(watch('coverImage') as any)?.preview || watch('coverImage')}
                        alt="Cover preview"
                        className="w-12 h-16 object-cover rounded"
                      />
                      <span className="text-sm text-gray-500">
                        {(watch('coverImage') as any)?.name || 'File selected'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* File URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File URL
                </label>
                <input
                  {...register('fileUrl')}
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/file.pdf"
                />
              </div>

              {/* External URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  External URL {watchType === 'external' && '*'}
                </label>
                <input
                  {...register('externalUrl')}
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/resource"
                />
                {errors.externalUrl && (
                  <p className="mt-1 text-xs text-red-600">{errors.externalUrl.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Metadata Tab */}
          {activeTab === 'metadata' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold">Additional Metadata</h3>

              {/* Duration (for video/audio/podcast) */}
              {(watchType === 'video' || watchType === 'audio' || watchType === 'podcast') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    {...register('duration', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 60"
                  />
                </div>
              )}

              {/* Book-specific fields */}
              {watchType === 'book' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Pages
                    </label>
                    <input
                      {...register('pages', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 250"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publisher
                    </label>
                    <input
                      {...register('publisher')}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Publisher name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ISBN
                    </label>
                    <input
                      {...register('isbn')}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="ISBN number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publication Date
                    </label>
                    <input
                      {...register('publicationDate')}
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold">SEO Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="SEO title (leave blank to use resource title)"
                  defaultValue={initialData?.title}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="SEO description (leave blank to use resource description)"
                  defaultValue={initialData?.description}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/resources/</span>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="url-slug"
                    defaultValue={initialData?.title?.toLowerCase().replace(/\s+/g, '-')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Open Graph Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                    <ArrowUpTrayIcon className="w-5 h-5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold">Advanced Settings</h3>

              {/* Comments */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Allow comments on this resource
                  </span>
                </label>
              </div>

              {/* Download */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Allow users to download this resource
                  </span>
                </label>
              </div>

              {/* Password Protection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password Protection (Optional)
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="Leave blank for no password"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Set a password to restrict access to this resource
                </p>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Resource will be automatically archived after this date
                </p>
              </div>

              {/* Metadata JSON */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Metadata (JSON)
                </label>
                <textarea
                  {...register('metadata')}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-mono"
                  placeholder='{
  "key": "value",
  "array": ["item1", "item2"],
  "nested": {
    "property": "value"
  }
}'
                  onChange={(e) => {
                    try {
                      setValue('metadata', JSON.parse(e.target.value))
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter valid JSON for additional metadata
                </p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{initialData ? 'Update Resource' : 'Create Resource'}</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}