export interface Resource {
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
  duration?: number // in minutes for video/audio/podcast
  pages?: number // for books
  publisher?: string // for books
  isbn?: string // for books
  publicationDate?: string
  createdAt: string
  publishedAt?: string
  updatedAt: string
  metadata?: Record<string, any>
}

export interface ResourceCategory {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  color?: string
  resourceCount: number
  createdAt: string
}

export interface ResourceComment {
  id: string
  resourceId: string
  userId: string
  userName: string
  content: string
  rating?: number
  createdAt: string
}

export interface ResourceStats {
  totalResources: number
  publishedResources: number
  draftResources: number
  archivedResources: number
  totalViews: number
  totalLikes: number
  totalShares: number
  averageRating: number
  popularCategories: {
    category: string
    count: number
    views: number
  }[]
  recentUploads: Resource[]
  topResources: {
    id: string
    title: string
    views: number
    type: string
  }[]
}

export type ResourceFormData = Omit<Resource, 'id' | 'views' | 'likes' | 'shares' | 'createdAt' | 'updatedAt'>