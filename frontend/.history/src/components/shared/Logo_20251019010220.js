export default function Logo({ darkMode = false, className = '' }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <span className={`font-heading text-xl font-bold ${darkMode ? 'text-white' : 'text-primary-700 dark:text-primary-400'}`}>
        HopePath
      </span>
    </div>
  )
}