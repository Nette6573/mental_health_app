import { 
  UsersIcon, 
  UserGroupIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline'

const statsCards = [
  {
    name: 'Total Users',
    value: '12,543',
    change: '+12.3%',
    icon: UsersIcon,
    color: 'bg-blue-500'
  },
  {
    name: 'Active Users',
    value: '8,765',
    change: '+5.4%',
    icon: UserGroupIcon,
    color: 'bg-green-500'
  },
  {
    name: 'Total Resources',
    value: '342',
    change: '+23',
    icon: BookOpenIcon,
    color: 'bg-purple-500'
  },
  {
    name: 'Monthly Growth',
    value: '12.5%',
    change: '+2.3%',
    icon: ArrowTrendingUpIcon,
    color: 'bg-orange-500'
  }
]

export default function AdminStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-500 font-medium">{stat.change}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">from last month</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}