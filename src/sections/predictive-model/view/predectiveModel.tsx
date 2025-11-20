'use client'

import React, { useLayoutEffect, useRef, useState, useEffect, useMemo } from 'react'
import {
    Box,
    Container,
    Typography,
    Card,
    Stack,
    Grid,
    Chip,
    Divider,
    TextField,
    Alert,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import InventoryIcon from '@mui/icons-material/Inventory'
import { LineChart } from '@mui/x-charts/LineChart'

type ForecastPoint = {
    periodo: string
    label: string
    real: number | null
    pronosticado: number | null
}

type ProductRiskRow = {
    id: number
    producto: string
    categoria?: string
    riesgo: number
    stock: number
    diasCobertura: number
    uuid: string
}

const COLORS = {
    primary: '#104D73',
    secondary: '#13B3F2',
    accent: '#F2BF80',
    success: '#4CAF50',
    warn: '#FFB74D',
    danger: '#EF5350',
    dark: '#262626'
}

const FORECAST_BASE_URL =
    'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/forecast'

const PRODUCTS_BASE_URL =
    'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/dashboard/get-product'

const formatPeriodoLabel = (ym: string) => {
    const [year, month] = ym.split('-')
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const idx = Number(month) - 1
    const mName = months[idx] ?? ym
    return `${mName}-${year.slice(-2)}`
}

export default function PredictiveModelView() {
    const boxRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)

    useLayoutEffect(() => {
        if (!boxRef.current) return
        const resize = () => setWidth(boxRef.current!.clientWidth)
        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    const [riskyProducts, setRiskyProducts] = useState<ProductRiskRow[]>([])
    const [selectedProduct, setSelectedProduct] = useState('')
    const [months, setMonths] = useState(3)
    const [forecastData, setForecastData] = useState<ForecastPoint[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mae, setMae] = useState<number | null>(null)
    const [r2, setR2] = useState<number | null>(null)
    const [confiabilidad, setConfiabilidad] = useState<string | null>(null)
    const [advertencia, setAdvertencia] = useState<string | null>(null)

    const [trend, setTrend] = useState<string | null>(null)
    const [avgGrowth, setAvgGrowth] = useState<number | null>(null)
    const [usedHistoryMonths, setUsedHistoryMonths] = useState<number | null>(null)
    const [equation, setEquation] = useState<string | null>(null)
    const [modelName, setModelName] = useState<string | null>(null)
    const [metaHistoricMonths, setMetaHistoricMonths] = useState<number | null>(null)
    const [metaGeneratedAt, setMetaGeneratedAt] = useState<string | null>(null)
    const [extraRecommendation, setExtraRecommendation] = useState<string | null>(null)

    const [showReal, setShowReal] = useState(true)
    const [showProyectado, setShowProyectado] = useState(true)

    useEffect(() => {
        const controller = new AbortController()

        const loadProducts = async () => {
            try {
                const res = await fetch(PRODUCTS_BASE_URL, { signal: controller.signal })
                if (!res.ok) throw new Error('Error al cargar productos')
                const data = await res.json()

                const mapped: ProductRiskRow[] = (data ?? []).map((p: any) => ({
                    id: p.id,
                    producto: p.name,
                    categoria: undefined,
                    riesgo: 50,
                    stock: 0,
                    diasCobertura: 0,
                    uuid: p.uuid
                }))

                setRiskyProducts(mapped)
            } catch (e: any) {
                if (e?.name === 'AbortError') return
                console.error('Error cargando productos', e)
            }
        }

        loadProducts()

        return () => controller.abort()
    }, [])

    useEffect(() => {
        if (!selectedProduct && riskyProducts.length > 0) {
            setSelectedProduct(riskyProducts[0].producto)
        }
    }, [selectedProduct, riskyProducts])

    const selectedProductInfo = useMemo(
        () => riskyProducts.find(p => p.producto === selectedProduct),
        [selectedProduct, riskyProducts]
    )

    useEffect(() => {
        if (!selectedProductInfo?.uuid || months <= 0) {
            setForecastData([])
            setMae(null)
            setR2(null)
            setConfiabilidad(null)
            setAdvertencia(null)
            setTrend(null)
            setAvgGrowth(null)
            setUsedHistoryMonths(null)
            setEquation(null)
            setModelName(null)
            setMetaHistoricMonths(null)
            setMetaGeneratedAt(null)
            setExtraRecommendation(null)
            return
        }

        const controller = new AbortController()

        const loadForecast = async () => {
            setLoading(true)
            setError(null)
            try {
                const url = `${FORECAST_BASE_URL}?producto_uuid=${selectedProductInfo.uuid}&months=${months}`
                const res = await fetch(url, { signal: controller.signal })
                let data: any = null
                try {
                    data = await res.json()
                } catch {
                    throw new Error('Respuesta inválida del servidor.')
                }

                if (!res.ok || data?.code === 'INSUFFICIENT_DATA') {
                    const message =
                        typeof data?.error === 'string'
                            ? data.error
                            : 'No se pudo cargar la proyección. Intenta nuevamente.'
                    throw new Error(message)
                }

                const historico: ForecastPoint[] =
                    data.historico?.map((h: any) => {
                        const periodo = h['año_mes']
                        return {
                            periodo,
                            label: formatPeriodoLabel(periodo),
                            real: h.ventas_reales,
                            pronosticado: null
                        }
                    }) ?? []

                const proyeccion: ForecastPoint[] =
                    data.proyeccion?.map((p: any) => {
                        const periodo = p['año_mes']
                        return {
                            periodo,
                            label: formatPeriodoLabel(periodo),
                            real: null,
                            pronosticado: p.ventas_proyectadas
                        }
                    }) ?? []

                setForecastData([...historico, ...proyeccion])

                const metricas = data.metricas || {}
                setMae(
                    typeof metricas.error_medio_absoluto === 'number'
                        ? metricas.error_medio_absoluto
                        : null
                )
                setR2(typeof metricas.r2_score === 'number' ? metricas.r2_score : null)
                setConfiabilidad(
                    typeof metricas.confiabilidad === 'string'
                        ? metricas.confiabilidad
                        : null
                )
                setTrend(
                    typeof metricas.tendencia === 'string'
                        ? metricas.tendencia
                        : null
                )
                setAvgGrowth(
                    typeof metricas.crecimiento_mensual_promedio === 'number'
                        ? metricas.crecimiento_mensual_promedio
                        : null
                )
                setUsedHistoryMonths(
                    typeof metricas.meses_historicos_usados === 'number'
                        ? metricas.meses_historicos_usados
                        : null
                )
                setEquation(
                    typeof metricas.ecuacion === 'string'
                        ? metricas.ecuacion
                        : null
                )

                const meta = data.metadata || {}
                setModelName(
                    typeof meta.modelo === 'string'
                        ? meta.modelo
                        : null
                )
                setMetaHistoricMonths(
                    typeof meta.meses_historicos === 'number'
                        ? meta.meses_historicos
                        : null
                )
                setMetaGeneratedAt(
                    typeof meta.fecha_generacion === 'string'
                        ? meta.fecha_generacion
                        : null
                )

                const adv = data.advertencia || {}
                setAdvertencia(
                    typeof adv.mensaje_confiabilidad === 'string'
                        ? adv.mensaje_confiabilidad
                        : null
                )
                setExtraRecommendation(
                    typeof adv.recomendacion_adicional === 'string'
                        ? adv.recomendacion_adicional
                        : null
                )
            } catch (e: any) {
                if (e?.name === 'AbortError') return
                setError(e?.message || 'No se pudo cargar la proyección. Intenta nuevamente.')
                setForecastData([])
                setMae(null)
                setR2(null)
                setConfiabilidad(null)
                setAdvertencia(null)
                setTrend(null)
                setAvgGrowth(null)
                setUsedHistoryMonths(null)
                setEquation(null)
                setModelName(null)
                setMetaHistoricMonths(null)
                setMetaGeneratedAt(null)
                setExtraRecommendation(null)
            } finally {
                setLoading(false)
            }
        }

        loadForecast()

        return () => controller.abort()
    }, [selectedProductInfo?.uuid, months])

    const probQuiebreProducto = selectedProductInfo?.riesgo ?? 0
    const horizonteSemanas = months * 4

    const series = useMemo(() => {
        const result: any[] = []
        if (showReal) {
            result.push({
                id: 'real',
                dataKey: 'real',
                label: 'Ventas reales',
                showMark: true
            })
        }
        if (showProyectado) {
            result.push({
                id: 'proyectado',
                dataKey: 'pronosticado',
                label: 'Ventas proyectadas',
                showMark: true
            })
        }
        return result
    }, [showReal, showProyectado])

    const formattedTrend =
        trend === 'creciente'
            ? 'Creciente'
            : trend === 'decreciente'
                ? 'Decreciente'
                : trend || null

    const formattedGeneratedAt = metaGeneratedAt ? metaGeneratedAt.slice(0, 10) : null

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: t =>
                    `
          radial-gradient(1200px 500px at -10% -10%, ${alpha(
                        t.palette.primary.light,
                        0.07
                    )}, transparent 60%),
          radial-gradient(1200px 500px at 110% -20%, ${alpha(
                        t.palette.secondary.light,
                        0.08
                    )}, transparent 55%),
          linear-gradient(180deg,#f6f8fc, #eef3ff 45%, #ffffff 100%)
        `
            }}
        >
            <Container
                maxWidth="lg"
                sx={{ py: { xs: 2.5, md: 4 }, px: { xs: 1.5, sm: 2 } }}
            >
                <Card
                    sx={{
                        p: { xs: 2, md: 3 },
                        mb: { xs: 2, md: 3 },
                        borderRadius: 4,
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden',
                        background: t =>
                            `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.info.main} 100%)`,
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
                        <Stack spacing={0.75} sx={{ width: '100%' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TrendingUpIcon />
                                <Typography
                                    variant="h4"
                                    fontWeight={900}
                                    sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                                >
                                    Modelo predictivo
                                </Typography>
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{ opacity: 0.92, maxWidth: 520 }}
                            >
                                Proyección de demanda, riesgo de quiebre y cobertura de stock
                                basada en el historial de movimientos.
                            </Typography>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                            justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                        >
                            <Chip
                                icon={<InventoryIcon sx={{ fontSize: 18 }} />}
                                label="Basado en datos históricos"
                                size="small"
                                sx={{ bgcolor: alpha('#ffffff', 0.16), color: '#fff' }}
                            />
                        </Stack>
                    </Stack>
                </Card>

                <Card
                    sx={{
                        mb: { xs: 2.5, md: 3 },
                        p: { xs: 1.75, md: 2 },
                        borderRadius: 4,
                        boxShadow: '0 4px 18px rgba(0,0,0,0.04)'
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        justifyContent="space-between"
                    >
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                Producto analizado
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                Selecciona un SKU y el horizonte de meses para ver su riesgo,
                                demanda y proyección.
                            </Typography>
                        </Box>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1.5}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            <TextField
                                select
                                size="small"
                                label="Producto"
                                value={selectedProduct}
                                onChange={e => setSelectedProduct(e.target.value)}
                                sx={{ minWidth: { xs: '100%', sm: 260 } }}
                            >
                                {riskyProducts.map(p => (
                                    <MenuItem key={p.id} value={p.producto}>
                                        {p.producto}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                size="small"
                                label="Meses a proyectar"
                                value={months}
                                onChange={e => setMonths(Number(e.target.value))}
                                sx={{ minWidth: 160 }}
                            >
                                {[1, 3, 6, 9, 12].map(m => (
                                    <MenuItem key={m} value={m}>
                                        {m} {m === 1 ? 'mes' : 'meses'}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Stack>
                </Card>

                <Grid container spacing={{ xs: 2, md: 3 }}>
                    <Grid item xs={12} md={12}>
                        <Card
                            sx={{
                                p: { xs: 1.75, md: 2.25 },
                                borderRadius: 4,
                                mb: { xs: 2.5, md: 3 },
                                boxShadow: '0 4px 18px rgba(0,0,0,0.06)'
                            }}
                        >
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                justifyContent="space-between"
                                spacing={1.5}
                                sx={{ mb: 1.5 }}
                            >
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800}>
                                        Demanda real y proyección en el tiempo
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', fontSize: { xs: 12, md: 13 } }}
                                    >
                                        La línea sólida muestra las ventas históricas y la línea
                                        punteada la proyección futura del producto seleccionado.
                                    </Typography>
                                </Box>
                                <Stack spacing={1} alignItems="flex-end">
                                    <Chip
                                        size="small"
                                        label={`Histórico + ${months} ${
                                            months === 1 ? 'mes proyectado' : 'meses proyectados'
                                        }`}
                                        sx={{ bgcolor: alpha(COLORS.primary, 0.04) }}
                                    />
                                    <FormGroup row>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={showReal}
                                                    onChange={e => setShowReal(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label="Ventas reales"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={showProyectado}
                                                    onChange={e => setShowProyectado(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label="Ventas proyectadas"
                                        />
                                    </FormGroup>
                                </Stack>
                            </Stack>

                            {error && (
                                <Alert severity="error" sx={{ mb: 1.5 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box
                                ref={boxRef}
                                sx={{
                                    width: '100%',
                                    overflowX: { xs: 'auto', md: 'visible' },
                                    pb: { xs: 1, md: 0 }
                                }}
                            >
                                {width > 0 && (
                                    <Box sx={{ minWidth: { xs: 600, md: 'auto' } }}>
                                        <LineChart
                                            width={Math.max(width, 600)}
                                            height={560}
                                            dataset={forecastData}
                                            xAxis={[
                                                {
                                                    dataKey: 'label',
                                                    scaleType: 'point',
                                                    height: 110,
                                                    tickLabelStyle: {
                                                        angle: -90,
                                                        textAnchor: 'end',
                                                        fontSize: 12,
                                                        fill: '#000000'
                                                    }
                                                }
                                            ]}
                                            series={series}
                                            margin={{ top: 20, right: 32, bottom: 120, left: 56 }}
                                            grid={{ horizontal: true }}
                                            loading={loading}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <Card
                            sx={{
                                p: { xs: 1.75, md: 2.25 },
                                borderRadius: 4,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                boxShadow: '0 4px 18px rgba(0,0,0,0.06)'
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                Resumen del riesgo
                            </Typography>

                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Producto: {selectedProductInfo?.producto ?? 'Sin selección'}
                            </Typography>

                            <Grid container spacing={1.5}>
                                <Grid item xs={12}>
                                    <Grid container spacing={1.5}>
                                        <Grid item xs={6}>
                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 1.5,
                                                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                                                    bgcolor: alpha(COLORS.danger, 0.02),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.25
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        bgcolor: alpha(COLORS.danger, 0.08)
                                                    }}
                                                >
                                                    <WarningAmberIcon sx={{ color: COLORS.danger, fontSize: 22 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Probabilidad de quiebre
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={800}>
                                                        {probQuiebreProducto.toFixed(1)}%
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 1.5,
                                                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                                                    bgcolor: alpha(COLORS.success, 0.02),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.25
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        display: 'grid',
                                                        placeItems: 'center',
                                                        bgcolor: alpha(COLORS.success, 0.08)
                                                    }}
                                                >
                                                    <TrendingUpIcon sx={{ color: COLORS.success, fontSize: 22 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Horizonte
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={800}>
                                                        {horizonteSemanas} semanas
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container spacing={1.5}>
                                        <Grid item xs={6}>
                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 1.25,
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                                    bgcolor: alpha(COLORS.primary, 0.02)
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    Error MAE
                                                </Typography>
                                                <Typography variant="subtitle1" fontWeight={800}>
                                                    {mae !== null ? mae.toFixed(1) : '-'}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 1.25,
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                                    bgcolor: alpha(COLORS.secondary, 0.02)
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    R² del modelo
                                                </Typography>
                                                <Typography variant="subtitle1" fontWeight={800}>
                                                    {r2 !== null ? r2.toFixed(3) : '-'}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container spacing={1.5}>
                                        <Grid item xs={6}>
                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 1.25,
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    Tendencia
                                                </Typography>
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    {formattedTrend ?? '-'}
                                                </Typography>
                                                {avgGrowth !== null && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: 'text.secondary' }}
                                                    >
                                                        Crec. mensual: {avgGrowth.toFixed(1)} unidades
                                                    </Typography>
                                                )}
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    p: 1.25,
                                                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    Históricos usados
                                                </Typography>
                                                <Typography variant="subtitle2" fontWeight={700}>
                                                    {usedHistoryMonths ?? metaHistoricMonths ?? '-'} meses
                                                </Typography>
                                                {modelName && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: 'text.secondary' }}
                                                    >
                                                        Modelo: {modelName}
                                                    </Typography>
                                                )}
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {equation && (
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Ecuación de tendencia:{' '}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{ color: 'text.primary', fontWeight: 600 }}
                                    >
                                        {equation}
                                    </Typography>
                                </Typography>
                            )}

                            {formattedGeneratedAt && (
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Última generación del modelo: {formattedGeneratedAt}
                                </Typography>
                            )}

                            <Divider sx={{ my: 1.5 }} />

                            {confiabilidad && (
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Confiabilidad del modelo: {confiabilidad}
                                </Typography>
                            )}

                            <Stack spacing={1.25}>
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Recomendación
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.primary' }}
                                >
                                    Ajusta el punto de reorden y la frecuencia de reposición
                                    para el producto seleccionado según la proyección y el nivel
                                    de riesgo observado.
                                </Typography>
                                {advertencia && (
                                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                                        {advertencia}
                                    </Typography>
                                )}
                                {extraRecommendation && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {extraRecommendation}
                                    </Typography>
                                )}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
