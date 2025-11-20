import type { Metadata } from 'next'
import Providers from './providers'
import { primaryFont } from '@/themes/typography'
import { GlobalSplash } from '@/components/globalSpalsh'

export const metadata: Metadata = {
    title: 'Stock Ahora',
    icons: {
        icon: '/icon-192x192',
        shortcut: '/icon-192x192.png'
    },
    description: 'Gestión de inventario fácil',
    manifest: '/manifest.json'
}

export default function RootLayout({
                                       children
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" className={primaryFont.className}>
        <body>
        <Providers>
            <GlobalSplash />
            {children}
        </Providers>
        </body>
        </html>
    )
}
