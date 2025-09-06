// front-end/src/app/page.tsx
'use client'

import { useEffect } from 'react'
import { Package } from 'lucide-react'

export default function HomePage() {
  useEffect(() => {
    // Redirigir al dashboard después de un breve momento
    const timer = setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Package className="h-24 w-24 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TrueStock</h1>
          <p className="text-lg text-gray-600">Sistema de Gestión de Inventario</p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>

        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Optimizando la gestión de inventario para PYMEs con IA
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}