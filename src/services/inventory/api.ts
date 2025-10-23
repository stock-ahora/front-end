import type { StockProduct } from './types'

type BackendProduct = {
    id: string
    referencial_id: string
    name: string
    description: string
    stock: number
    status: string
    created_at: string
    updated_at: string
}

type PageResp = {
    data: BackendProduct[]
    total: number
    page: number
    size: number
    total_pages: number
}

function toStockProduct(p: BackendProduct): StockProduct {
    return {
        id: p.id,
        // placeholders mientras el backend no expone estos campos:
        sku: '',
        category: '—',
        minStock: 0,
        price: 0,
        name: p.name,
        stock: p.stock,
        status: p.status === 'Activo' || p.status === 'Inactivo' ? (p.status as 'Activo'|'Inactivo') : 'Activo',
    }
}

export async function listProducts(page = 1, size = 20): Promise<{ items: StockProduct[]; total: number; page: number; size: number; total_pages: number }> {
    const r = await fetch(`/api/stock/products?page=${page}&size=${size}`, { cache: 'no-store' })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) {
        const msg =
            typeof j?.error === 'string' ? j.error :
                j?.error ? JSON.stringify(j.error) :
                    `HTTP ${r.status}`
        throw new Error(msg)
    }
    const pageResp = j as { ok: true } & PageResp
    const items = (pageResp.data ?? []).map(toStockProduct)
    return { items, total: pageResp.total, page: pageResp.page, size: pageResp.size, total_pages: pageResp.total_pages }
}

export async function createProduct(_p: Omit<StockProduct,'id'>) {
    throw new Error('El backend actual no expone POST /api/v1/stock/product. Deshabilita “Agregar producto” por ahora.')
}
