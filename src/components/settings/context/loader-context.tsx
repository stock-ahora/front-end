import React, { createContext, useContext, useState, useCallback } from 'react'

interface LoaderContextType {
  activeRequests: number
  increment: () => void
  decrement: () => void
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined)

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [activeRequests, setActiveRequests] = useState(0)

  const increment = useCallback(() => {
    setActiveRequests((prev) => prev + 1)
  }, [])

  const decrement = useCallback(() => {
    setActiveRequests((prev) => Math.max(0, prev - 1))
  }, [])

  return (
    <LoaderContext.Provider value={{ activeRequests, increment, decrement }}>
      {children}
    </LoaderContext.Provider>
  )
}

export const useLoader = () => {
  const context = useContext(LoaderContext)
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider')
  }
  return context
}
