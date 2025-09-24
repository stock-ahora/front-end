'use client'

import './globals.css'
import React from 'react'
import { primaryFont } from '@/themes/typography'
import { SettingsProvider } from '@/components/settings/context/settings-provider'
import { SnackbarProvider } from '@/components/snackbar'
import { NotificationProvider } from '@/context/NotificationContext'
import { Layout } from '@/components/layouts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const app = (
        <SnackbarProvider>
            <SettingsProvider
                defaultSettings={{
                    themeMode: 'light',
                    themeDirection: 'ltr',
                    themeContrast: 'default',
                    themeLayout: 'vertical',
                    themeColorPresets: 'default',
                    themeStretch: false,
                }}
            >
                <NotificationProvider>
                    <Layout>
                        <div>{children}</div>
                    </Layout>
                </NotificationProvider>
            </SettingsProvider>
        </SnackbarProvider>
    )

    return (
        <html lang="es" className={primaryFont.className}>
        <head />
        <body>{app}</body>
        </html>
    )
}
