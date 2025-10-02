'use client'

import './globals.css'
import React from 'react'
import { primaryFont } from '@/themes/typography'
import { SettingsProvider } from '@/components/settings/context/settings-provider'
import { SnackbarProvider } from '@/components/snackbar'
import { Layout } from '@/components/layouts'

import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '@/themes/theme'
import { AuthProvider } from '@/auth/AuthProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const app = (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* resetea estilos y aplica background */}
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
          <AuthProvider>

          <Layout>
            <div>{children}</div>
          </Layout>
          </AuthProvider>

        </SettingsProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )

  return (
    <html lang="es" className={primaryFont.className}>
    <body>

    {app}
    </body>

    </html>
  )
}
