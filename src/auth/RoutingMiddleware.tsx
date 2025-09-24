'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getAuthenticatedUserRoles } from '@/auth/msal'
// import { MenuItems } from '@/config/Global'
import { useNavData } from '@/components/layouts/dashboard/config-navigation'

interface RoutingMiddlewareProps {
  children: React.ReactNode
}

const RoutingMiddleware: React.FC<RoutingMiddlewareProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const navData: any = useNavData()
  useEffect(() => {
    const userRoles: string[] = getAuthenticatedUserRoles() as string[]

    let currentRoute = null
    for (const item of navData) {
      for (const link of item.items) {
        if (link.path === pathname) {
          currentRoute = link
          break
        }

        if (link?.children?.length > 0) {
          for (const child of link?.children) {
            if (child.path === pathname) {
              currentRoute = child
              break
            }
          }
          break
        }
      }
      if (currentRoute) {
        break
      }
    }

    if (
      currentRoute &&
      !currentRoute.roles.some((role: string) => userRoles.includes(role))
    ) {
      router.push('/unauthorizedUser')
    }
  })

  return <>{children}</>
}

export default RoutingMiddleware
