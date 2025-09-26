import { paths } from '@/routes/paths'

'uso cliente'

import React, { useState, useRef, useCallback } from 'react'
import { 
  Camera, 
  Upload, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader,
  FileImage,
  Scan
} from 'lucide-react'

interface FacturaData {
  numeroFactura: string
  fecha: string
  proveedor: string
  productos: Array<{
    nombre: string
    cantidad: number
    precio: number
    codigoProducto?: string
  }>
  total: number
}

export default function ScanOCRPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<FacturaData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulación del proceso OCR
  const processOCR = useCallback(async (file: File): Promise<FacturaData> => {
    // Simular procesamiento OCR
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Datos simulados que "extraería" el OCR
    const mockResult: FacturaData = {
      numeroFactura: `F-${Math.floor(Math.random() * 100000)}`,
      fecha: new Date().toISOString().split('T')[0],
      proveedor: 'Proveedor Ejemplo S.A.',
      productos: [
        {
          nombre: 'Laptop Dell XPS 15',
          cantidad: 2,
          precio: 1200000,
          codigoProducto: 'DELL-XPS15-001'
        },
        {
          nombre: 'Mouse Inalámbrico',
          cantidad: 5,
          precio: 25000,
          codigoProducto: 'LOGI-MX3-001'
        },
        {
          nombre: 'Teclado Mecánico RGB',
          cantidad: 3,
          precio: 89000,
          codigoProducto: 'RZRR-KB-001'
        }
      ],
      total: 2667000
    }
    
    return mockResult
  }, [])

  const handleFileUpload = async (file: File) => {
    if (!file) return
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setError('Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG) o PDF.')
      return
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 10MB.')
      return
    }

    setError(null)
    setIsScanning(true)
    setScanResult(null)

    try {
      const result = await processOCR(file)
      setScanResult(result)
    } catch (err) {
      setError('Error al procesar el documento. Intenta con otra imagen.')
      console.error('OCR Error:', err)
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const confirmAndUpdateInventory = async () => {
    if (!scanResult) return

    setIsScanning(true)
    
    // Simular actualización del inventario
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('Inventario actualizado exitosamente!')
    
    // Redirigir al dashboard
    window.location.href = paths.dashboard.root
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => window.location.href = '/inventario'}
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <Scan className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Escanear Factura</h1>
                <p className="text-sm text-gray-500">OCR automático para actualizar inventario</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!scanResult && !isScanning && (
          <div className="space-y-6">
            {/* Zona de carga de archivos */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FileImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sube una factura para procesar
              </h3>
              <p className="text-gray-600 mb-6">
                Arrastra y suelta una imagen o PDF, o haz click para seleccionar
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Seleccionar Archivo
                </button>
                
                <div className="text-sm text-gray-500">
                  Formatos soportados: JPG, PNG, PDF (máx. 10MB)
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Consejos para mejores resultados
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Asegúrate de que la imagen esté bien enfocada</li>
                      <li>La factura debe estar completamente visible</li>
                      <li>Evita sombras y reflejos</li>
                      <li>El texto debe ser legible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado de procesamiento */}
        {isScanning && (
          <div className="text-center py-12">
            <Loader className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Procesando documento...
            </h3>
            <p className="text-gray-600">
              Nuestro sistema de IA está extrayendo la información de tu factura
            </p>
            <div className="mt-4 max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados del OCR */}
        {scanResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Documento procesado exitosamente
                </h2>
              </div>
            </div>

            {/* Información de la factura */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Información de la Factura
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Número de Factura
                    </label>
                    <div className="mt-1 text-sm text-gray-900">{scanResult.numeroFactura}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha
                    </label>
                    <div className="mt-1 text-sm text-gray-900">{scanResult.fecha}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Proveedor
                    </label>
                    <div className="mt-1 text-sm text-gray-900">{scanResult.proveedor}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Productos detectados */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Productos Detectados
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scanResult.productos.map((producto, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {producto.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {producto.codigoProducto || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {producto.cantidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(producto.precio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(producto.precio * producto.cantidad)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                        Total:
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900">
                        {formatPrice(scanResult.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setScanResult(null)
                  setError(null)
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Escanear Otra Factura
              </button>
              
              <button
                onClick={confirmAndUpdateInventory}
                disabled={isScanning}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar y Actualizar Inventario
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al procesar documento
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}