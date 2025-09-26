import { useMemo } from 'react'
import { getAuthenticatedUserRoles } from '@/auth/msal'
import { TruStockRole } from '@/enums/rol-type.enum'

export const useRoleValidation = () => {
  const userRoles = useMemo(() => {
    const roles = getAuthenticatedUserRoles()
    return Array.isArray(roles) ? roles : []
  }, [])

  const hasRequiredRole = (requiredRoles: string[]) =>
      requiredRoles.length === 0 || requiredRoles.some((role) => userRoles.includes(role))

  const hasAnyRole = (roles: string[]) => roles.some((role) => userRoles.includes(role))

  const hasAllRoles = (roles: string[]) => roles.every((role) => userRoles.includes(role))

  const isAdmin = () => userRoles.includes(TruStockRole.ADMIN)

  const canAccessInventory = () =>
      hasRequiredRole([TruStockRole.ADMIN, TruStockRole.MANAGER, TruStockRole.OPERATOR])

  const canAccessBilling = () =>
      hasRequiredRole([TruStockRole.ADMIN, TruStockRole.MANAGER])

  const canAccessReports = () =>
      hasRequiredRole([TruStockRole.ADMIN, TruStockRole.MANAGER, TruStockRole.VIEWER])

  const canAccessConfig = () =>
      hasRequiredRole([TruStockRole.ADMIN, TruStockRole.MANAGER])

  return {
    userRoles,
    hasRequiredRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    canAccessInventory,
    canAccessBilling,
    canAccessReports,
    canAccessConfig
  }
}
