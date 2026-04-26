'use client'

import { useEffect, useRef } from 'react'

export default function UserGrowthChart() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      // Simple placeholder chart - you can replace with actual chart library
      ctx.clearRect(0, 0, 400, 200)
      ctx.fillStyle = '#3b82f6'
      
      // Draw some bars
      const data = [65, 59, 80, 81, 56, 55, 40]
      data.forEach((value, index) => {
        ctx.fillRect(index * 50 + 30, 200 - value, 30, value)
      })
    }
  }, [])

  return (
    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
      <canvas ref={canvasRef} width={400} height={200} className="w-full h-full" />
      <p className="text-gray-500 dark:text-gray-400">Chart placeholder - Integrate with your preferred chart library</p>
    </div>
  )
}