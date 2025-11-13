'use client'

import React from 'react'
import {
    Box,
    Container,
    Typography,
    Card,
    Stack,
    TextField,
    InputAdornment,
    Button,
    Chip,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    TablePagination,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { alpha, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'

const COLORS = {
    primary: '#104D73',
    secondary: '#13B3F2',
    accent: '#F2BF80',
    success: '#829B71',
    dark: '#262626'
}

type RawRequest = {
    id?: string
    ID?: string
    request_type?: string
    type?: string
    status?: string
    created_at?: string
    createdAt?: string
    updated_at?: string
    updatedAt?: string
    movements?: any[]
}

type NormalizedRequest = {
    id: string
    type: string
    status: string
    created_at?: string
    updated_at?: string
    movements_count: number
}

type Movement = {
    id: string
    nombre: string
    count: number
    created_at?: string
    updated_at?: string
}

type RequestDetail = {
    id: string
    request_type: string
    status: string
    created_at?: string
    updated_at?: string
    client_account_id?: string
    movements: Movement[]
}

function normalizeRequest(r: RawRequest): NormalizedRequest {
    const rawId = (r.id ?? r.ID ?? '') as string
    const typeRaw = (r.request_type ?? r.type ?? '').toString().toLowerCase()
    const statusRaw = (r.status ?? '').toString().toLowerCase()
    const created = (r.created_at ?? r.createdAt) as string | undefined
    const updated = (r.updated_at ?? r.updatedAt) as string | undefined
    const movementsCount = Array.isArray(r.movements) ? r.movements.length : 0

    return {
        id: String(rawId),
        type: typeRaw,
        status: statusRaw,
        created_at: created,
        updated_at: updated,
        movements_count: movementsCount
    }
}

function sortRequests(rows: NormalizedRequest[], orderBy: keyof NormalizedRequest, order: 'asc' | 'desc') {
    return [...rows].sort((a, b) => {
        const va = (a as any)[orderBy]
        const vb = (b as any)[orderBy]

        if (orderBy === 'created_at' || orderBy === 'updated_at') {
            const ta = va ? new Date(va).getTime() : 0
            const tb = vb ? new Date(vb).getTime() : 0
            return order === 'asc' ? ta - tb : tb - ta
        }

        if (orderBy === 'movements_count') {
            const na = Number(va ?? 0)
            const nb = Number(vb ?? 0)
            return order === 'asc' ? na - nb : nb - na
        }

        const sa = String(va ?? '').toLowerCase()
        const sb = String(vb ?? '').toLowerCase()
        return order === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
    })
}

function getStatusMeta(status: string) {
    const s = status.toUpperCase()
    if (s === 'PENDING') return { label: 'Pendiente', color: 'warning' as const }
    if (s === 'APPROVED') return { label: 'Aprobada', color: 'success' as const }
    if (s === 'REJECTED') return { label: 'Rechazada', color: 'error' as const }
    return { label: status || 'Desconocido', color: 'default' as const }
}

function getTypeMeta(type: string) {
    const t = type.toLowerCase()
    if (t === 'in') return { label: 'IN', color: 'success' as const }
    if (t === 'out') return { label: 'OUT', color: 'info' as const }
    return { label: type || '—', color: 'default' as const }
}

export default function OCRRequestsPage() {
    const router = useRouter()

    const [rows, setRows] = React.useState<NormalizedRequest[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [query, setQuery] = React.useState('')
    const [statusFilter, setStatusFilter] = React.useState<string>('Todos')
    const [typeFilter, setTypeFilter] = React.useState<string>('Todos')
    const [orderBy, setOrderBy] = React.useState<keyof NormalizedRequest>('created_at')
    const [order, setOrder] = React.useState<'asc' | 'desc'>('desc')

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(10)
    const [total, setTotal] = React.useState<number>(0)

    const [detailOpen, setDetailOpen] = React.useState(false)
    const [selectedId, setSelectedId] = React.useState<string | null>(null)

    async function fetchPage(p = page, size = rowsPerPage) {
        try {
            setLoading(true)
            setError(null)

            const baseUrl = 'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/stock/request'
            const url = new URL(baseUrl)

            if (size !== -1) {
                url.searchParams.set('page', String(p + 1))
                url.searchParams.set('size', String(size))
            }

            const res = await fetch(url.toString(), {
                headers: {
                    'X-Client-Account-Id': '8d1b88f0-e5c7-4670-8bbb-3045f9ab3995'
                }
            })

            if (!res.ok) {
                const txt = await res.text()
                throw new Error(txt || 'Error al obtener solicitudes')
            }

            const json = await res.json()
            const list = (json.items ?? json.data ?? []) as RawRequest[]
            const normalized = list.map(normalizeRequest)

            const q = query.trim().toLowerCase()
            let filtered = normalized

            if (q) {
                filtered = filtered.filter(r => r.id.toLowerCase().includes(q))
            }
            if (statusFilter !== 'Todos') {
                const target = statusFilter.toLowerCase()
                filtered = filtered.filter(r => r.status.toLowerCase() === target)
            }
            if (typeFilter !== 'Todos') {
                const target = typeFilter.toLowerCase()
                filtered = filtered.filter(r => r.type.toLowerCase() === target)
            }

            const sorted = sortRequests(filtered, orderBy, order)

            if (size === -1) {
                setRows(sorted)
                setTotal(sorted.length)
            } else {
                setRows(sorted)
                const backendTotal = json.total ?? json.count ?? sorted.length
                const effectiveTotal = q || statusFilter !== 'Todos' || typeFilter !== 'Todos' ? sorted.length : backendTotal
                setTotal(effectiveTotal)
            }
        } catch (e: any) {
            setError(e?.message ?? 'Error inesperado')
            setRows([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchPage(0, rowsPerPage)
    }, [])

    React.useEffect(() => {
        fetchPage(page, rowsPerPage)
    }, [page, rowsPerPage])

    React.useEffect(() => {
        setPage(0)
        fetchPage(0, rowsPerPage)
    }, [query, statusFilter, typeFilter, orderBy, order])

    const handleSort = (key: keyof NormalizedRequest) => {
        if (orderBy === key) setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
        else {
            setOrderBy(key)
            setOrder('asc')
        }
    }

    const handleOpenDetail = (id: string) => {
        setSelectedId(id)
        setDetailOpen(true)
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
                <Typography variant="h4" fontWeight={800}>
                    Solicitudes OCR
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/invoice/add')}
                >
                    Agregar factura
                </Button>
            </Stack>

            <Card sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                        fullWidth
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar por ID de solicitud"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Estado"
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="Todos">Todos</MenuItem>
                            <MenuItem value="pending">Pendiente</MenuItem>
                            <MenuItem value="approved">Aprobada</MenuItem>
                            <MenuItem value="rejected">Rechazada</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                            value={typeFilter}
                            label="Tipo"
                            onChange={e => setTypeFilter(e.target.value)}
                        >
                            <MenuItem value="Todos">Todos</MenuItem>
                            <MenuItem value="in">IN</MenuItem>
                            <MenuItem value="out">OUT</MenuItem>
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
                                            onClick={() => handleSort('id')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            ID{' '}
                                            {orderBy === 'id'
                                                ? order === 'asc'
                                                    ? <ArrowUpwardIcon fontSize="inherit" />
                                                    : <ArrowDownwardIcon fontSize="inherit" />
                                                : null}
                                        </TableCell>
                                        <TableCell
                                            onClick={() => handleSort('type')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Tipo{' '}
                                            {orderBy === 'type'
                                                ? order === 'asc'
                                                    ? <ArrowUpwardIcon fontSize="inherit" />
                                                    : <ArrowDownwardIcon fontSize="inherit" />
                                                : null}
                                        </TableCell>
                                        <TableCell
                                            onClick={() => handleSort('status')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Estado{' '}
                                            {orderBy === 'status'
                                                ? order === 'asc'
                                                    ? <ArrowUpwardIcon fontSize="inherit" />
                                                    : <ArrowDownwardIcon fontSize="inherit" />
                                                : null}
                                        </TableCell>
                                        <TableCell
                                            onClick={() => handleSort('created_at')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Creado{' '}
                                            {orderBy === 'created_at'
                                                ? order === 'asc'
                                                    ? <ArrowUpwardIcon fontSize="inherit" />
                                                    : <ArrowDownwardIcon fontSize="inherit" />
                                                : null}
                                        </TableCell>
                                        <TableCell
                                            onClick={() => handleSort('updated_at')}
                                            sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                                        >
                                            Actualizado{' '}
                                            {orderBy === 'updated_at'
                                                ? order === 'asc'
                                                    ? <ArrowUpwardIcon fontSize="inherit" />
                                                    : <ArrowDownwardIcon fontSize="inherit" />
                                                : null}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(r => {
                                        const statusMeta = getStatusMeta(r.status)
                                        const typeMeta = getTypeMeta(r.type)
                                        return (
                                            <TableRow
                                                key={r.id}
                                                hover
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => handleOpenDetail(r.id)}
                                            >
                                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                    {r.id.slice(0, 8)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={typeMeta.label}
                                                        color={typeMeta.color}
                                                        size="small"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={statusMeta.label}
                                                        color={statusMeta.color}
                                                        size="small"
                                                        sx={{ fontWeight: 700 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {r.created_at
                                                        ? new Date(r.created_at).toLocaleString('es-CL')
                                                        : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {r.updated_at
                                                        ? new Date(r.updated_at).toLocaleString('es-CL')
                                                        : '—'}
                                                </TableCell>
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
                            onRowsPerPageChange={e => {
                                const val = parseInt(e.target.value, 10)
                                setRowsPerPage(val)
                                setPage(0)
                            }}
                            rowsPerPageOptions={[5, 10, 25, 50, { label: 'Todos', value: -1 }]}
                            labelRowsPerPage="Filas por página"
                            labelDisplayedRows={({ from, to, count }) =>
                                rowsPerPage === -1
                                    ? `${rows.length} de ${rows.length}`
                                    : `${from}-${to} de ${count}`
                            }
                        />
                    </>
                )}
            </Card>

            <RequestDetailDialog
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                requestId={selectedId}
            />
        </Container>
    )
}

function RequestDetailDialog({
                                 open,
                                 onClose,
                                 requestId
                             }: {
    open: boolean
    onClose: () => void
    requestId: string | null
}) {
    const theme = useTheme()
    const [loading, setLoading] = React.useState(false)
    const [detail, setDetail] = React.useState<RequestDetail | null>(null)

    React.useEffect(() => {
        let cancelled = false

        async function load() {
            if (!open || !requestId) return
            setLoading(true)
            try {
                const res = await fetch(
                    `https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/stock/request/${requestId}`,
                    {
                        headers: {
                            'X-Client-Account-Id': '8d1b88f0-e5c7-4670-8bbb-3045f9ab3995'
                        }
                    }
                )
                const json = await res.json()

                const mRaw = (json.movements ?? json.data?.movements ?? []) as any[]
                const movements: Movement[] = mRaw.map(m => ({
                    id: String(m.id ?? ''),
                    nombre: String(m.nombre ?? m.name ?? ''),
                    count: Number(m.count ?? 0),
                    created_at: m.created_at,
                    updated_at: m.updated_at
                }))

                const d: RequestDetail = {
                    id: String(json.id ?? json.ID ?? requestId),
                    request_type: String(json.request_type ?? json.type ?? '').toLowerCase(),
                    status: String(json.status ?? '').toLowerCase(),
                    created_at: json.created_at ?? json.createdAt,
                    updated_at: json.updated_at ?? json.UpdatedAt,
                    client_account_id: json.client_account_id,
                    movements
                }

                if (!cancelled) setDetail(d)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        if (open) {
            load()
        } else {
            setDetail(null)
            setLoading(false)
        }

        return () => {
            cancelled = true
        }
    }, [open, requestId])

    if (!requestId) return null

    const glass = {
        background: `linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.9
        )} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
        backdropFilter: 'blur(18px)',
        border: `1px solid ${alpha(COLORS.primary, 0.12)}`,
        borderRadius: 3,
        boxShadow: `0 8px 28px ${alpha(COLORS.primary, 0.14)}`
    }

    const typeMeta = getTypeMeta(detail?.request_type ?? '')
    const statusMeta = getStatusMeta(detail?.status ?? '')

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { maxHeight: '92vh' } }}
        >
            <DialogTitle
                sx={{
                    p: 0
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        borderBottom: `1px solid ${alpha(COLORS.dark, 0.08)}`,
                        background: `linear-gradient(135deg, ${alpha(
                            COLORS.primary,
                            0.06
                        )} 0%, ${alpha(COLORS.secondary, 0.04)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="h6" fontWeight={800}>
                            Solicitud OCR
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha(COLORS.dark, 0.7) }}>
                            ID {requestId}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={typeMeta.label}
                            color={typeMeta.color}
                            size="small"
                            sx={{ fontWeight: 700 }}
                        />
                        <Chip
                            label={statusMeta.label}
                            color={statusMeta.color}
                            size="small"
                            sx={{ fontWeight: 700 }}
                        />
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                    <Card sx={{ ...glass, mb: 2 }}>
                        <Box sx={{ p: 2 }}>
                            {loading || !detail ? (
                                <Box sx={{ py: 2, display: 'grid', placeItems: 'center' }}>
                                    <CircularProgress size={22} />
                                </Box>
                            ) : (
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                                    justifyContent="space-between"
                                >
                                    <Stack direction="row" spacing={3}>
                                        <Stack>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: alpha(COLORS.dark, 0.6) }}
                                            >
                                                Creado
                                            </Typography>
                                            <Typography variant="body1">
                                                {detail.created_at
                                                    ? new Date(detail.created_at).toLocaleString('es-CL')
                                                    : '—'}
                                            </Typography>
                                        </Stack>
                                        <Stack>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: alpha(COLORS.dark, 0.6) }}
                                            >
                                                Actualizado
                                            </Typography>
                                            <Typography variant="body1">
                                                {detail.updated_at
                                                    ? new Date(detail.updated_at).toLocaleString('es-CL')
                                                    : '—'}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 520,
                                            color: alpha(COLORS.dark, 0.8)
                                        }}
                                    >
                                        Ítems detectados en la factura: {detail.movements.length}
                                    </Typography>
                                </Stack>
                            )}
                        </Box>
                    </Card>

                    <Card sx={{ ...glass }}>
                        <Box sx={{ p: 2, pb: 0 }}>
                            <Typography variant="subtitle1" fontWeight={800}>
                                Ítems
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: alpha(COLORS.dark, 0.7) }}
                            >
                                Productos y cantidades detectadas por el OCR
                            </Typography>
                        </Box>

                        <TableContainer sx={{ maxHeight: 380 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Producto</TableCell>
                                        <TableCell align="right">Cantidad</TableCell>
                                        <TableCell>Creado</TableCell>
                                        <TableCell>Actualizado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Box sx={{ py: 4 }}>
                                                    <CircularProgress size={24} />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : !detail || detail.movements.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Box sx={{ py: 4, color: 'text.secondary' }}>
                                                    Sin ítems
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        detail.movements.map(m => (
                                            <TableRow key={m.id || m.nombre}>
                                                <TableCell>{m.nombre || '—'}</TableCell>
                                                <TableCell align="right">{m.count}</TableCell>
                                                <TableCell>
                                                    {m.created_at
                                                        ? new Date(m.created_at).toLocaleString('es-CL')
                                                        : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    {m.updated_at
                                                        ? new Date(m.updated_at).toLocaleString('es-CL')
                                                        : '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button variant="contained" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
