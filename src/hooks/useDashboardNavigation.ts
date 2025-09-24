import { useMemo } from 'react'
import { useNavData } from '@/components/layouts/dashboard/config-navigation'
import { useRoleValidation } from './useRoleValidation'

export interface DashboardNavItem {
  title: string
  path: string
  icon: React.ReactElement
}

export const useDashboardNavigation = () => {
  const navData = useNavData()
  const { hasRequiredRole } = useRoleValidation()

  const quickAccessItems = useMemo(() => {
    const items: DashboardNavItem[] = []

    navData.forEach((section) => {
      // Skip if user doesn't have access to the entire section
      if (!hasRequiredRole(section.roles || [])) return

      section.items?.forEach((item) => {
        // Check if user has access to this specific item
        if (!hasRequiredRole(item.roles || [])) return

        // Add main item if it has a direct path and icon
        if (item.path && item.icon) {
          items.push({
            title: item.title,
            path: item.path,
            icon: item.icon
          })
        }

        // Add children items that have list functionality
        item.children?.forEach((child) => {
          if (
            hasRequiredRole(child.roles || []) &&
            child.path &&
            child.title.toLowerCase().includes('listar')
          ) {
            items.push({
              title: item.title, // Use parent title for main functionality
              path: child.path,
              icon: item.icon || child.icon
            })
          }
        })
      })
    })

    // Remove duplicates based on title
    const uniqueItems = items.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.title === item.title)
    )

    return uniqueItems
  }, [navData, hasRequiredRole])

  const maintainerItems = useMemo(() => {
    const items: DashboardNavItem[] = []

    // Find the maintainers section
    const maintainerSection = navData.find(
      (section) => section.subheader === 'Mantenedores'
    )

    if (!maintainerSection || !hasRequiredRole(maintainerSection.roles || [])) {
      return items
    }

    maintainerSection.items?.forEach((item) => {
      if (hasRequiredRole(item.roles || []) && item.path && item.icon) {
        items.push({
          title: item.title,
          path: item.path,
          icon: item.icon
        })
      }
    })

    return items
  }, [navData, hasRequiredRole])

  const projectDevelopmentItems = useMemo(() => {
    const items: DashboardNavItem[] = []

    // Find the "Desarrollos y proyectos" section
    const projectSection = navData.find(
      (section) => section.subheader === 'Desarrollos y proyectos'
    )

    if (!projectSection || !hasRequiredRole(projectSection.roles || [])) {
      return items
    }

    projectSection.items?.forEach((item) => {
      // Check if user has access to this specific item
      if (!hasRequiredRole(item.roles || [])) return

      // Add main item if it has a direct path and icon
      if (item.path && item.icon) {
        items.push({
          title: item.title,
          path: item.path,
          icon: item.icon
        })
      }

      // Add children items that have list functionality
      item.children?.forEach((child) => {
        if (
          hasRequiredRole(child.roles || []) &&
          child.path &&
          child.title.toLowerCase().includes('listar')
        ) {
          items.push({
            title: item.title, // Use parent title for main functionality
            path: child.path,
            icon: item.icon || child.icon
          })
        }
      })
    })

    // Remove duplicates based on title
    const uniqueItems = items.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.title === item.title)
    )

    return uniqueItems
  }, [navData, hasRequiredRole])

  const propertyManagementItems = useMemo(() => {
    const items: DashboardNavItem[] = []

    // Find the "Administración de propiedades" section
    const propertySection = navData.find(
      (section) => section.subheader === 'Administración de propiedades'
    )

    if (!propertySection || !hasRequiredRole(propertySection.roles || [])) {
      return items
    }

    propertySection.items?.forEach((item) => {
      // Check if user has access to this specific item
      if (!hasRequiredRole(item.roles || [])) return

      // Add main item if it has a direct path and icon
      if (item.path && item.icon) {
        items.push({
          title: item.title,
          path: item.path,
          icon: item.icon
        })
      }

      // Add children items that have list functionality
      item.children?.forEach((child) => {
        if (
          hasRequiredRole(child.roles || []) &&
          child.path &&
          child.title.toLowerCase().includes('listar')
        ) {
          items.push({
            title: item.title, // Use parent title for main functionality
            path: child.path,
            icon: item.icon || child.icon
          })
        }
      })
    })

    // Remove duplicates based on title
    const uniqueItems = items.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.title === item.title)
    )

    return uniqueItems
  }, [navData, hasRequiredRole])

  return {
    quickAccessItems,
    maintainerItems,
    projectDevelopmentItems,
    propertyManagementItems
  }
}