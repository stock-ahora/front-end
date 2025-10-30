'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: Date
    read: boolean
    actionUrl?: string
}

interface NotificationContextType {
    notifications: Notification[]
    unreadCount: number
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    removeNotification: (id: string) => void
    clearAllNotifications: () => void
    notifyLowStock: (sku: string, qty: number) => void
    notifyInvoiceProcessed: (folio: string) => void
    notifyOCRFail: (folio?: string) => void
    notifyConfigChanged: (who?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}

interface NotificationProviderProps {
    children: React.ReactNode
}

const STORAGE_KEY = 'truestock_notifications_v1'

const seedMock = (): Notification[] => [
    {
        id: 'seed-1',
        title: 'Stock bajo detectado',
        message: 'SKU 445 - “Cajas 20x20” bajo el mínimo (restan 12 unidades).',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 40),
        read: false,
        actionUrl: '/inventario'
    },
    {
        id: 'seed-2',
        title: 'Factura procesada (OCR)',
        message: 'Factura Nº TS-000123 ingresada al inventario.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 80),
        read: false,
        actionUrl: '/facturacion'
    },
    {
        id: 'seed-3',
        title: 'Reporte mensual disponible',
        message: 'Se generó el reporte de movimientos de agosto.',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 150),
        read: true,
        actionUrl: '/Dashboard'
    }
]

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const parsed = JSON.parse(raw) as Array<Omit<Notification, 'timestamp'> & { timestamp: string }>
                setNotifications(parsed.map(n => ({ ...n, timestamp: new Date(n.timestamp) })))
            } else {
                setNotifications(seedMock())
            }
        } catch {
            setNotifications(seedMock())
        }
    }, [])

    useEffect(() => {
        try {
            const serializable = notifications.map(n => ({ ...n, timestamp: n.timestamp.toISOString() }))
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable))
        } catch {}
    }, [notifications])

    const unreadCount = notifications.filter(n => !n.read).length

    const addNotification = useCallback((data: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...data,
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            timestamp: new Date(),
            read: false
        }
        setNotifications(prev => [newNotification, ...prev])
    }, [])

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }, [])

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    const clearAllNotifications = useCallback(() => {
        setNotifications([])
    }, [])

    const notifyLowStock = useCallback((sku: string, qty: number) => {
        addNotification({
            title: 'Stock bajo detectado',
            message: `SKU ${sku} por debajo del mínimo (restan ${qty} unidades).`,
            type: 'warning',
            actionUrl: '/inventario'
        })
    }, [addNotification])

    const notifyInvoiceProcessed = useCallback((folio: string) => {
        addNotification({
            title: 'Factura procesada (OCR)',
            message: `Factura Nº ${folio} ingresada al inventario.`,
            type: 'success',
            actionUrl: '/OCR'
        })
    }, [addNotification])

    const notifyOCRFail = useCallback((folio?: string) => {
        addNotification({
            title: 'Fallo en OCR',
            message: folio ? `No se pudo leer la factura Nº ${folio}. Reintenta o corrige manualmente.` : 'No se pudo leer la factura. Reintenta o corrige manualmente.',
            type: 'error',
            actionUrl: '/ocr'
        })
    }, [addNotification])

    const notifyConfigChanged = useCallback((who?: string) => {
        addNotification({
            title: 'Configuración actualizada',
            message: who ? `Parámetros del sistema modificados por ${who}.` : 'Parámetros del sistema modificados.',
            type: 'info',
            actionUrl: '/configuracion'
        })
    }, [addNotification])

    const value: NotificationContextType = {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        notifyLowStock,
        notifyInvoiceProcessed,
        notifyOCRFail,
        notifyConfigChanged
    }

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
