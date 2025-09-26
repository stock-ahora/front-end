
const ROOTS = {
  DASHBOARD: '/',
  INVENTORY: '/inventario',
  BILLING: '/facturacion',
  NOTIFICATIONS: '/notificaciones',
  REPORTS: '/reportes',
  SETTINGS: '/configuracion',
  LOGIN: '/login',
  OCR: '/ocr', // flujo de escaneo de facturas con OCR wea del sergio
} as const

// ----------------------------------------------------------------------
// Mapa de rutas públicas de la app qla bastarda ctm :v
// ----------------------------------------------------------------------

export const paths = {
  dashboard: {
    root: ROOTS.DASHBOARD,
  },

  public: {
    login: ROOTS.LOGIN,
  },
  private: {
    root: ROOTS.INVENTORY,
    list: `${ROOTS.INVENTORY}`,
    create: `${ROOTS.INVENTORY}/crear`,
    edit: (id: string | number) => `${ROOTS.INVENTORY}/${id}/editar`,
    detail: (id: string | number) => `${ROOTS.INVENTORY}/${id}`,
    movements: `${ROOTS.INVENTORY}/movimientos`,
    categories: `${ROOTS.INVENTORY}/categorias`,
    suppliers: `${ROOTS.INVENTORY}/proveedores`,
  },

  // OCR (escaneo de facturas que impactan inventario)
  ocr: {
    root: ROOTS.OCR,
    scan: `${ROOTS.OCR}/escanear`,
    history: `${ROOTS.OCR}/historial`,
  },

  // Facturación
  billing: {
    root: ROOTS.BILLING,
    vouchers: `${ROOTS.BILLING}/comprobantes`,
    voucherDetail: (id: string | number) => `${ROOTS.BILLING}/comprobantes/${id}`,
    createVoucher: `${ROOTS.BILLING}/comprobantes/crear`,
    taxes: `${ROOTS.BILLING}/impuestos`,
    exports: `${ROOTS.BILLING}/exportaciones`,
  },

  // Notificaciones
  notifications: {
    root: ROOTS.NOTIFICATIONS,
    pending: `${ROOTS.NOTIFICATIONS}/pendientes`,
    history: `${ROOTS.NOTIFICATIONS}/historial`,
    settings: `${ROOTS.NOTIFICATIONS}/configuracion`,
  },

  // Reportes
  reports: {
    root: ROOTS.REPORTS,
    kpis: `${ROOTS.REPORTS}/kpis`,
    dashboards: `${ROOTS.REPORTS}/dashboards`,
    exports: `${ROOTS.REPORTS}/descargables`,
    custom: `${ROOTS.REPORTS}/personalizados`,
  },

  // Configuración
  settings: {
    root: ROOTS.SETTINGS,
    preferences: `${ROOTS.SETTINGS}/preferencias`,
    users: `${ROOTS.SETTINGS}/usuarios`,
    roles: `${ROOTS.SETTINGS}/roles`,
    appearance: `${ROOTS.SETTINGS}/apariencia`,
    integrations: `${ROOTS.SETTINGS}/integraciones`,
  },
}
