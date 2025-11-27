'use client'

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
    Box,
    Container,
    Typography,
    Card,
    Stack,
    Button,
    Chip,
    TextField,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    InputAdornment,
    Grid,
    Avatar,
    Tooltip,
    IconButton
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { BarChart, BarPlot } from '@mui/x-charts/BarChart'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { ChartContainer, ChartsXAxis, ChartsYAxis, LineChart, PieChart, ScatterPlot } from '@mui/x-charts'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'

type ReportKind = 'quiebres' | 'rotacion' | 'aging' | 'valorizacion' | 'facturas' | 'sla'
type ChartKind = 'bar' | 'line' | 'pie'
type Row = { producto: string; categoria: string; cantidad: number; costo: number; fecha: string }
dayjs.extend(utc)
dayjs.extend(isoWeek)
dayjs.locale('es')

const bullets = [
    {
        label: 'Variable 1',
        max: 300,
        ranges: [150, 250, 300],
        value: 230,
        target: 260
    },
    {
        label: 'Variable 2',
        max: 30,
        ranges: [15, 25, 30],
        value: 22,
        target: 26
    },
    {
        label: 'Variable 3',
        max: 600,
        ranges: [300, 500, 600],
        value: 440,
        target: 530
    }
]

type ProductoTop = {
    nombre_producto: string
    unidades: number
}

type OverTimeProduct = {
    periodo: string
    mes: string
    ingresos: number
    egresos: number
}

type summaryForClient = {
    ingresos: number
    egresos: number
}

type stockTrend = {
    fecha: string
    stock_acumulado: number
}

type product = {
    id: string
    name: string
}

