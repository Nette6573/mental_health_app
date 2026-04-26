'use client'

import { useState } from 'react'
import PageHeader from '@/components/shared/PageHeader'
import CategoryManager from '@/components/resources/CategoryManager'
import { MOCK_CATEGORIES } from '@/constants/resources'

export default function CategoriesPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES)

  const handleAddCategory = (newCategory: any) => {
    setCategories([...categories, newCategory])
  }

  const handleEditCategory = (updatedCategory: any) => {
    setCategories(categories.map(c => 
      c.id === updatedCategory.id ? updatedCategory : c
    ))
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  return (
    <>
      <PageHeader 
        title="Resource Categories"
        subtitle="Organize resources by creating and managing categories"
      />

      <div className="mt-6">
        <CategoryManager 
          categories={categories}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </div>
    </>
  )
}