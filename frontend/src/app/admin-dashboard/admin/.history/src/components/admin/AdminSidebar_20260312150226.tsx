'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  ChevronLeftIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,

  ChevronRightIcon
} from '@heroicons/react/24/outline'
import Logo from '@/components/shared/Logo'

const navigation = [
   { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Therapists', href: '/admin/therapists', icon: UserGroupIcon },
  { name: 'Resources', href: '/admin/resources', icon: BookOpenIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Chat', href: '/admin/chat', icon: ChatBubbleLeftIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
]

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`${!isOpen && 'lg:hidden'}`}>
            <Logo />
          </div>
          <div className={`${isOpen ? 'lg:hidden' : 'hidden lg:block'}`}>
            <Logo iconOnly />
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:block p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors group
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <item.icon className={`
                  w-6 h-6 flex-shrink-0
                  ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}
                `} />
                
                <span className={`
                  ml-3 font-medium transition-all duration-300
                  ${!isOpen && 'lg:hidden'}
                `}>
                  {item.name}
                </span>

                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <span className="absolute left-20 hidden lg:group-hover:inline-block bg-gray-900 text-white text-sm px-2 py-1 rounded">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}