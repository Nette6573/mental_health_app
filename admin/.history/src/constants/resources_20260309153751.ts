import { Resource, ResourceCategory } from '@/types/resources'

export const RESOURCE_TYPES = [
  { value: 'article', label: 'Article', icon: '📄' },
  { value: 'video', label: 'Video', icon: '🎥' },
  { value: 'audio', label: 'Audio', icon: '🎵' },
  { value: 'guide', label: 'Guide', icon: '📚' },
  { value: 'worksheet', label: 'Worksheet', icon: '📝' },
  { value: 'external', label: 'External Link', icon: '🔗' },
]

export const RESOURCE_STATUS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'published', label: 'Published', color: 'green' },
  { value: 'archived', label: 'Archived', color: 'red' },
]

export const MOCK_CATEGORIES: ResourceCategory[] = [
  {
    id: '1',
    name: 'Anxiety & Stress',
    slug: 'anxiety-stress',
    description: 'Resources for managing anxiety and stress',
    icon: '😰',
    color: 'blue',
    resourceCount: 24,
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    name: 'Depression',
    slug: 'depression',
    description: 'Support and resources for depression',
    icon: '😔',
    color: 'indigo',
    resourceCount: 18,
    createdAt: '2025-01-01',
  },
]

export const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: A Faith-Based Approach',
    description: 'Learn how to manage anxiety through faith and practical techniques',
    content: 'Full content here...',
    type: 'article',
    category: 'anxiety-stress',
    tags: ['anxiety', 'faith', 'prayer'],
    author: 'Dr. Sarah Johnson',
    authorId: 'auth1',
    status: 'published',
    featured: true,
    views: 1243,
    likes: 89,
    shares: 34,
    thumbnail: '/thumbnails/anxiety.jpg',
    createdAt: '2025-02-15',
    publishedAt: '2025-02-16',
    updatedAt: '2025-02-16',
  },
]