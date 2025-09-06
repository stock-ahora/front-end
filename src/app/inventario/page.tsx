'uso cliente'

import React, { useState, useEffect } from 'react'
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  Camera,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface Producto {
  id: string
  nombre: string
  categoria: string
  stockActual: number
  stockMinimo: number
  precio: number
  codigoBarras?: string
  proveedor: string
  fechaUltimaActualizacion: string
  estado: 'en_stock' | 'bajo_stock' | 'agotado'
}

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  // Simulación de datos del inventario
  useEffect(() => {
    const loadInventario = async () => {
      setIsLoading(true)

      // Simular carga de datos
      setTimeout(() => {
        const mockData: Producto[] = [
          {
            id: '1',
            nombre: 'Laptop Dell XPS 13',
            categoria: 'Tecnología',
            stockActual: 2,
            stockMinimo: 5,
            precio: 899000,
            codigoBarras: '123456789012',
            proveedor: 'Dell Chile',
            fechaUltimaActualizacion: '2024-03-15',
            estado: 'bajo_stock'
          },
          {
            id: '2',
            nombre: 'Mouse Inalámbrico Logitech',
            categoria: 'Accesorios',
            stockActual: 15,
            stockMinimo: 10,
            precio: 25000,
            codigoBarras: '123456789013',
            proveedor: 'Logitech',
            fechaUltimaActualizacion: '2024-03-14',
            estado: 'en_stock'
          },
          {
            id: '3',
            nombre: 'Teclado Mecánico RGB',
            categoria: 'Accesorios',
            stockActual: 3,
            stockMinimo: 8,
            precio: 75000,
            codigoBarras: '123456789014',
            proveedor: 'Razer',
            fechaUltimaActualizacion: '2024-03-13',
            estado: 'bajo_stock'
          },
          {
            id: '4',
            nombre: 'Monitor 24" Full HD',
            categoria: 'Tecnología',
            stockActual: 0,
            stockMinimo: 3,
            precio: 180000,
            codigoBarras: '123456789015',
            proveedor: 'Samsung',
            fechaUltimaActualizacion: '2024-03-12',
            estado: 'agotado'
          },
          {
            id: '5',
            nombre: 'Impresora HP LaserJet',
            categoria: 'Oficina',
            stockActual: 8,
            stockMinimo: 2,
            precio: 320000,
            codigoBarras: '123456789016',
            proveedor: 'HP',
            fechaUltimaActualizacion: '2024-03-11',
            estado: 'en_stock'
          }
        ]

        setProductos(mockData)
        setIsLoading(false)
      }, 800)
    }

    loadInventario()
  }, [])

  // Filtrar productos según búsqueda y categoría
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.codigoBarras?.includes(searchTerm)

    const matchesCategory = selectedCategory === 'all' || producto.categoria === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Obtener categorías únicas
  const categorias = ['all', ...Array.from(new Set(productos.map(p => p.categoria)))]

  const getEstadoColor = (estado: Producto['estado']) => {
    switch (estado) {
      case 'en_stock':
        return 'bg-green-100 text-green-800'
      case 'bajo_stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'agotado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: Producto['estado']) => {
    switch (estado) {
      case 'en_stock':
        return <CheckCircle className="h-4 w-4" />
      case 'bajo_stock':
      case 'agotado':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando inventario...</p>
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
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Inventario</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/inventario/scan'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Escanear Factura
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y Búsqueda */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos, proveedores, códigos de barras..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categorias.filter(cat => cat !== 'all').map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Productos</div>
            <div className="text-2xl font-bold text-gray-900">{filteredProductos.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">En Stock</div>
            <div className="text-2xl font-bold text-green-600">
              {filteredProductos.filter(p => p.estado === 'en_stock').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">Con Alertas</div>
            <div className="text-2xl font-bold text-red-600">
              {filteredProductos.filter(p => p.estado === 'bajo_stock' || p.estado === 'agotado').length}
            </div>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProductos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {producto.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {producto.categoria} • {producto.codigoBarras}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{producto.stockActual}</span>
                        <span className="text-gray-400 ml-1">/ {producto.stockMinimo} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(producto.precio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {producto.proveedor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(producto.estado)}`}>
                        {getEstadoIcon(producto.estado)}
                        <span className="ml-1">
                          {producto.estado === 'en_stock' && 'En Stock'}
                          {producto.estado === 'bajo_stock' && 'Stock Bajo'}
                          {producto.estado === 'agotado' && 'Agotado'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProductos.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando un producto'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Agregar Producto (placeholder) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowAddModal(false)}></div>
              </div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Agregar Nuevo Producto
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Esta funcionalidad será implementada en la siguiente iteración del MVP.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}