'use client'

import { useState } from 'react'
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  color?: string
  resourceCount: number
}

interface CategoryManagerProps {
  categories: Category[]
  onAdd: (category: any) => void
  onEdit: (category: any) => void
  onDelete: (id: string) => void
}

export default function CategoryManager({
  categories,
  onAdd,
  onEdit,
  onDelete,
}: CategoryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: 'blue',
  })

  const colors = [
    { value: 'blue', label: 'Blue', bg: 'bg-blue-100 text-blue-800', hex: '#3b82f6' },
    { value: 'green', label: 'Green', bg: 'bg-green-100 text-green-800', hex: '#10b981' },
    { value: 'purple', label: 'Purple', bg: 'bg-purple-100 text-purple-800', hex: '#8b5cf6' },
    { value: 'pink', label: 'Pink', bg: 'bg-pink-100 text-pink-800', hex: '#ec4899' },
    { value: 'red', label: 'Red', bg: 'bg-red-100 text-red-800', hex: '#ef4444' },
    { value: 'yellow', label: 'Yellow', bg: 'bg-yellow-100 text-yellow-800', hex: '#f59e0b' },
    { value: 'indigo', label: 'Indigo', bg: 'bg-indigo-100 text-indigo-800', hex: '#6366f1' },
    { value: 'orange', label: 'Orange', bg: 'bg-orange-100 text-orange-800', hex: '#f97316' },
  ]

  const icons = [
    '😰', '😔', '🙏', '💑', '🕊️', '👪', '🕯️', '🧘', '📚', '🎥', '🎵', '🎙️', '📄', '📝', '🔗',
  ]

  const handleOpenModal = (category: Category | null = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon || '',
        color: category.color || 'blue',
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: '',
        icon: '',
        color: 'blue',
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategory) {
      onEdit({
        ...editingCategory,
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      })
    } else {
      onAdd({
        id: Date.now().toString(),
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        resourceCount: 0,
      })
    }
    
    setIsModalOpen(false)
  }

  const getColorClass = (color: string) => {
    const found = colors.find(c => c.value === color)
    return found ? found.bg : 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">All Categories</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your resource categories
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${getColorClass(category.color)}`}>
                    {category.icon || '📁'}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.resourceCount} resources
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="p-1 text-blue-400 hover:text-blue-600 rounded"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="p-1 text-red-400 hover:text-red-600 rounded"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                {category.description}
              </p>
              <div className="mt-3">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getColorClass(category.color)}`}>
                  {category.slug}
                </span>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No categories yet</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              Create your first category
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Anxiety & Stress"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of this category"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon (Emoji)
                  </label>
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    {icons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-8 h-8 text-xl flex items-center justify-center rounded ${
                          formData.icon === icon
                            ? 'bg-primary-100 ring-2 ring-primary-500'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Or type any emoji"
                    maxLength={2}
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          formData.color === color.value
                            ? 'ring-2 ring-offset-2 ring-primary-500'
                            : ''
                        } ${color.bg}`}
                      >
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}