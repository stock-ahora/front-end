'uso cliente'

import React, { useState, useEffect } from 'react'
import {
  Package,
  AlertTriangle,
  TrendingUp,
  FileText,
  Camera,
  MessageSquare,
  Bell,
  Upload
} from 'lucide-react'

interface StockAlert {
  id: string
  producto: string
  stockActual: number
  stockMinimo: number
  categoria: string
}

interface StockSummary {
  totalProductos: number
  productosEnStock: number
  productosAgotados: number
  alertasBajoStock: number
}

export default function DashboardPage() {
  const [stockSummary, setStockSummary] = useState<StockSummary>({
    totalProductos: 0,
    productosEnStock: 0,
    productosAgotados: 0,
    alertasBajoStock: 0
  })

  const [alertas, setAlertas] = useState<StockAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulación de datos - reemplazar con llamadas reales a la API
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)

      // Simular carga de datos
      setTimeout(() => {
        setStockSummary({
          totalProductos: 156,
          productosEnStock: 134,
          productosAgotados: 8,
          alertasBajoStock: 14
        })

        setAlertas([
          { id: '1', producto: 'Laptop Dell XPS 13', stockActual: 2, stockMinimo: 5, categoria: 'Tecnología' },
          { id: '2', producto: 'Mouse Inalámbrico', stockActual: 1, stockMinimo: 10, categoria: 'Accesorios' },
          { id: '3', producto: 'Teclado Mecánico', stockActual: 3, stockMinimo: 8, categoria: 'Accesorios' },
          { id: '4', producto: 'Monitor 24"', stockActual: 0, stockMinimo: 3, categoria: 'Tecnología' }
        ])

        setIsLoading(false)
      }, 1000)
    }

    loadDashboardData()
  }, [])

  const handleScanInvoice = () => {
    // Redirigir a página de escaneo OCR
    window.location.href = '/inventario/scan'
  }

  const handleChatbot = () => {
    // Abrir chatbot
    alert('Chatbot no implementado aún en el MVP')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">TrueStock</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleChatbot}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <MessageSquare className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                {alertas.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {alertas.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Acciones Rápidas */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleScanInvoice}
              className="flex items-center justify-center p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Camera className="h-8 w-8 mr-3" />
              <div className="text-left">
                <div className="font-medium">Escanear Factura</div>
                <div className="text-sm opacity-90">OCR automático para actualizar stock</div>
              </div>
            </button>

            <button
              onClick={() => window.location.href = '/inventario'}
              className="flex items-center justify-center p-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Package className="h-8 w-8 mr-3" />
              <div className="text-left">
                <div className="font-medium">Ver Inventario</div>
                <div className="text-sm opacity-90">Gestionar productos y stock</div>
              </div>
            </button>
          </div>
        </div>

        {/* Resumen de Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Productos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stockSummary.totalProductos}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      En Stock
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stockSummary.productosEnStock}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Agotados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stockSummary.productosAgotados}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bell className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Alertas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stockSummary.alertasBajoStock}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas de Stock Bajo */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Alertas de Stock Bajo
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {alertas.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                No hay alertas de stock bajo
              </div>
            ) : (
              alertas.map((alerta) => (
                <div key={alerta.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">
                          {alerta.producto}
                        </h4>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {alerta.categoria}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className={`font-medium ${alerta.stockActual === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                          Stock: {alerta.stockActual}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Mínimo: {alerta.stockMinimo}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {alerta.stockActual === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Agotado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Stock Bajo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}