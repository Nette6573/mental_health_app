export interface Resource {
  id: string
  title: string
  description: string
  content: string
  type: 'article' | 'video' | 'audio' | 'guide' | 'worksheet' | 'external'
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
  fileUrl?: string
  externalUrl?: string
  duration?: number
  createdAt: string
  publishedAt?: string
  updatedAt: string
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

export interface ResourceStats {
  totalResources: number
  publishedResources: number
  draftResources: number
  totalViews: number
  totalLikes: number
  popularCategories: {
    category: string
    count: number
  }[]
  recentUploads: Resource[]
}