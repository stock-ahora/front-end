'use client'


import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowLeft, Camera, CheckCircle, Edit3, Filter, Package, Plus, Search, Trash2 } from 'lucide-react'

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
 return(<></>)
}