export type StockProduct = {
    id: string | number
    sku: string
    name: string
    category: string
    stock: number
    // minStock: number
    // price: number
    status: 'Activo' | 'Inactivo'
}
