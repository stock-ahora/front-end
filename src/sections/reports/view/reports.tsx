'use client'

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {
    Box, Container, Typography, Card, Stack, Button, Chip, TextField, MenuItem,
    ToggleButtonGroup, ToggleButton, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
    RadioGroup, FormControlLabel, Radio, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    TablePagination, InputAdornment, Grid, Avatar, Tooltip
} from '@mui/material'
import {alpha} from '@mui/material/styles'
import { BarChart } from '@mui/x-charts/BarChart';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { LineChart } from '@mui/x-charts'


type ReportKind = 'quiebres' | 'rotacion' | 'aging' | 'valorizacion' | 'facturas' | 'sla'
type ChartKind = 'bar' | 'line' | 'pie'
type Row = { producto: string; categoria: string; cantidad: number; costo: number; fecha: string }


export default function ReportsPage() {

    const boxRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(0)

    useLayoutEffect(() => {
      if (!boxRef.current) return
      const resize = () => setWidth(boxRef.current!.clientWidth)
      resize()
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }, [])

    type ProductoTop = {
      nombre_producto: string;
      unidades: number;
    }

  type OverTimeProduct = {
    fecha: string;
    ingresos: number;
    egresos: number;
  }

    const [to, setTo] = useState<string>(new Date().toISOString().slice(0, 10))
    const [filters, setFilters] = useState({producto: '', categoria: ''})
    const [openProg, setOpenProg] = useState(false)
    const [prog, setProg] = useState({frecuencia: 'Trimestral', dia: '01', hora: '09:00'})
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const clientId = '8d1b88f0-e5c7-4670-8bbb-3045f9ab3995'

    const topColumns = [
      { field: 'nombre_producto', headerName: 'Producto', flex: 1 },
      { field: 'unidades', headerName: 'Unidades', width: 120 },
    ];


  const [productos, setProductos] = useState<ProductoTop[]>([])
  const [productosOverTime, setProductosOverTime] = useState<OverTimeProduct[]>([])



  useEffect(() => {

    fetch(
      'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/dashboard?typeRequet=topProducts',
      {
        headers: {
          'X-Client-Account-Id': clientId
        }
      }
    )
      .then((res) => res.json())
      .then((data: ProductoTop[]) => {
        setProductos(data);
      })
      .catch((err) => console.error(err));
  }, [clientId]);

  useEffect(() => {

    fetch(
      'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/dashboard?typeRequet=movementOverTime',
      {
        headers: {
          'X-Client-Account-Id': clientId
        }
      }
    )
      .then((res) => res.json())
      .then((data: OverTimeProduct[]) => {
        console.log('data', data);
        setProductosOverTime(data);
      })
      .catch((err) => console.error(err));
  }, [clientId]);


  const chartData = useMemo(() => {
    return productosOverTime.map(d => ({
      x: d.fecha.slice(0,10),              // ej: "2024-01-01"
      in: Number(d.ingresos) || 0,
      out: Number(d.egresos) || 0,
    }));
  }, [productosOverTime]);

  console.log('chartData', chartData);

    // @ts-ignore
  return (
        <Box
            sx={{
                minHeight: '100vh',
                background: (t) => `
          radial-gradient(1200px 500px at -10% -10%, ${alpha(t.palette.primary.light, .07)}, transparent 60%),
          radial-gradient(1200px 500px at 110% -20%, ${alpha(t.palette.secondary.light, .08)}, transparent 55%),
          linear-gradient(180deg,#f6f8fc, #eef3ff 45%, #ffffff 100%)
        `,
            }}
        >
            <Container maxWidth="lg" sx={{py: {xs: 2.5, md: 4}, px: {xs: 1.5, sm: 2}}}>
                <Card
                    sx={{
                        p: {xs: 2, md: 3},
                        mb: {xs: 2, md: 3},
                        borderRadius: 4,
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden',
                        background: (t) => `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.info.main} 100%)`,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            right: -60, top: -60, width: 240, height: 240, borderRadius: '50%',
                            background: 'rgba(255,255,255,.15)', filter: 'blur(2px)'
                        }
                    }}
                >
                    <Stack direction={{xs: 'column', sm: 'row'}} alignItems={{xs: 'flex-start', sm: 'center'}}
                           justifyContent="space-between" gap={1.25}>
                        <Stack spacing={0.25}>
                            <Typography variant="h4" fontWeight={900}>Dashboard</Typography>
                            <Typography variant="body2" sx={{opacity: 0.92}}>Ejecución, visualización y
                                exportación</Typography>
                        </Stack>
                        <Chip icon={<CalendarMonthIcon sx={{color: '#fff !important'}}/>} variant="outlined"
                              label={to} sx={{borderColor: 'rgba(255,255,255,.35)', color: '#fff'}}/>
                    </Stack>
                </Card>

                <Grid container spacing={{xs: 2, md: 3}}>
                    <Grid item xs={12}>
                      <Card sx={{ p:{xs:1.75,md:2.25}, borderRadius:4 }}>
                        <Grid container spacing={2.5}>

                          <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb:2 }}>
                              Productos más vendidos
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            {/* Este box define el ancho dinámico */}
                            <Box ref={boxRef} sx={{ width: '100%' }}>
                              {width > 0 && (
                                <BarChart
                                  width={width}
                                  height={400}
                                  xAxis={[{ data: productos.map(p => p.nombre_producto) }]}
                                  series={[{ data: productos.map(p => p.unidades) }]}
                                />
                              )}
                            </Box>
                          </Grid>

                        </Grid>
                      </Card>
                      <Card sx={{ p:{xs:1.75,md:2.25}, borderRadius:4 }}>
                        <Grid container spacing={2.5}>

                          <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb:2 }}>
                              Productos en el tiempo
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            {/* Este box define el ancho dinámico */}
                            <Box ref={boxRef} sx={{ width: '100%' }}>
                              {width > 0 && (
                                <LineChart
                                  width={width}
                                  height={400}
                                  xAxis={[{ data: chartData.map(r => r.x) }]}
                                  series={[
                                    { id: 'Ingresos', data: chartData.map(r => r.in) },
                                    { id: 'Egresos',  data: chartData.map(r => r.out) },
                                  ]}
                                />
                              )}
                            </Box>
                          </Grid>

                        </Grid>
                      </Card>


                    </Grid>

                    <Grid item xs={12}>
                        <Card sx={{p: {xs: 1.75, md: 2.25}, borderRadius: 4}}>
                            <Typography variant="subtitle2" sx={{mb: 1.25}}>Tabla detalle</Typography>

                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} sx={{mb: 1.25}}>
                                <TextField
                                    placeholder="Filtrar producto"
                                    value={filters.producto}
                                    onChange={(e) => {
                                        setFilters(s => ({...s, producto: e.target.value}));
                                        setPage(0)
                                    }}
                                    fullWidth
                                />
                                <TextField
                                    placeholder="Filtrar categoría"
                                    value={filters.categoria}
                                    onChange={(e) => {
                                        setFilters(s => ({...s, categoria: e.target.value}));
                                        setPage(0)
                                    }}
                                    fullWidth
                                />
                            </Stack>

                            <TableContainer sx={{
                                maxHeight: 460,
                                borderRadius: 2,
                                border: '1px solid rgba(0,0,0,0.06)',
                                overflowX: 'auto'
                            }}>
                                <Table stickyHeader size="small" sx={{minWidth: 680}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell
                                                sx={{display: {xs: 'none', sm: 'table-cell'}}}>Categoría</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">Costo</TableCell>
                                            <TableCell sx={{display: {xs: 'none', sm: 'table-cell'}}}>Fecha</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    </TableBody>
                                </Table>
                            </TableContainer>


                            <Divider sx={{my: 1.5}}/>

                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} justifyContent="center">
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>

                <Dialog open={openProg} onClose={() => setOpenProg(false)} fullWidth maxWidth="xs"
                        PaperProps={{sx: {borderRadius: 3, p: 0.5}}}>
                    <DialogTitle sx={{fontWeight: 800}}>Programar reporte</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{mt: 1}}>
                            <TextField select label="Frecuencia" value={prog.frecuencia}
                                       onChange={(e) => setProg(s => ({...s, frecuencia: e.target.value}))}>
                                <MenuItem value="Semanal">Semanal</MenuItem>
                                <MenuItem value="Mensual">Mensual</MenuItem>
                                <MenuItem value="Trimestral">Trimestral</MenuItem>
                            </TextField>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={1}>
                                <TextField label="Día" value={prog.dia}
                                           onChange={(e) => setProg(s => ({...s, dia: e.target.value}))} fullWidth/>
                                <TextField label="Hora" value={prog.hora}
                                           onChange={(e) => setProg(s => ({...s, hora: e.target.value}))} fullWidth/>
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{px: 3, pb: 2}}>
                        <Button onClick={() => setOpenProg(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={() => setOpenProg(false)}>Guardar programación</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}

