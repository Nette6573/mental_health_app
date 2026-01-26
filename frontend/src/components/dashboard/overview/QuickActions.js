import Card from '@/components/ui/Card'

const actions = [
  {
    title: 'Chat with Paula',
    description: 'Talk through stress, emotions, or anything on your mind',
    icon: '💛💬',
    color: 'from-purple-500 to-purple-600',
    href: '/paula',
    available: true,
  },
  {
    title: 'Daily Check-in',
    description: 'Log your mood and thoughts',
    icon: '📝',
    color: 'from-blue-500 to-blue-600',
    href: '/dashboard/mood',
    available: true,
  },
  {
    title: 'Therapist Chat',
    description: 'Message your therapist',
    icon: '💬',
    color: 'from-green-500 to-green-600',
    href: '/dashboard/therapists',
    available: true,
  },
  {
    title: 'Meditation',
    description: '5-minute guided session',
    icon: '🧘‍♀️',
    color: 'from-purple-400 to-indigo-500',
    href: '/dashboard/resources',
    available: true,
  },
  {
    title: 'Devotional',
    description: 'Daily scripture reading',
    icon: '📖',
    color: 'from-orange-500 to-orange-600',
    href: '/dashboard/faith',
    available: true,
  },
]

export default function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <a
            key={action.title}
            href={action.href}
            className={`block p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{action.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">
                  {action.title}
                </h4>
                <p className="text-white/80 text-sm">
                  {action.description}
                </p>
              </div>
              {action.available && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* 🚨 Emergency Action */}
      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 text-lg">🚨</span>
            </div>
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-300">
                Crisis Support
              </h4>
              <p className="text-red-700 dark:text-red-400 text-sm">
                Available 24/7
              </p>
            </div>
          </div>
          <a
            href="tel:+18765554321"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            Call Now
          </a>
        </div>
      </div>
    </Card>
  )
}