function useContainerWidth() {
    const ref = useRef<HTMLDivElement | null>(null)
    const [width, setWidth] = useState(0)

    useLayoutEffect(() => {
        if (!ref.current) return
        const resize = () => {
            if (ref.current) setWidth(ref.current.clientWidth)
        }
        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    return { ref, width }
}

export default function ReportsPage() {
    const router = useRouter()

    const barBox = useContainerWidth()
    const lineOverTimeBox = useContainerWidth()
    const pieBox = useContainerWidth()
    const stockBox = useContainerWidth()

    const [to, setTo] = useState<string>(new Date().toISOString().slice(0, 10))
    const [filters, setFilters] = useState({ producto: '', categoria: '' })
    const [openProg, setOpenProg] = useState(false)
    const [prog, setProg] = useState({ frecuencia: 'Trimestral', dia: '01', hora: '09:00' })
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const clientId = '8d1b88f0-e5c7-4670-8bbb-3045f9ab3995'
    const [rangoFechas, setRangoFechas] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null])
    const [date, setDate] = useState<dayjs.Dayjs | null>(null)
    const [kindDate, setKindDate] = useState<'month' | 'week' | ''>('')
    const topColumns = [
        { field: 'nombre_producto', headerName: 'Producto', flex: 1 },
        { field: 'unidades', headerName: 'Unidades', width: 120 }
    ]

    const [productos, setProductos] = useState<ProductoTop[]>([])
    const [productosOverTime, setProductosOverTime] = useState<OverTimeProduct[]>([])
    const [summary, setSummary] = useState<summaryForClient>({ ingresos: 0, egresos: 0 })
    const [stockTrends, setStockTrends] = useState<stockTrend[]>([])
    const [products, setProducts] = useState<product[]>([])
    const [productId, setProductId] = useState<string>('')

    useEffect(() => {
        if (!clientId) return

        const fetchData = async () => {
            try {
                const baseUrl = 'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/dashboard'
                const headers = { 'X-Client-Account-Id': clientId }

                const resTop = await fetch(`${baseUrl}?typeRequet=topProducts`, { headers })
                const topProducts: ProductoTop[] = await resTop.json()
                setProductos(topProducts)

                const respProducts = await fetch(
                    `https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/dashboard/get-product`,
                    { headers }
                )

                const productsObjet: product[] = await respProducts.json()

                setProducts(productsObjet)
                console.log('Fetched products:', productsObjet)

                const resMove = await fetch(
                    `${baseUrl}?typeRequet=movementOverTime&start=${encodeURIComponent(
                        '2024-02-01'
                    )}&end=${encodeURIComponent('2024-12-31')}&period=month`,
                    { headers }
                )
                const movementOverTime: OverTimeProduct[] = await resMove.json()
                setProductosOverTime(movementOverTime)

                const resSummary = await fetch(`${baseUrl}?typeRequet=summaryForClient`, { headers })
                const summaryData: summaryForClient = await resSummary.json()
                setSummary(summaryData)

                const resTrend = await fetch(`${baseUrl}?typeRequet=stockTrend`, { headers })
                const stockTrendsData: stockTrend[] = await resTrend.json()
                setStockTrends(stockTrendsData)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }

        fetchData()
    }, [clientId])

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl = 'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/dashboard'
            const headers = { 'X-Client-Account-Id': clientId }
            const start = rangoFechas[0]?.format('YYYY-MM-DD') ?? '2025-01-01'
            const end = rangoFechas[1]?.format('YYYY-MM-DD') ?? '2026-01-01'
            const resTop = await fetch(
                `${baseUrl}?typeRequet=topProducts&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
                { headers }
            )
            const topProducts: ProductoTop[] = await resTop.json()
            setProductos(topProducts)
        }

        if (rangoFechas[0] && rangoFechas[1]) {
            console.log('rangoFechas changed:', rangoFechas)
            fetchData()
        }
    }, [rangoFechas])

    useEffect(() => {
        console.log('Filters changed:', { kindDate, date, productId })
        const fetchData = async () => {
            let url = ''
            const baseUrl =
                'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/dashboard?typeRequet=movementOverTime'
            const headers = { 'X-Client-Account-Id': clientId }

            if (kindDate === 'week' && date) {
                const start = date.startOf('month').format('YYYY-MM-DD')
                const end = date.endOf('month').format('YYYY-MM-DD')

                url = `${baseUrl}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&period=${kindDate}`
            }

            if (kindDate === 'month' && date) {
                const start = date.startOf('year').format('YYYY-MM-DD')
                const end = date.endOf('year').format('YYYY-MM-DD')

                url = `${baseUrl}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&period=${kindDate}`
            }

            if (productId) {
                let urladd =
                    url === ''
                        ? baseUrl +
                        `&productoId=${encodeURIComponent(
                            productId
                        )}&start=${encodeURIComponent('2024-01-01')}&end=${encodeURIComponent(
                            '2024-12-31'
                        )}&period=month`
                        : `&productoId=${encodeURIComponent(productId)}`

                console.log({ urladd })

                url += urladd
            }

            console.log('Constructed URL:', url)
            const resMove = await fetch(`${url}`, { headers })
            console.log({ resMove })
            const movementOverTime: OverTimeProduct[] = await resMove.json()
            console.log({ movementOverTime })
            if (movementOverTime !== null && movementOverTime.length > 0) {
                setProductosOverTime(movementOverTime)
            } else {
                setProductosOverTime([])
            }
        }

        fetchData()
    }, [kindDate, date, productId])

    const chartData = useMemo(() => {
        console.log('test', productosOverTime?.length !== 0)

        return productosOverTime?.length !== 0
            ? productosOverTime?.map((d, index) => ({
                x: kindDate === 'week' && date ? dayjs.utc(d.periodo).format('D ddd MMM') : d?.mes?.slice(0, 3),
                ingresos: Number(d.ingresos ?? 0),
                egresos: Number(d.egresos ?? 0)
            }))
            : []
    }, [productosOverTime])

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: t =>
                    `
          radial-gradient(1200px 500px at -10% -10%, ${alpha(t.palette.primary.light, 0.07)}, transparent 60%),
          radial-gradient(1200px 500px at 110% -20%, ${alpha(t.palette.secondary.light, 0.08)}, transparent 55%),
          linear-gradient(180deg,#f6f8fc, #eef3ff 45%, #ffffff 100%)
        `
            }}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 }, px: { xs: 1.5, sm: 2 } }}>
                <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 1.5 }}>
                    <IconButton onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
                        <ArrowBackIcon />
                    </IconButton>
                </Stack>

                <Card
                    sx={{
                        p: { xs: 2, md: 3 },
                        mb: { xs: 2, md: 3 },
                        borderRadius: 4,
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden',
                        background: t => `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.info.main} 100%)`,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            right: -60,
                            top: -60,
                            width: 240,
                            height: 240,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,.15)',
                            filter: 'blur(2px)'
                        }
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        justifyContent="space-between"
                        gap={1.25}
                    >
                        <Stack spacing={0.25}>
                            <Typography variant="h4" fontWeight={900}>
                                Dashboard
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.92 }}>
                                Visualización y exportación
                            </Typography>
                        </Stack>
                    </Stack>
                </Card>

                <Grid container spacing={{ xs: 2, md: 3 }}>
                    <Grid item xs={12}>
                        <Card sx={{ p: { xs: 1.75, md: 2.25 }, borderRadius: 4, mb: 4 }}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Top 7 productos con más movimientos
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            label="Desde"
                                            type="date"
                                            value={rangoFechas[0]?.format('YYYY-MM-DD')}
                                            onChange={e => setRangoFechas([dayjs(e.target.value), rangoFechas[1]])}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            label="Hasta"
                                            type="date"
                                            value={rangoFechas[1]?.format('YYYY-MM-DD')}
                                            onChange={e => {
                                                const newDate = dayjs(e.target.value)
                                                if (newDate.isBefore(rangoFechas[0], 'day')) {
                                                    setRangoFechas([newDate, newDate])
                                                } else {
                                                    setRangoFechas([rangoFechas[0], newDate])
                                                }
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box ref={barBox.ref} sx={{ width: '100%' }}>
                                        {Array.isArray(productos) && productos.length > 0 && (
                                            <BarChart
                                                height={barBox.width < 600 ? 260 : 400}
                                                dataset={productos?.map((p, i) => ({
                                                    ...p,
                                                    idx: p.nombre_producto
                                                }))}
                                                yAxis={[
                                                    {
                                                        scaleType: 'band',
                                                        dataKey: 'idx',
                                                        width: 100
                                                    }
                                                ]}
                                                xAxis={[
                                                    {
                                                        label: 'Cantidad de movimientos'
                                                    }
                                                ]}
                                                series={[
                                                    {
                                                        dataKey: 'ingresos',
                                                        label: 'Ingresos',
                                                        stack: 'total',
                                                        color: '#4CAF50'
                                                    },
                                                    {
                                                        dataKey: 'egresos',
                                                        label: 'Egresos',
                                                        stack: 'total',
                                                        color: '#F5C242'
                                                    }
                                                ]}
                                                slotProps={{
                                                    legend: {
                                                        position: { vertical: 'top', horizontal: 'center' }
                                                    }
                                                }}
                                                layout="horizontal"
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>

                        <Card sx={{ p: { xs: 1.75, md: 2.25 }, borderRadius: 4, mb: 4 }}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Entradas y salidas de un producto en el tiempo
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                        <TextField
                                            select
                                            label="Producto"
                                            value={filters.producto}
                                            onChange={e => {
                                                console.log(e.target.value)
                                                setProductId(e.target.value)
                                                setFilters(s => ({ ...s, producto: e.target.value }))
                                            }}
                                            sx={{ minWidth: 240 }}
                                        >
                                            {Array.isArray(products) &&
                                                products.map(p => (
                                                    <MenuItem key={p.id} value={p.id}>
                                                        {p.name}
                                                    </MenuItem>
                                                ))}
                                        </TextField>

                                        <TextField
                                            select
                                            label="Periodo"
                                            value={filters.categoria}
                                            onChange={e => {
                                                console.log('value' + e.target.value)
                                                const kindStr = e.target.value === 'Años' ? 'month' : 'week'
                                                console.log(kindStr)
                                                setKindDate(kindStr)
                                                setFilters(s => ({ ...s, categoria: e.target.value }))
                                            }}
                                            sx={{ width: 160 }}
                                        >
                                            <MenuItem value="Años">Años</MenuItem>
                                            <MenuItem value="Semanas">Semanas</MenuItem>
                                        </TextField>

                                        {filters.categoria === 'Años' && (
                                            <TextField
                                                select
                                                label="Año"
                                                value={to}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setTo(e.target.value)
                                                    const year = e.target.value
                                                    setDate(dayjs(`${year}-01-01`))
                                                }}
                                                sx={{ width: 140 }}
                                            >
                                                {((any) => {
                                                    const start = 2024
                                                    const end = dayjs().year()
                                                    return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(y => (
                                                        <MenuItem key={y} value={String(y)}>
                                                            {String(y)}
                                                        </MenuItem>
                                                    ))
                                                })()}
                                            </TextField>
                                        )}

                                        {filters.categoria === 'Semanas' && (
                                            <TextField
                                                select
                                                label="Mes (desde 2024)"
                                                value={to}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    setTo(e.target.value)
                                                    const val = e.target.value
                                                    setDate(dayjs(`${val}-01`))
                                                }}
                                                sx={{ minWidth: 180 }}
                                            >
                                                {(() => {
                                                    const items = []
                                                    let cur = dayjs('2024-01-01')
                                                    const end = dayjs()
                                                    while (cur.isBefore(end) || cur.isSame(end, 'month')) {
                                                        items.push(cur)
                                                        cur = cur.add(1, 'month')
                                                    }
                                                    return items.map(m => (
                                                        <MenuItem key={m.format('YYYY-MM')} value={m.format('YYYY-MM')}>
                                                            {m.format('MMMM YYYY')}
                                                        </MenuItem>
                                                    ))
                                                })()}
                                            </TextField>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ width: '100%', overflowX: 'auto', pb: 2 }}>
                                        <Box sx={{ minWidth: 650 }}>
                                            <LineChart
                                                height={lineOverTimeBox.width < 600 ? 300 : 420}
                                                dataset={chartData}
                                                xAxis={[
                                                    {
                                                        dataKey: 'x',
                                                        label: 'Fecha',
                                                        scaleType: 'band'
                                                    }
                                                ]}
                                                series={[
                                                    {
                                                        id: 'Ingresos',
                                                        dataKey: 'ingresos',
                                                        label: 'Ingresos',
                                                        color: '#4CAF50',
                                                        showMark: true,
                                                        valueFormatter: value =>
                                                            value == null ? '' : value.toLocaleString('es-CL')
                                                    },
                                                    {
                                                        id: 'Egresos',
                                                        dataKey: 'egresos',
                                                        label: location => (location === 'tooltip' ? 'Egresos' : 'Egresos'),
                                                        color: '#F5C242',
                                                        showMark: true,
                                                        valueFormatter: (value, context) => {
                                                            if (value == null) return ''

                                                            const row = chartData[context.dataIndex]
                                                            const ingresos = row?.ingresos ?? 0
                                                            const egresos = row?.egresos ?? 0
                                                            const total = ingresos - egresos

                                                            return `${egresos.toLocaleString('es-CL')} (    Total ${total.toLocaleString(
                                                                'es-CL'
                                                            )})`
                                                        }
                                                    }
                                                ]}
                                                margin={{ top: 40, right: 20, bottom: 70, left: 50 }}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    <Grid item xs={12}></Grid>
                </Grid>

                <Dialog
                    open={openProg}
                    onClose={() => setOpenProg(false)}
                    fullWidth
                    maxWidth="xs"
                    PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}
                >
                    <DialogTitle sx={{ fontWeight: 800 }}>Programar reporte</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                select
                                label="Frecuencia"
                                value={prog.frecuencia}
                                onChange={e => setProg(s => ({ ...s, frecuencia: e.target.value }))}
                            >
                                <MenuItem value="Semanal">Semanal</MenuItem>
                                <MenuItem value="Mensual">Mensual</MenuItem>
                                <MenuItem value="Trimestral">Trimestral</MenuItem>
                            </TextField>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <TextField
                                    label="Día"
                                    value={prog.dia}
                                    onChange={e => setProg(s => ({ ...s, dia: e.target.value }))}
                                    fullWidth
                                />
                                <TextField
                                    label="Hora"
                                    value={prog.hora}
                                    onChange={e => setProg(s => ({ ...s, hora: e.target.value }))}
                                    fullWidth
                                />
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setOpenProg(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={() => setOpenProg(false)}>
                            Guardar programación
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}
