export default function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}