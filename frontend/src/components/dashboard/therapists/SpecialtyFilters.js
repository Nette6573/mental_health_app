export default function SpecialtyFilters({
  specialties,
  locations,
  selectedSpecialty,
  selectedLocation,
  onSpecialtyChange,
  onLocationChange
}) {
  return (
    <div className="space-y-6">
      {/* Specialties */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specialties</h3>
        <div className="space-y-2">
          {specialties.map(specialty => (
            <button
              key={specialty.id}
              onClick={() => onSpecialtyChange(specialty.id)}
              className={`
                w-full text-left px-3 py-2 rounded-lg transition-colors duration-200
                ${selectedSpecialty === specialty.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span>{specialty.name}</span>
                {specialty.count && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                    {specialty.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h3>
        <div className="space-y-2">
          {locations.map(location => (
            <button
              key={location.id}
              onClick={() => onLocationChange(location.id)}
              className={`
                w-full text-left px-3 py-2 rounded-lg transition-colors duration-200
                ${selectedLocation === location.id
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span>{location.name}</span>
                {location.count && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                    {location.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      {(selectedSpecialty !== 'all' || selectedLocation !== 'all') && (
        <button
          onClick={() => {
            onSpecialtyChange('all')
            onLocationChange('all')
          }}
          className="w-full text-center text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium py-2"
        >
          Reset Filters
        </button>
      )}
    </div>
  )
}