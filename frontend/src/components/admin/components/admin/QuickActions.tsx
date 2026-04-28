import {
  UserPlusIcon,
  DocumentPlusIcon,
  MegaphoneIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const actions = [
  {
    name: 'Add New User',
    description: 'Create a new user account',
    icon: UserPlusIcon,
    color: 'bg-blue-500',
    href: '/admin/users/new'
  },
  {
    name: 'Create Resource',
    description: 'Add a new resource or article',
    icon: DocumentPlusIcon,
    color: 'bg-green-500',
    href: '/admin/resources/new'
  },
  {
    name: 'Send Announcement',
    description: 'Notify all users',
    icon: MegaphoneIcon,
    color: 'bg-purple-500',
    href: '/admin/announcements'
  },
  {
    name: 'System Settings',
    description: 'Configure platform settings',
    icon: Cog6ToothIcon,
    color: 'bg-orange-500',
    href: '/admin/settings'
  }
]

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <a
              key={action.name}
              href={action.href}
              className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{action.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}