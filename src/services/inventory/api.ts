import type { StockProduct } from './types'

type BackendProduct = {
    id: string
    referencial_id: string
    name: string
    description: string
    stock: number
    status: string
    client_account_id: string
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
        referencial_id: p.referencial_id,
        name: p.name,
        description: p.description,
        stock: p.stock,
        status: p.status,
        client_account_id: p.client_account_id,
        created_at: p.created_at,
        updated_at: p.updated_at,
    }
}

export async function listProducts(page = 1, size = 10) {
    const r = await fetch(`/api/stock/products?page=${page}&size=${size}`, { cache: 'no-store' })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) {
        const msg = typeof j?.error === 'string' ? j.error : j?.error ? JSON.stringify(j.error) : `HTTP ${r.status}`
        throw new Error(msg)
    }
    const items = (j.data ?? []) as any[]
    return { items, total: j.total ?? 0, page: j.page ?? page, size: j.size ?? size, total_pages: j.total_pages ?? 0 }
}


export async function createProduct(_p: Omit<StockProduct, 'id'>) {
    throw new Error('El backend no expone POST /api/v1/stock/product. Deshabilita “Agregar producto” por ahora.')
}
