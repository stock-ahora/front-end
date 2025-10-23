'use client'

import React from 'react'
import {
    Box, Container, Typography, Card, Stack, TextField, InputAdornment, Button, Chip,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TablePagination,
    CircularProgress, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

import { listProducts, createProduct } from '@/services/inventory/api'
import type { StockProduct } from '@/services/inventory/types'

type Item = StockProduct

function getStatusMeta(status?: string) {
    const s = (status ?? '').toUpperCase()
    if (s === 'ACTIVE') return { label: 'Activo', color: 'success' as const }
    if (s === 'INACTIVE') return { label: 'Inactivo', color: 'default' as const }
    return { label: status ?? 'Desconocido', color: 'warning' as const }
}

export default function InventoryPage() {
    const [rows, setRows] = React.useState<Item[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [query, setQuery] = React.useState('')
    const [status, setStatus] = React.useState<string>('Todos') // Todos | ACTIVE | INACTIVE
    const [orderBy, setOrderBy] = React.useState<keyof Item>('name')
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')

    const [page, setPage] = React.useState(0) // 0-based para MUI
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10) // -1 => Todos
    const [total, setTotal] = React.useState<number>(0)

    const [openCreate, setOpenCreate] = React.useState(false)

    async function fetchPage(p = page, size = rowsPerPage) {
        try {
            setLoading(true)
            setError(null)

            if (size === -1) {
                const first = await listProducts(1, 1)
                const all = await listProducts(1, first.total || 1000)
                const items = all.items
                const q = query.trim().toLowerCase()
                let filtered = items
                if (q) {
                    filtered = filtered.filter(r =>
                        (r.name ?? '').toLowerCase().includes(q) ||
                        (r.description ?? '').toLowerCase().includes(q)
                    )
                }
                if (status !== 'Todos') {
                    filtered = filtered.filter(r => (r.status ?? '').toUpperCase() === status)
                }
                const sorted = sortRows(filtered, orderBy, order)
                setRows(sorted)
                setTotal(all.total)
                return
            }

            const { items, total } = await listProducts(p + 1, size)

            const q = query.trim().toLowerCase()
            let filtered = items
            if (q) {
                filtered = filtered.filter(r =>
                    (r.name ?? '').toLowerCase().includes(q) ||
                    (r.description ?? '').toLowerCase().includes(q)
                )
            }
            if (status !== 'Todos') {
                filtered = filtered.filter(r => (r.status ?? '').toUpperCase() === status)
            }

            const sorted = sortRows(filtered, orderBy, order)
            setRows(sorted)
            setTotal(total)
        } catch (e: any) {
            setError(e?.message ?? 'Error al cargar inventario')
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => { fetchPage(0, rowsPerPage) }, []) // primera carga
    React.useEffect(() => { fetchPage(page, rowsPerPage) }, [page, rowsPerPage])
    React.useEffect(() => { fetchPage(page, rowsPerPage) }, [query, status, orderBy, order])

    const handleSort = (key: keyof Item) => {
        if (orderBy === key) setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
        else { setOrderBy(key); setOrder('asc') }
    }

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

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreate(true)}
                >
                    Agregar producto
                </Button>
            </Stack>

            <Card sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(0) }}
                        placeholder="Buscar por nombre o descripción"
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={status}
                            label="Estado"
                            onChange={(e) => { setStatus(e.target.value); setPage(0) }}
                        >
                            <MenuItem value="Todos">Todos</MenuItem>
                            <MenuItem value="ACTIVE">Activo</MenuItem>
                            <MenuItem value="INACTIVE">Inactivo</MenuItem>
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
                    <Box sx={{ py: 6, textAlign: 'center', color: 'error.main' }}>{error}</Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            onClick={() => handleSort('name')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Nombre {orderBy === 'name'
                                            ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />)
                                            : null}
                                        </TableCell>

                                        <TableCell>Descripción</TableCell>

                                        <TableCell
                                            align="right"
                                            onClick={() => handleSort('stock')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Stock {orderBy === 'stock'
                                            ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />)
                                            : null}
                                        </TableCell>

                                        <TableCell
                                            onClick={() => handleSort('status')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Estado {orderBy === 'status'
                                            ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />)
                                            : null}
                                        </TableCell>

                                        <TableCell
                                            onClick={() => handleSort('updated_at')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Actualizado {orderBy === 'updated_at'
                                            ? (order === 'asc' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />)
                                            : null}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {rows.map(r => {
                                        const meta = getStatusMeta(r.status)
                                        return (
                                            <TableRow key={r.id} hover>
                                                <TableCell sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {r.name}
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {r.description}
                                                </TableCell>
                                                <TableCell align="right">{r.stock}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={meta.label}
                                                        color={meta.color}
                                                        size="small"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {r.updated_at ? new Date(r.updated_at).toLocaleString('es-CL') : '—'}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}

                                    {rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                                                    Sin resultados
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
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
                    // Inserta el nuevo item arriba y refresca conteo
                    setRows(prev => [created, ...prev])
                    setTotal(t => t + 1)
                }}
            />
        </Container>
    )
}

/* ---------- helpers ---------- */

function sortRows(rows: Item[], orderBy: keyof Item, order: 'asc' | 'desc') {
    return [...rows].sort((a, b) => {
        let va: any = a[orderBy] as any
        let vb: any = b[orderBy] as any

        if (orderBy === 'updated_at' || orderBy === 'created_at') {
            const ta = va ? new Date(va).getTime() : 0
            const tb = vb ? new Date(vb).getTime() : 0
            return order === 'asc' ? ta - tb : tb - ta
        }

        if (typeof va === 'number' && typeof vb === 'number') {
            return order === 'asc' ? va - vb : vb - va
        }

        const sa = String(va ?? '').toLowerCase()
        const sb = String(vb ?? '').toLowerCase()
        return order === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
    })
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
            // ajusta el payload a lo que espera tu backend
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
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Descripción"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <TextField
                        label="Stock"
                        type="number"
                        inputProps={{ min: 0 }}
                        fullWidth
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={status}
                            label="Estado"
                            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                        >
                            <MenuItem value="ACTIVE">Activo</MenuItem>
                            <MenuItem value="INACTIVE">Inactivo</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="text">Cancelar</Button>
                <Button onClick={handleSave} variant="contained" disabled={submitting}>
                    {submitting ? 'Guardando…' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
