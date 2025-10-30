import { useMemo } from 'react'
import { paths } from '@/routes/paths'
import { FiPackage, FiFileText, FiBell, FiSettings, FiBarChart2, FiCamera } from 'react-icons/fi'

type Role = 'ADMIN' | 'OPERADOR' | 'CONSULTA'

export function useNavData() {
  const data = useMemo(
      () => [
        {
          subheader: 'TrueStock',
          roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[],
          items: [
            {
              title: 'Dashboard',
              path: paths.dashboard.root,
              roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[],
              icon: <FiBarChart2 />
            },
            {
              title: 'Inventario',
              //path: paths.private.root,
              roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[],
              icon: <FiPackage />,
              children: [
               // { title: 'Listado', path: paths.private.list, roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[] },
               // { title: 'Movimientos', path: paths.private.movements, roles: ['ADMIN', 'OPERADOR'] as Role[] },
                { title: 'OCR Facturas', path: paths.ocr.root, roles: ['ADMIN', 'OPERADOR'] as Role[], icon: <FiCamera /> }
              ]
            },
            {
              title: 'OCR Online',
              path: paths.billing.root,
              roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[],
              icon: <FiFileText />,
              children: [
                { title: 'Comprobantes', path: paths.billing.vouchers, roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[] }]
            },
            {
              title: 'Notificaciones',
              path: paths.notifications.root,
              roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[],
              icon: <FiBell />,
              children: [
                { title: 'Pendientes', path: paths.notifications.pending, roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[] },
                { title: 'Historial', path: paths.notifications.history, roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[] }
              ]
            },
            {
              title: 'Dashboard',
              path: paths.reports.root,
              roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[],
              icon: <FiBarChart2 />,
              children: [
                { title: 'KPIs', path: paths.reports.kpis, roles: ['ADMIN', 'OPERADOR', 'CONSULTA'] as Role[] },
                { title: 'Descargables', path: paths.reports.exports, roles: ['ADMIN', 'OPERADOR'] as Role[] }
              ]
            },
            {
              title: 'Configuración',
              path: paths.settings.root,
              roles: ['ADMIN'] as Role[],
              icon: <FiSettings />,
              children: [
                { title: 'Preferencias', path: paths.settings.preferences, roles: ['ADMIN'] as Role[] },
                { title: 'Usuarios y Roles', path: paths.settings.users, roles: ['ADMIN'] as Role[] }
              ]
            }
          ]
        }
      ],
      []
  )

  return data
}
