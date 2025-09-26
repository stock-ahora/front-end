'use client'

import React from 'react'
import Link from 'next/link'

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* navbar simple */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="font-bold text-primary flex items-center gap-2">
                        <i className="fa-solid fa-boxes" />
                        TrueStock
                    </Link>
                    <nav className="flex gap-3">
                        <Link href="/" className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm">Dashboard</Link>
                        <Link href="/inventario" className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm">Inventario</Link>
                    </nav>
                </div>
            </header>

            <main>{children}</main>

            <footer className="border-t border-border mt-10">
                <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500">
                    © {new Date().getFullYear()} TrueStock
                </div>
            </footer>
        </div>
    )
}
