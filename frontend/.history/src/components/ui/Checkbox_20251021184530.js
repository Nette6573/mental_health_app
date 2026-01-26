import { forwardRef } from 'react'

const Checkbox = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="flex items-center space-x-3">
      <input
        ref={ref}
        type="checkbox"
        className={`
          h-4 w-4 rounded border-gray-300 text-primary-600 
          focus:ring-primary-500 focus:ring-2
          dark:border-gray-600 dark:bg-gray-700
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {label && (
        <label htmlFor={props.id} className="block text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox