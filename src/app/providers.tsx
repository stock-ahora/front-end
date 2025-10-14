'use client'

import './globals.css'
import React from 'react'
import { SettingsProvider } from '@/components/settings/context/settings-provider'
import { SnackbarProvider } from '@/components/snackbar'
import { Layout } from '@/components/layouts'

// 👉 importa tu theme
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from '@/themes/theme'
import { AuthProvider } from '@/auth/AuthProvider'


export default function Providers({ children }: { children: React.ReactNode }) {


  return (
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
}
