export default function WelcomeBanner({ user }) {
  const currentTime = new Date().getHours()
  let greeting = 'Good evening'
  
  if (currentTime < 12) greeting = 'Good morning'
  else if (currentTime < 18) greeting = 'Good afternoon'

  return (
    <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">
            {greeting}, {user?.firstName}!
          </h1>
          <p className="text-primary-100 mb-4 max-w-2xl">
            Welcome to your mental wellness journey. Today is a new opportunity to grow and heal.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              🌱 Daily Check-in Available
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              💭 New Resources Added
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}