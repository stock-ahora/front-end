'use client'

import React from 'react'
import {
    Box, Container, Typography, Card, Stack, TextField, InputAdornment, Button, Chip,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TablePagination,
    CircularProgress, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, Avatar
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { alpha, useTheme } from '@mui/material/styles'

import { listProducts, createProduct } from '@/services/inventory/api'
import type { StockProduct } from '@/services/inventory/types'

type Item = StockProduct & {
    id?: string | number
    product_id?: string | number
    name?: string
    description?: string
    stock?: number
    status?: string
    updated_at?: string
    updatedAt?: string
    created_at?: string
    createdAt?: string
}

type NormalizedItem = {
    id: string
    name: string
    description: string
    stock: number
    status: string
    updated_at?: string
    created_at?: string
}

type Movement = {
    count: number
    date_limit?: string | null
    type: 'entrada' | 'salida'
    created_at?: string | null
    updated_at?: string | null
}

const COLORS = {
    primary: '#104D73',
    secondary: '#13B3F2',
    accent: '#F2BF80',
    success: '#829B71',
    dark: '#262626'
}

const DEMO_PRODUCT: NormalizedItem = {
    id: 'DEMO-001',
    name: 'Demo – Lápiz HB #2',
    description: 'Producto de ejemplo para vista detallada',
    stock: 42,
    status: 'ACTIVE',
    updated_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
}

function getStatusMeta(status?: string) {
    const s = String(status ?? '').toUpperCase()
    if (s === 'ACTIVE') return { label: 'Activo', color: 'success' as const }
    if (s === 'INACTIVE') return { label: 'Inactivo', color: 'default' as const }
    return { label: status ?? 'Desconocido', color: 'warning' as const }
}

function normalizeItem(r: Item): NormalizedItem {
    const idRaw = (r.id ?? r.product_id ?? '') as string | number
    const id = String(idRaw)
    return {
        id,
        name: String(r.name ?? ''),
        description: String(r.description ?? ''),
        stock: Number(r.stock ?? 0),
        status: String(r.status ?? ''),
        updated_at: (r.updated_at ?? r.updatedAt) as string | undefined,
        created_at: (r.created_at ?? r.createdAt) as string | undefined
    }
}

function sortRows(rows: NormalizedItem[], orderBy: keyof NormalizedItem, order: 'asc' | 'desc') {
    return [...rows].sort((a, b) => {
        const va = (a as any)[orderBy]
        const vb = (b as any)[orderBy]
        if (orderBy === 'updated_at' || orderBy === 'created_at') {
            const ta = va ? new Date(va).getTime() : 0
            const tb = vb ? new Date(vb).getTime() : 0
            return order === 'asc' ? ta - tb : tb - ta
        }
        if (orderBy === 'stock') {
            const na = Number(va ?? 0)
            const nb = Number(vb ?? 0)
            return order === 'asc' ? na - nb : nb - na
        }
        const sa = String(va ?? '').toLowerCase()
        const sb = String(vb ?? '').toLowerCase()
        return order === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
    })
}

export default function InventoryPage() {
    const [rows, setRows] = React.useState<NormalizedItem[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [query, setQuery] = React.useState('')
    const [status, setStatus] = React.useState<string>('Todos')
    const [orderBy, setOrderBy] = React.useState<keyof NormalizedItem>('name')
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10)
    const [total, setTotal] = React.useState<number>(0)

    const [openCreate, setOpenCreate] = React.useState(false)
    const [detailOpen, setDetailOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<NormalizedItem | null>(null)

    async function fetchPage(p = page, size = rowsPerPage) {
        try {
            setLoading(true)
            setError(null)
            if (size === -1) {
                const first = await listProducts(1, 1)
                const all = await listProducts(1, first.total || 1000)
                const items = (all.items || []).map(normalizeItem)
                const q = query.trim().toLowerCase()
                let filtered = items
                if (q) filtered = filtered.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
                if (status !== 'Todos') {
                    const target = status.toUpperCase()
                    filtered = filtered.filter(r => r.status.toUpperCase() === target)
                }
                const sorted = sortRows(filtered, orderBy, order)
                if (sorted.length === 0) {
                    setRows([DEMO_PRODUCT])
                    setTotal(1)
                } else {
                    setRows(sorted)
                    setTotal(sorted.length)
                }
                return
            }
            const resp = await listProducts(p + 1, size)
            const normalized = (resp.items || []).map(normalizeItem)
            const q = query.trim().toLowerCase()
            let filtered = normalized
            if (q) filtered = filtered.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
            if (status !== 'Todos') {
                const target = status.toUpperCase()
                filtered = filtered.filter(r => r.status.toUpperCase() === target)
            }
            const sorted = sortRows(filtered, orderBy, order)
            if ((q || status !== 'Todos') && sorted.length === 0) {
                setRows([DEMO_PRODUCT])
                setTotal(1)
            } else if (!q && status === 'Todos' && sorted.length === 0) {
                setRows([DEMO_PRODUCT])
                setTotal(1)
            } else {
                setRows(sorted)
                setTotal(q || status !== 'Todos' ? sorted.length : resp.total)
            }
        } catch (e: any) {
            setRows([DEMO_PRODUCT])
            setTotal(1)
            setError(null)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => { fetchPage(0, rowsPerPage) }, [])
    React.useEffect(() => { fetchPage(page, rowsPerPage) }, [page, rowsPerPage])
    React.useEffect(() => { setPage(0); fetchPage(0, rowsPerPage) }, [query, status, orderBy, order])

    const handleSort = (key: keyof NormalizedItem) => {
        if (orderBy === key) setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
        else { setOrderBy(key); setOrder('asc') }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight={800}>Inventario</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>Agregar producto</Button>
            </Stack>

            <Card sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por nombre o descripción"
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Estado</InputLabel>
                        <Select value={status} label="Estado" onChange={(e) => setStatus(e.target.value)}>
                            <MenuItem value="Todos">Todos</MenuItem>
                            <MenuItem value="ACTIVE">Activo</MenuItem>
                            <MenuItem value="INACTIVE">Inactivo</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Card>

            <Card>
                {loading ? (
                    <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
                ) : error ? (
                    <Box sx={{ py: 6, textAlign: 'center', color: 'error.main' }}>{error}</Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell onClick={() => handleSort('id')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            ID {orderBy === 'id' ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Nombre {orderBy === 'name' ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell align="right" onClick={() => handleSort('stock')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Stock {orderBy === 'stock' ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Estado {orderBy === 'status' ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                        <TableCell onClick={() => handleSort('updated_at')} sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                            Actualizado {orderBy === 'updated_at' ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />) : null}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {rows.map(r => {
                                        const meta = getStatusMeta(r.status)
                                        return (
                                            <TableRow key={r.id} hover sx={{ cursor: 'pointer' }} onClick={() => { setSelected(r); setDetailOpen(true) }}>
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.id}</TableCell>
                                                <TableCell sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name || '—'}</TableCell>
                                                <TableCell sx={{ maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.description || '—'}</TableCell>
                                                <TableCell align="right">{Number.isFinite(r.stock) ? r.stock : 0}</TableCell>
                                                <TableCell><Chip label={meta.label} color={meta.color} size="small" sx={{ fontWeight: 700 }} /></TableCell>
                                                <TableCell>{r.updated_at ? new Date(r.updated_at).toLocaleString('es-CL') : '—'}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={rowsPerPage === -1 ? rows.length : total}
                            page={rowsPerPage === -1 ? 0 : page}
                            onPageChange={(_, p) => setPage(p)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                const val = parseInt(e.target.value, 10)
                                setRowsPerPage(val)
                                setPage(0)
                            }}
                            rowsPerPageOptions={[5, 10, 25, 50, { label: 'Todos', value: -1 }]}
                            labelRowsPerPage="Filas por página"
                            labelDisplayedRows={({ from, to, count }) =>
                                rowsPerPage === -1 ? `${rows.length} de ${rows.length}` : `${from}-${to} de ${count}`
                            }
                        />
                    </>
                )}
            </Card>

            <CreateProductDialog
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={(created) => {
                    const n = normalizeItem(created as Item)
                    setRows(prev => sortRows([n, ...prev], orderBy, order))
                    setTotal(t => t + 1)
                }}
            />

            <ProductDetailDialog open={detailOpen} onClose={() => setDetailOpen(false)} product={selected} />
        </Container>
    )
}

function CreateProductDialog({
                                 open,
                                 onClose,
                                 onCreated,
                             }: {
    open: boolean
    onClose: () => void
    onCreated: (item: Item) => void
}) {
    const [name, setName] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [stock, setStock] = React.useState<number>(0)
    const [status, setStatus] = React.useState<'ACTIVE' | 'INACTIVE'>('ACTIVE')
    const [submitting, setSubmitting] = React.useState(false)

    React.useEffect(() => {
        if (open) {
            setName('')
            setDescription('')
            setStock(0)
            setStatus('ACTIVE')
            setSubmitting(false)
        }
    }, [open])

    async function handleSave() {
        if (!name.trim()) return
        try {
            setSubmitting(true)
            const created = await createProduct({
                name: name.trim(),
                description: description.trim(),
                stock,
                status,
            } as any)
            onCreated(created as Item)
            onClose()
        } catch (e: any) {
            alert(e?.message ?? 'Error al crear producto')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Agregar producto
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField label="Nombre" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Descripción" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} />
                    <TextField label="Stock" type="number" inputProps={{ min: 0 }} fullWidth value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                    <FormControl fullWidth>
                        <InputLabel>Estado</InputLabel>
                        <Select value={status} label="Estado" onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}>
                            <MenuItem value="ACTIVE">Activo</MenuItem>
                            <MenuItem value="INACTIVE">Inactivo</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="text">Cancelar</Button>
                <Button onClick={handleSave} variant="contained" disabled={submitting}>{submitting ? 'Guardando…' : 'Guardar'}</Button>
            </DialogActions>
        </Dialog>
    )
}

function ProductDetailDialog({
                                 open,
                                 onClose,
                                 product
                             }: {
    open: boolean
    onClose: () => void
    product: NormalizedItem | null
}) {
    const theme = useTheme()
    const [loading, setLoading] = React.useState(false)
    const [movements, setMovements] = React.useState<Movement[]>([])

    React.useEffect(() => {
        let mounted = true
        async function load() {
            if (!product) return
            setLoading(true)
            try {
                const now = Date.now()
                const ex: Movement[] = [
                    { count: 3, date_limit: new Date(now + 3 * 24 * 3600 * 1000).toISOString(), type: 'entrada', created_at: new Date(now - 12 * 3600 * 1000).toISOString(), updated_at: new Date(now - 6 * 3600 * 1000).toISOString() },
                    { count: 1, date_limit: null, type: 'salida', created_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString(), updated_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString() },
                    { count: 2, date_limit: new Date(now + 10 * 24 * 3600 * 1000).toISOString(), type: 'entrada', created_at: new Date(now - 7 * 24 * 3600 * 1000).toISOString(), updated_at: new Date(now - 7 * 24 * 3600 * 1000).toISOString() }
                ]
                if (mounted) setMovements(ex)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        if (open) load()
        return () => { mounted = false }
    }, [open, product])

    const meta = getStatusMeta(product?.status)
    const glass = {
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
        backdropFilter: 'blur(18px)',
        border: `1px solid ${alpha(COLORS.primary, 0.12)}`,
        borderRadius: 3,
        boxShadow: `0 8px 28px ${alpha(COLORS.primary, 0.14)}`
    }

    if (!product) return null

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { maxHeight: '92vh' } }}>
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(COLORS.dark, 0.08)}`, background: `linear-gradient(135deg, ${alpha(COLORS.primary, 0.06)} 0%, ${alpha(COLORS.secondary, 0.04)} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: COLORS.primary, width: 44, height: 44 }}>{product.name?.[0]?.toUpperCase() || 'P'}</Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={800}>{product.name || 'Producto'}</Typography>
                            <Typography variant="body2" sx={{ color: alpha(COLORS.dark, 0.7) }}>ID {product.id}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={meta.label} color={meta.color} size="small" sx={{ fontWeight: 700 }} />
                        <IconButton onClick={onClose}><CloseIcon /></IconButton>
                    </Stack>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                    <Card sx={{ ...glass, mb: 2 }}>
                        <Box sx={{ p: 2 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                                <Stack direction="row" spacing={3}>
                                    <Stack>
                                        <Typography variant="caption" sx={{ color: alpha(COLORS.dark, 0.6) }}>Stock</Typography>
                                        <Typography variant="h6" fontWeight={800}>{product.stock}</Typography>
                                    </Stack>
                                    <Stack>
                                        <Typography variant="caption" sx={{ color: alpha(COLORS.dark, 0.6) }}>Actualizado</Typography>
                                        <Typography variant="body1">{product.updated_at ? new Date(product.updated_at).toLocaleString('es-CL') : '—'}</Typography>
                                    </Stack>
                                </Stack>
                                <Typography variant="body2" sx={{ maxWidth: 520, color: alpha(COLORS.dark, 0.8) }}>{product.description || 'Sin descripción'}</Typography>
                            </Stack>
                        </Box>
                    </Card>

                    <Card sx={{ ...glass }}>
                        <Box sx={{ p: 2, pb: 0 }}>
                            <Typography variant="subtitle1" fontWeight={800}>Movimientos</Typography>
                            <Typography variant="body2" sx={{ color: alpha(COLORS.dark, 0.7) }}>Historial agregado por producto</Typography>
                        </Box>

                        <TableContainer sx={{ maxHeight: 380 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Count</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Fecha límite</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Tipo</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Creado</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Actualizado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Box sx={{ py: 4 }}><CircularProgress size={24} /></Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : movements.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Box sx={{ py: 4, color: 'text.secondary' }}>Sin movimientos</Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : movements.map((m, i) => (
                                        <TableRow key={i} hover>
                                            <TableCell>{m.count}</TableCell>
                                            <TableCell>{m.date_limit ? new Date(m.date_limit).toLocaleString('es-CL') : '—'}</TableCell>
                                            <TableCell>
                                                <Chip label={m.type === 'entrada' ? 'Entrada' : 'Salida'} size="small" color={m.type === 'entrada' ? 'success' : 'warning'} sx={{ fontWeight: 700 }} />
                                            </TableCell>
                                            <TableCell>{m.created_at ? new Date(m.created_at).toLocaleString('es-CL') : '—'}</TableCell>
                                            <TableCell>{m.updated_at ? new Date(m.updated_at).toLocaleString('es-CL') : '—'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button variant="contained" onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    )
}
