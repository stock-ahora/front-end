"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { paths } from '@/routes/paths'

type AuthContextType = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token)
    setIsAuthenticated(true)
    router.push(paths.dashboard.root)
  }

  const logout = () => {
    console.log("Logging out")
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    router.push(paths.public.login)
  }

  const publicRoutes = [paths.public.login]
  const isPublicRoute = publicRoutes.some(route => pathname === route)
  useEffect(() => {
    if (isLoading) return

    console.log("Auth state:", { isAuthenticated, pathname, isPublicRoute })

    if (!isAuthenticated && !isPublicRoute) {
      router.push(paths.public.login)
    } else if (isAuthenticated && isPublicRoute) {
      router.push(paths.dashboard.root)
    }
  }, [isAuthenticated, pathname, router, isLoading, isPublicRoute])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {isLoading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}
