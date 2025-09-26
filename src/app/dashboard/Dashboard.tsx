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



  return ( <></>)
}