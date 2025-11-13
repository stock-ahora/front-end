'use client'

import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react'
import {
    Box,
    Container,
    Typography,
    Card,
    Stack,
    Grid,
    Chip,
    Divider,
    TextField
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import InventoryIcon from '@mui/icons-material/Inventory'
import { LineChart } from '@mui/x-charts/LineChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'

type ForecastPoint = {
    periodo: string
    real: number
    pronosticado: number
}

type RiskBucket = {
    label: string
    value: number
}

type ProductRiskRow = {
    producto: string
    categoria: string
    riesgo: number
    stock: number
    diasCobertura: number
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

    const forecastData: ForecastPoint[] = useMemo(
        () => [
            { periodo: 'Ene', real: 120, pronosticado: 122 },
            { periodo: 'Feb', real: 140, pronosticado: 142 },
            { periodo: 'Mar', real: 155, pronosticado: 158 },
            { periodo: 'Abr', real: 160, pronosticado: 165 },
            { periodo: 'May', real: 170, pronosticado: 178 },
            { periodo: 'Jun', real: 165, pronosticado: 182 }
        ],
        []
    )

    const riskBuckets: RiskBucket[] = useMemo(
        () => [
            { label: 'Muy bajo', value: 18 },
            { label: 'Bajo', value: 27 },
            { label: 'Medio', value: 30 },
            { label: 'Alto', value: 17 },
            { label: 'Crítico', value: 8 }
        ],
        []
    )

    const riskyProducts: ProductRiskRow[] = useMemo(
        () => [
            { producto: 'Arroz 1kg', categoria: 'Granos', riesgo: 82, stock: 45, diasCobertura: 7 },
            { producto: 'Aceite 900ml', categoria: 'Abarrotes', riesgo: 76, stock: 32, diasCobertura: 5 },
            { producto: 'Leche 1L', categoria: 'Lácteos', riesgo: 69, stock: 60, diasCobertura: 9 },
            { producto: 'Detergente 3L', categoria: 'Limpieza', riesgo: 63, stock: 25, diasCobertura: 11 },
            { producto: 'Azúcar 1kg', categoria: 'Granos', riesgo: 58, stock: 80, diasCobertura: 14 }
        ],
        []
    )

    const [selectedProduct, setSelectedProduct] = useState('')
    useEffect(() => {
        if (!selectedProduct && riskyProducts.length > 0) {
            setSelectedProduct(riskyProducts[0].producto)
        }
    }, [selectedProduct, riskyProducts])

    const selectedProductInfo = useMemo(
        () => riskyProducts.find(p => p.producto === selectedProduct),
        [selectedProduct, riskyProducts]
    )

    const probQuiebreProducto = selectedProductInfo?.riesgo ?? 14.3
    const horizonteSemanas = 6
    const mae = 7.8
    const rmse = 10.2

    const unifiedForecast = useMemo(() => {
        const splitIndex = 3
        return forecastData.map((p, index) => ({
            periodo: p.periodo,
            valor: index < splitIndex ? p.real : p.pronosticado
        }))
    }, [forecastData])

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
                        <Stack spacing={0.75} sx={{ width: '100%' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <TrendingUpIcon />
                                <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                    Modelo predictivo
                                </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ opacity: 0.92, maxWidth: 520 }}>
                                Proyección de demanda, riesgo de quiebre y cobertura de stock basada en el historial de movimientos.
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
                            <Chip
                                icon={<WarningAmberIcon sx={{ fontSize: 18 }} />}
                                label="Beta"
                                size="small"
                                sx={{ bgcolor: alpha('#000000', 0.18), color: '#fff' }}
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
                                Selecciona un SKU para ver su riesgo, demanda y proyección.
                            </Typography>
                        </Box>
                        <TextField
                            select
                            size="small"
                            label="Producto"
                            value={selectedProduct}
                            onChange={e => setSelectedProduct(e.target.value)}
                            sx={{ minWidth: { xs: '100%', sm: 260 } }}
                        >
                            {riskyProducts.map(p => (
                                <option key={p.producto} value={p.producto}>
                                    {p.producto}
                                </option>
                            ))}
                        </TextField>
                    </Stack>
                </Card>

                <Grid container spacing={{ xs: 2, md: 3 }}>
                    <Grid item xs={12} md={4}>
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

                            <Stack spacing={1.5}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: '50%',
                                            display: 'grid',
                                            placeItems: 'center',
                                            bgcolor: alpha(COLORS.danger, 0.08)
                                        }}
                                    >
                                        <WarningAmberIcon sx={{ color: COLORS.danger, fontSize: 22 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Probabilidad de quiebre
                                        </Typography>
                                        <Typography variant="h5" fontWeight={800}>
                                            {probQuiebreProducto.toFixed(1)}%
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: '50%',
                                            display: 'grid',
                                            placeItems: 'center',
                                            bgcolor: alpha(COLORS.success, 0.08)
                                        }}
                                    >
                                        <TrendingUpIcon sx={{ color: COLORS.success, fontSize: 22 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Horizonte de predicción
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800}>
                                            {horizonteSemanas} semanas
                                        </Typography>
                                    </Box>
                                </Stack>

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
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                Error MAE
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight={800}>
                                                {mae.toFixed(1)}
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
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                Error RMSE
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight={800}>
                                                {rmse.toFixed(1)}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 1.5 }} />

                                <Stack spacing={1.25}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Recomendación
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                        Ajusta el punto de reorden y la frecuencia de reposición para el producto seleccionado,
                                        especialmente si se ubica en niveles de riesgo alto o crítico.
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={8}>
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
                                        La línea muestra el consumo histórico y la proyección futura del producto seleccionado.
                                    </Typography>
                                </Box>
                                <Chip
                                    size="small"
                                    label="Periodo: últimos 6 meses"
                                    sx={{ bgcolor: alpha(COLORS.primary, 0.04) }}
                                />
                            </Stack>

                            <Box ref={boxRef} sx={{ width: '100%' }}>
                                {width > 0 && (
                                    <LineChart
                                        width={width}
                                        height={320}
                                        dataset={unifiedForecast}
                                        xAxis={[{ dataKey: 'periodo', scaleType: 'point' }]}
                                        series={[
                                            { id: 'demanda', dataKey: 'valor', label: 'Demanda' }
                                        ]}
                                        margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
                                        grid={{ horizontal: true }}
                                    />
                                )}
                            </Box>
                        </Card>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Card
                                    sx={{
                                        p: { xs: 1.75, md: 2 },
                                        borderRadius: 4,
                                        height: '100%',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                                        Distribución de riesgo de quiebre
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1.5, fontSize: { xs: 12, md: 13 } }}
                                    >
                                        Porcentaje de productos en cada nivel de riesgo.
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <PieChart
                                            width={260}
                                            height={260}
                                            series={[
                                                {
                                                    data: riskBuckets.map(b => ({
                                                        id: b.label,
                                                        label: b.label,
                                                        value: b.value
                                                    })),
                                                    innerRadius: 40
                                                }
                                            ]}
                                        />
                                    </Box>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card
                                    sx={{
                                        p: { xs: 1.75, md: 2 },
                                        borderRadius: 4,
                                        height: '100%',
                                        boxShadow: '0 4px 18px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
                                        Productos por nivel de riesgo
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1.5, fontSize: { xs: 12, md: 13 } }}
                                    >
                                        Cantidad de SKUs agrupados por severidad del riesgo.
                                    </Typography>

                                    <Box sx={{ width: '100%', height: { xs: 220, md: 240 } }}>
                                        {width > 0 && (
                                            <BarChart
                                                height={240}
                                                width={width}
                                                xAxis={[{ scaleType: 'band', data: riskBuckets.map(r => r.label) }]}
                                                series={[{ data: riskBuckets.map(r => r.value), label: '% de productos' }]}
                                                margin={{ top: 20, right: 10, bottom: 30, left: 40 }}
                                                grid={{ horizontal: true }}
                                            />
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
