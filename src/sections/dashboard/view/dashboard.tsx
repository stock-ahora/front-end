'use client'

import { useMemo } from 'react'

export default function TrueStockMobile() {
    const periodBanner = useMemo(() => ({ text: 'Quedan ¼ de Aspirinas', sub: 'Nuevas recomendaciones' }), [])

    return (
        <div className="min-h-screen w-full grid place-items-center bg-gradient-to-br from-primary/10 via-white to-sky-50 px-4 py-10">
            <div className="relative w-[390px] max-w-full">
                <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-[3rem]" />
                <div className="relative mx-auto bg-black rounded-[3rem] p-2 shadow-2xl">
                    <div className="mx-auto bg-white rounded-[2.5rem] overflow-hidden min-h-[720px]">
                        <div className="h-6 grid place-items-center bg-black/90 text-white">
                            <div className="h-1.5 w-24 rounded-full bg-white/20" />
                        </div>

                        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
                            <i className="fa-solid fa-bars text-xl text-slate-700" />
                            <i className="fa-regular fa-bell text-xl text-slate-700" />
                        </div>

                        <div className="px-6">
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight">Hola buenas tardes</h2>
                            <p className="text-3xl font-extrabold text-slate-900 -mt-1">Emilia</p>
                        </div>

                        <div className="px-6 mt-6 grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-green-400 text-slate-900 shadow-[0_8px_30px_rgba(16,185,129,.25)] p-4 relative">
                                <div className="absolute -top-2 -left-2 text-2xl">📦</div>
                                <div className="text-2xl font-extrabold tracking-tight">1.245</div>
                                <div className="text-xs mt-1 opacity-80">Productos en inventario</div>
                            </div>
                            <div className="rounded-2xl bg-rose-400 text-slate-900 shadow-[0_8px_30px_rgba(244,63,94,.25)] p-4 relative">
                                <div className="absolute -top-2 -left-2 text-2xl">🚨</div>
                                <div className="text-2xl font-extrabold tracking-tight">15</div>
                                <div className="text-xs mt-1 opacity-80">Productos en nivel bajo</div>
                            </div>
                            <div className="rounded-2xl bg-blue-500 text-white shadow-[0_8px_30px_rgba(59,130,246,.25)] p-4 relative">
                                <div className="absolute -top-2 -left-2 text-2xl">🧾</div>
                                <div className="text-2xl font-extrabold tracking-tight">87</div>
                                <div className="text-xs mt-1/ opacity-80">Este mes</div>
                            </div>
                            <div className="rounded-2xl bg-amber-300 text-slate-900 shadow-[0_8px_30px_rgba(245,158,11,.25)] p-4 relative">
                                <div className="absolute -top-2 -left-2 text-2xl">⏳</div>
                                <div className="text-2xl font-extrabold tracking-tight">12</div>
                                <div className="text-xs mt-1 opacity-80">Pendientes</div>
                            </div>
                        </div>

                        <div className="px-6 mt-8">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold text-slate-900">Resumen rápido</div>
                                    <div className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary">Hoy</div>
                                </div>
                                <div className="mt-3 grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                                        <div className="text-lg font-bold text-slate-900">4</div>
                                        <div className="text-[11px] text-slate-500">Ingresos</div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                                        <div className="text-lg font-bold text-slate-900">2</div>
                                        <div className="text-[11px] text-slate-500">Bajas</div>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                                        <div className="text-lg font-bold text-slate-900">5</div>
                                        <div className="text-[11px] text-slate-500">Alertas</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 mt-4 mb-24">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <div className="font-semibold text-slate-900">Notificaciones</div>
                                <div className="mt-3 space-y-2">
                                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">Producto X en nivel crítico</div>
                                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">Factura Nº123 procesada</div>
                                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">Reposición sugerida para SKU 445</div>
                                </div>
                            </div>
                        </div>

                        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 w-[calc(100%-3rem)]">
                            <div className="rounded-2xl bg-amber-300 text-slate-900 px-4 py-3 shadow-lg">
                                <div className="flex items-start gap-3">
                                    <div className="text-xl">🔔</div>
                                    <div className="text-sm">
                                        <div className="font-semibold">{periodBanner.text}</div>
                                        <div className="text-slate-700/80">{periodBanner.sub}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-6 grid place-items-center bg-black/90 text-white">
                            <div className="h-1 w-16 rounded-full bg-white/20" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
