import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/shared/Logo'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Chat with Paula', href: '/paula', icon: ChatIcon }, // ✅ NEW
  { name: 'Mood Tracking', href: '/dashboard/mood', icon: MoodIcon },
  { name: 'Resources', href: '/dashboard/resources', icon: ResourcesIcon },
  { name: 'Therapists', href: '/dashboard/therapists', icon: TherapistIcon },
  { name: 'Faith Resources', href: '/dashboard/faith', icon: FaithIcon },
  { name: 'Progress', href: '/dashboard/progress', icon: ProgressIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
]

export default function Sidebar({ user }) {
  const pathname = usePathname()

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Logo showText size="small" />
        </div>

        {/* User Profile */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.firstName?.[0] || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive
                      ? 'text-primary-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Crisis Support */}
        <div className="px-4 pb-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-red-800 dark:text-red-300">
              Crisis Support
            </h3>
            <p className="text-xs text-red-700 dark:text-red-400 mb-2">
              Available 24/7
            </p>
            <a
              href="tel:+18765554321"
              className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              +1 (876) 555-HELP
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= ICONS ================= */

function DashboardIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
    </svg>
  )
}

function ChatIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M8 10h8M8 14h4M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.4-3.6A7.97 7.97 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

function MoodIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ResourcesIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M12 6v13m0-13C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6v13c1.2-.5 2.8-1 4.5-1s3.3.5 4.5 1" />
    </svg>
  )
}

function TherapistIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM12 7a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
  )
}

function FaithIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M12 4a4 4 0 100 8 4 4 0 000-8zM3 20a9 9 0 0118 0" />
    </svg>
  )
}

function ProgressIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M3 3v18h18" />
    </svg>
  )
}

function SettingsIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  )
}
