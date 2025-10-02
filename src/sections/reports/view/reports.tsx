'use client'

import React, { useMemo, useState } from 'react'
import {
    Box, Container, Typography, Card, Stack, Button, Chip, TextField, MenuItem,
    ToggleButtonGroup, ToggleButton, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
    RadioGroup, FormControlLabel, Radio, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    TablePagination, InputAdornment, Grid
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SaveIcon from '@mui/icons-material/Save'
import ScheduleIcon from '@mui/icons-material/Schedule'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import PieChartIcon from '@mui/icons-material/PieChart'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TuneIcon from '@mui/icons-material/Tune'

type ReportKind = 'quiebres' | 'rotacion' | 'aging' | 'valorizacion' | 'facturas' | 'sla'
type ChartKind = 'bar' | 'line' | 'pie'
type Row = { producto: string; categoria: string; cantidad: number; costo: number; fecha: string }

function csvDownload(rows: Row[], filename: string) {
    const headers = ['Producto', 'Categoría', 'Cantidad', 'Costo', 'Fecha']
    const body = rows.map(r => [r.producto, r.categoria, String(r.cantidad), String(r.costo), r.fecha].join(','))
    const csv = [headers.join(','), ...body].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
}

function fakeData(kind: ReportKind, from: string, to: string): Row[] {
    const base = [
        { producto: 'Arroz 1kg', categoria: 'Alimentos' },
        { producto: 'Aceite 1L', categoria: 'Alimentos' },
        { producto: 'Detergente 3L', categoria: 'Limpieza' },
        { producto: 'Shampoo 400ml', categoria: 'Higiene' },
        { producto: 'Gaseosa 1.5L', categoria: 'Bebidas' },
    ]
    const mul = { quiebres: 1, rotacion: 2, aging: 3, valorizacion: 4, facturas: 5, sla: 6 }[kind]
    const rng = (n: number) => Math.max(1, Math.floor((Math.sin(n * 13.37) + 1) * 10 * mul))
    const today = new Date(to || new Date().toISOString().slice(0, 10))
    return base.map((b, i) => ({
        producto: b.producto,
        categoria: b.categoria,
        cantidad: rng(i + 1),
        costo: rng(i + 2) * 500,
        fecha: today.toISOString().slice(0, 10),
    }))
}

export default function ReportsPage() {
    const [report, setReport] = useState<ReportKind>('facturas')
    const [chart, setChart] = useState<ChartKind>('bar')
    const [from, setFrom] = useState<string>(new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().slice(0, 10))
    const [to, setTo] = useState<string>(new Date().toISOString().slice(0, 10))
    const [filters, setFilters] = useState({ producto: '', categoria: '' })
    const [openProg, setOpenProg] = useState(false)
    const [prog, setProg] = useState({ frecuencia: 'Trimestral', dia: '01', hora: '09:00' })
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [ran, setRan] = useState(false)

    const rowsAll = useMemo(() => (ran ? fakeData(report, from, to) : []), [ran, report, from, to])

    const kpis = useMemo(() => {
        const total = rowsAll.reduce((s, r) => s + r.cantidad * r.costo, 0)
        const unidades = rowsAll.reduce((s, r) => s + r.cantidad, 0)
        const criticos = rowsAll.filter(r => r.cantidad < 5).length
        return { total, unidades, criticos }
    }, [rowsAll])

    const filtered = useMemo(() => {
        return rowsAll.filter(r =>
            r.producto.toLowerCase().includes(filters.producto.toLowerCase()) &&
            r.categoria.toLowerCase().includes(filters.categoria.toLowerCase())
        )
    }, [rowsAll, filters])

    const paged = useMemo(() => {
        const start = page * rowsPerPage
        return filtered.slice(start, start + rowsPerPage)
    }, [filtered, page, rowsPerPage])

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg,#f5f7fb, #eef4ff 40%, #ffffff 100%)' }}>
            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2 } }}>
                <Card sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, mb: { xs: 1.5, md: 2.5 }, borderRadius: 4,
                    background: 'linear-gradient(135deg,#153BAA 0%, #00BFFF 100%)', color: '#fff' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }}
                           justifyContent="space-between" gap={1.5}>
                        <Stack spacing={0.25}>
                            <Typography variant="h4" fontWeight={900}>Reportes</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>Ejecución, visualización y exportación</Typography>
                        </Stack>
                        <Chip size="small" label={to} sx={{ bgcolor: 'rgba(255,255,255,.18)', color: '#fff' }} />
                    </Stack>
                </Card>

                <Card sx={{ p: { xs: 1.25, sm: 2 }, mb: { xs: 1.5, md: 2.5 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.75)' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => setRan(true)}
                                    sx={{ borderRadius: 999, px: 2.5, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                                Ejecutar
                            </Button>
                            <Button variant="outlined" startIcon={<FileDownloadIcon />} disabled={!filtered.length}
                                    onClick={() => csvDownload(filtered, `reporte_${report}_${from}_${to}.csv`)}
                                    sx={{ borderRadius: 999, px: 2.5, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                                Exportar
                            </Button>
                            <Button startIcon={<SaveIcon />} disabled={!filtered.length}
                                    sx={{ borderRadius: 999, px: 2.5, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                                Guardar
                            </Button>
                            <Button color="success" startIcon={<ScheduleIcon />} onClick={() => setOpenProg(true)}
                                    sx={{ borderRadius: 999, px: 2.5, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                                Programar
                            </Button>
                        </Stack>
                        <Chip icon={<TuneIcon />} label="Preferencias" size="small" variant="outlined"
                              sx={{ alignSelf: { xs: 'stretch', md: 'center' } }} />
                    </Stack>
                </Card>

                <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
                    <Grid item xs={12}>
                        <Card sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: 4 }}>
                            <Grid container spacing={{ xs: 1.5, md: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Selección de reporte</Typography>
                                    <RadioGroup
                                        row
                                        value={report}
                                        onChange={(_, v) => setReport(v as ReportKind)}
                                        sx={{
                                            // 💻 Desktop: no wrap
                                            flexWrap: { xs: 'wrap', md: 'nowrap' },
                                            '& .MuiFormControlLabel-root': {
                                                mr: { md: 3 },
                                                mb: { xs: 0.5, md: 0 },
                                                width: { xs: '50%', sm: '33%', md: 'auto' }, // móvil en grid; desktop ancho auto
                                            },
                                        }}
                                    >
                                        <FormControlLabel value="quiebres" control={<Radio />} label="Quiebres" />
                                        <FormControlLabel value="rotacion" control={<Radio />} label="Rotación" />
                                        <FormControlLabel value="aging" control={<Radio />} label="Aging" />
                                        <FormControlLabel value="valorizacion" control={<Radio />} label="Valorización" />
                                        <FormControlLabel value="facturas" control={<Radio />} label="Facturas" />
                                        <FormControlLabel value="sla" control={<Radio />} label="SLA" />
                                    </RadioGroup>
                                </Grid>

                                {/* RANGO*/}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Rango de fechas</Typography>
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                                        <TextField
                                            type="date"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthIcon fontSize="small" /></InputAdornment> }}
                                            sx={{ minWidth: { md: 220 } }} // 💻 evita que se encoja
                                            fullWidth
                                        />
                                        <TextField
                                            type="date"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarMonthIcon fontSize="small" /></InputAdornment> }}
                                            sx={{ minWidth: { md: 220 } }} // 💻 evita que se encoja
                                            fullWidth
                                        />
                                    </Stack>
                                </Grid>

                                {/* ALTERNATIVAS */}
                                <Grid item xs={12}>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        alignItems={{ xs: 'stretch', sm: 'center' }}
                                        justifyContent="space-between"
                                        sx={{ mb: 1 }}
                                        spacing={1}
                                    >
                                        <Typography variant="subtitle2">KPI</Typography>
                                        <ToggleButtonGroup size="small" value={chart} exclusive onChange={(_, v) => v && setChart(v)}>
                                            <ToggleButton value="bar"><BarChartIcon fontSize="small" /></ToggleButton>
                                            <ToggleButton value="line"><ShowChartIcon fontSize="small" /></ToggleButton>
                                            <ToggleButton value="pie"><PieChartIcon fontSize="small" /></ToggleButton>
                                        </ToggleButtonGroup>
                                    </Stack>

                                    <Grid container spacing={1.25} sx={{ mb: 2 }}>
                                        {[
                                            { label: 'Valor inventario', value: `$${new Intl.NumberFormat('es-CL').format(kpis.total)}` },
                                            { label: 'Unidades', value: kpis.unidades },
                                            { label: '% Críticos', value: rowsAll.length ? Math.round((kpis.criticos / rowsAll.length) * 100) + '%' : '0%' },
                                            { label: 'Facturas mes', value: rowsAll.length },
                                        ].map((k, i) => (
                                            <Grid item xs={6} sm={3} key={i}>
                                                <Card sx={{ px: 2, py: 1.25, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid rgba(0,0,0,0.06)' }}>
                                                    <Typography variant="caption" color="text.secondary">{k.label}</Typography>
                                                    <Typography variant="subtitle1" fontWeight={900}>{k.value as any}</Typography>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* CONTENEDOR GRÁFICO */}
                                    <Card sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, border: '1px dashed rgba(0,0,0,0.12)', display: 'grid', placeItems: 'center', height: { xs: 180, sm: 220 } }}>
                                        <Stack alignItems="center" spacing={0.75} sx={{ color: 'text.secondary' }}>
                                            {chart === 'bar' && <BarChartIcon fontSize="large" />}
                                            {chart === 'line' && <ShowChartIcon fontSize="large" />}
                                            {chart === 'pie' && <PieChartIcon fontSize="large" />}
                                            <Typography variant="body2">
                                                {ran ? (rowsAll.length ? 'Vista de gráfico (mock)' : 'Sin datos') : 'Ejecuta el reporte para ver el gráfico'}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>

                    {/* TABLA */}
                    <Grid item xs={12}>
                        <Card sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1.25 }}>Tabla detalle</Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1.25 }}>
                                <TextField
                                    placeholder="Filtrar producto"
                                    value={filters.producto}
                                    onChange={(e) => { setFilters(s => ({ ...s, producto: e.target.value })); setPage(0) }}
                                    fullWidth
                                />
                                <TextField
                                    placeholder="Filtrar categoría"
                                    value={filters.categoria}
                                    onChange={(e) => { setFilters(s => ({ ...s, categoria: e.target.value })); setPage(0) }}
                                    fullWidth
                                />
                            </Stack>

                            <TableContainer sx={{ maxHeight: 460, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', overflowX: 'auto' }}>
                                <Table stickyHeader size="small" sx={{ minWidth: 680 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Categoría</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">Costo</TableCell>
                                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Fecha</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paged.map((r, idx) => (
                                            <TableRow key={idx} hover sx={{ '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                                                <TableCell>{r.producto}</TableCell>
                                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{r.categoria}</TableCell>
                                                <TableCell align="right">{r.cantidad}</TableCell>
                                                <TableCell align="right">${new Intl.NumberFormat('es-CL').format(r.costo)}</TableCell>
                                                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{r.fecha}</TableCell>
                                            </TableRow>
                                        ))}
                                        {paged.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>Sin resultados</Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                component="div"
                                count={filtered.length}
                                page={page}
                                onPageChange={(_, p) => setPage(p)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
                                rowsPerPageOptions={[5, 10, 25]}
                                labelRowsPerPage="Filas por página"
                            />

                            <Divider sx={{ my: 1.5 }} />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="center">
                                <Button variant="outlined" startIcon={<FileDownloadIcon />} disabled={!filtered.length}
                                        onClick={() => csvDownload(filtered, `reporte_${report}_${from}_${to}.csv`)}
                                        sx={{ borderRadius: 999, px: 2.5 }}>
                                    Exportar
                                </Button>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>

                {/* MODAL PROXIMAMENTE SEPARAR FACTURIZAR O LA  WEA SERA LARGA */}
                <Dialog open={openProg} onClose={() => setOpenProg(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3, p: 0.5 } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Programar reporte</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField select label="Frecuencia" value={prog.frecuencia} onChange={(e) => setProg(s => ({ ...s, frecuencia: e.target.value }))}>
                                <MenuItem value="Semanal">Semanal</MenuItem>
                                <MenuItem value="Mensual">Mensual</MenuItem>
                                <MenuItem value="Trimestral">Trimestral</MenuItem>
                            </TextField>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <TextField label="Día" value={prog.dia} onChange={(e) => setProg(s => ({ ...s, dia: e.target.value }))} fullWidth />
                                <TextField label="Hora" value={prog.hora} onChange={(e) => setProg(s => ({ ...s, hora: e.target.value }))} fullWidth />
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={() => setOpenProg(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={() => setOpenProg(false)}>Guardar programación</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}
