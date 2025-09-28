import Box from '@mui/material/Box'
import DescriptionIcon from "@mui/icons-material/Description";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";

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
import { Paper, Typography } from '@mui/material'

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



  return ( <>



  </>)
}