'use client'

import React, { useMemo, useState } from 'react'
import {
    Box, Container, Typography, Card, Stack, TextField, InputAdornment, IconButton, Button, Chip,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TablePagination, Dialog,
    DialogTitle, DialogContent, DialogActions, Grid, MenuItem, Select, FormControl, InputLabel,
    CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

// 👇 Nuevo: usa tu servicio
import {
    listProducts,
    createProduct,
} from '@/services/inventory/api'
import type { StockProduct } from '@/services/inventory/types'

// Mismo tipo local para la tabla (mapea 1:1 con StockProduct)
type Item = StockProduct

function formatCLP(n: number) {
    return new Intl.NumberFormat('es-CL').format(n)
}

export default function InventoryPage() {
    // --- estado base ---
    const [rows, setRows] = useState<Item[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // --- filtros/orden/paginación ---
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState<string>('Todas')
    const [status, setStatus] = useState<string>('Todos')
    const [orderBy, setOrderBy] = useState<keyof Item>('name')
    const [order, setOrder] = useState<'asc' | 'desc'>('asc')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState<number>(5) // -1 = "Todos"

    // modal
    const [open, setOpen] = useState(false)

    // --- cargar datos desde API ---
    React.useEffect(() => {
        let alive = true
        ;(async () => {
            try {
                setLoading(true)
                const data = await listProducts()
                if (!alive) return
                setRows(data)
            } catch (e: any) {
                if (!alive) return
                setError(e?.message ?? 'Error al cargar inventario')
            } finally {
                if (alive) setLoading(false)
            }
        })()
        return () => {
            alive = false
        }
    }, [])

    const categories = useMemo(
        () => ['Todas', ...Array.from(new Set(rows.map(r => r.category)))],
        [rows]
    )
    const statuses = ['Todos', 'Activo', 'Inactivo']

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        return rows.filter(r => {
            const matchesQ = !q || r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)
            const matchesC = category === 'Todas' || r.category === category
            const matchesS = status === 'Todos' || r.status === status
            return matchesQ && matchesC && matchesS
        })
    }, [rows, query, category, status])

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const va = a[orderBy]
            const vb = b[orderBy]
            if (typeof va === 'number' && typeof vb === 'number') return order === 'asc' ? va - vb : vb - va
            const sa = String(va).toLowerCase()
            const sb = String(vb).toLowerCase()
            return order === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
        })
    }, [filtered, orderBy, order])

    const paged = useMemo(() => {
        if (rowsPerPage === -1) return sorted
        const start = page * rowsPerPage
        return sorted.slice(start, start + rowsPerPage)
    }, [sorted, page, rowsPerPage])

    const handleSort = (key: keyof Item) => {
        if (orderBy === key) setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
        else {
            setOrderBy(key)
            setOrder('asc')
        }
    }

    // --- UI ---
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Typography variant="h4" fontWeight={800}>Inventario</Typography>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                        Agregar producto
                    </Button>
                </Stack>
            </Stack>

            <Card sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(0) }}
                        placeholder="Buscar por nombre o SKU"
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={category}
                            label="Categoría"
                            onChange={(e) => { setCategory(e.target.value); setPage(0) }}
                        >
                            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={status}
                            label="Estado"
                            onChange={(e) => { setStatus(e.target.value); setPage(0) }}
                        >
                            {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
            </Card>

            <Card>
                {loading ? (
                    <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ py: 6, textAlign: 'center', color: 'error.main' }}>
                        {error}
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell onClick={() => handleSort('sku')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            SKU {orderBy === 'sku' ? (order === 'asc'
                                            ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Nombre {orderBy === 'name' ? (order === 'asc'
                                            ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell onClick={() => handleSort('category')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Categoría {orderBy === 'category' ? (order === 'asc'
                                            ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell align="right" onClick={() => handleSort('stock')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Stock {orderBy === 'stock' ? (order === 'asc'
                                            ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell align="right" onClick={() => handleSort('minStock')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Mínimo {orderBy === 'minStock' ? (order === 'asc'
                                            ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell align="right" onClick={() => handleSort('price')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Precio {orderBy === 'price' ? (order === 'asc'
                                            ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell align="center" onClick={() => handleSort('status')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Estado {orderBy === 'status' ? (order === 'asc'
                                            ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paged.map(r => {
                                        const low = r.stock < r.minStock
                                        return (
                                            <TableRow key={r.id} hover>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.sku}</TableCell>
                                                <TableCell sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</TableCell>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.category}</TableCell>
                                                <TableCell align="right">{r.stock}</TableCell>
                                                <TableCell align="right">{r.minStock}</TableCell>
                                                <TableCell align="right">${formatCLP(r.price)}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={low ? 'Bajo stock' : r.status}
                                                        color={low ? 'warning' : r.status === 'Activo' ? 'success' : 'default'}
                                                        size="small"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {paged.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>Sin resultados</Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={sorted.length}
                            page={rowsPerPage === -1 ? 0 : page}
                            onPageChange={(_, p) => setPage(p)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                const val = parseInt(e.target.value, 10)
                                setRowsPerPage(val)
                                setPage(0)
                            }}
                            rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                            labelRowsPerPage="Filas por página"
                            labelDisplayedRows={({ from, to, count }) =>
                                rowsPerPage === -1 ? `${count} de ${count}` : `${from}-${to} de ${count}`
                            }
                        />
                    </>
                )}
            </Card>

            <AddDialog
                open={open}
                onClose={() => setOpen(false)}
                onAdd={async (item) => {
                    // ✅ crear en backend y refrescar local
                    try {
                        const created = await createProduct(item)
                        setRows(prev => [created, ...prev])
                        setOpen(false)
                    } catch (e: any) {
                        alert(e?.message ?? 'Error al crear producto')
                    }
                }}
                // sku sugerido local (no bloqueante)
                nextSku={`TSK-${String(rows.length + 1).padStart(4, '0')}`}
            />
        </Container>
    )
}

function AddDialog({
                       open,
                       onClose,
                       onAdd,
                       nextSku
                   }: {
    open: boolean
    onClose: () => void
    onAdd: (item: Omit<Item, 'id'>) => Promise<void> | void
    nextSku: string
}) {
    const [sku, setSku] = useState(nextSku)
    const [name, setName] = useState('')
    const [category, setCategory] = useState('Alimentos')
    const [stock, setStock] = useState<number>(0)
    const [minStock, setMinStock] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    const [status, setStatus] = useState<'Activo' | 'Inactivo'>('Activo')

    React.useEffect(() => {
        if (open) setSku(nextSku)
    }, [open, nextSku])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Agregar producto
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ pt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select label="Estado" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                                    <MenuItem value="Activo">Activo</MenuItem>
                                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Categoría</InputLabel>
                                <Select label="Categoría" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <MenuItem value="Alimentos">Alimentos</MenuItem>
                                    <MenuItem value="Limpieza">Limpieza</MenuItem>
                                    <MenuItem value="Higiene">Higiene</MenuItem>
                                    <MenuItem value="Bebidas">Bebidas</MenuItem>
                                    <MenuItem value="Otros">Otros</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Stock"
                                value={stock}
                                onChange={(e) => setStock(Number(e.target.value))}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Mínimo"
                                value={minStock}
                                onChange={(e) => setMinStock(Number(e.target.value))}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Precio"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="text">Cancelar</Button>
                <Button
                    onClick={async () => {
                        if (!name.trim()) return
                        await onAdd({ sku, name: name.trim(), category, stock, minStock, price, status })
                    }}
                    variant="contained"
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
