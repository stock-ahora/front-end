export interface Producto {
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
  descripcion?: string
  imagen?: string
}

export interface StockAlert {
  id: string
  producto: string
  stockActual: number
  stockMinimo: number
  categoria: string
}

export interface StockSummary {
  totalProductos: number
  productosEnStock: number
  productosAgotados: number
  alertasBajoStock: number
}

// front-end/src/types/factura.ts
export interface ProductoFactura {
  nombre: string
  cantidad: number
  precio: number
  codigoProducto?: string
}

export interface FacturaData {
  numeroFactura: string
  fecha: string
  proveedor: string
  productos: ProductoFactura[]
  total: number
}

export interface OCRResponse {
  success: boolean
  data?: FacturaData
  error?: string
}

// front-end/src/types/api.ts
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// front-end/src/types/index.ts
export * from './producto'
export * from './factura'
export * from './api'