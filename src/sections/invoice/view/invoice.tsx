'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Box, Container, Typography, Card, Stack, Button, IconButton, Grid, Chip,
    Table, TableHead, TableRow, TableCell, TableBody, TextField, Divider, Snackbar, Alert, CircularProgress,
  ToggleButtonGroup, ToggleButton
} from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'


export default function OCRScanPage() {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const cameraRef = useRef<HTMLInputElement | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [loadingOCR, setLoadingOCR] = useState(false)
    const [saving, setSaving] = useState(false)
    const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success'|'error'|'info' }>({ open: false, msg: '', sev: 'success' })
    const [inOut, setInOut] = useState('in');
    const [requestID, setRequestID] = useState('');
  const { request, setRequest } = usePollRequest(requestID, 5000, setLoadingOCR);

  console.log({loadingOCR})
  console.log({requestID})

  const handleEnviarSolicitud = async () => {
    if (!file) return
    setLoadingOCR(true)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', inOut)          // 'in' o 'out'

    const res = await fetch('https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/stock/request', {
      method: 'POST',
      headers: {
        // Ojo: NO se setea Content-Type cuando se usa FormData
        'X-Client-Account-Id': '8d1b88f0-e5c7-4670-8bbb-3045f9ab3995',
      },
      body: fd,
    })

    console.log('Response status:', res)

    if (res.status !== 201) {
      console.error('Error', await res.text())
      setLoadingOCR(false)
      return
    }

    const data: StockRequest = await res.json();

    setRequestID(data.ID);
    console.log('OK', data)
  }


    const handlePick = () => inputRef.current?.click()
    const handleCamera = () => cameraRef.current?.click()

    const handleFile = (f: File | null) => {
        if (!f) return
        setFile(f)
        const url = URL.createObjectURL(f)
        setPreviewUrl(url)
        setRequest(undefined)
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null
        handleFile(f)
        e.target.value = ''
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const f = e.dataTransfer.files?.[0] || null
        handleFile(f)
    }

    const resetAll = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        setFile(null)
        setRequest(undefined)
        setLoadingOCR(false)
    }



    const saveToInventory = async () => {
        if (!file || request?.movements.length === 0) {
            setSnack({ open: true, msg: 'Falta archivo o ítems', sev: 'error' })
            return
        }
        setSaving(true)
        setTimeout(() => {
            setSaving(false)
            setSnack({ open: true, msg: 'Factura guardada en inventario', sev: 'success' })
            resetAll()
        }, 1000)
    }

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>Facturas</Typography>
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                <Button variant="contained" startIcon={<UploadIcon />} onClick={handlePick}>Subir Factura</Button>
                <Button variant="outlined" startIcon={<PhotoCamera />} onClick={handleCamera}>Tomar Foto</Button>
              <ToggleButtonGroup
                value={inOut}
                exclusive
                onChange={(e, v) => v && setInOut(v)}
                size="small"
              >
                <ToggleButton value="in">ENTRADA</ToggleButton>
                <ToggleButton value="out">SALIDA</ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="contained"
                startIcon={!loadingOCR && <SaveIcon />}
                disabled={!file || request?.movements?.length === 0 || loadingOCR}
                onClick={handleEnviarSolicitud}
                sx={{ borderRadius: 999, px: 3 }}
              >
                {loadingOCR ? 'Enviando…' : 'Enviar solicitud'}
              </Button>

                <IconButton onClick={resetAll} disabled={!file}><RestartAltIcon /></IconButton>
            </Stack>

            <input ref={inputRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={onInputChange} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onInputChange} />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card
                        onDrop={onDrop}
                        onDragOver={(e) => e.preventDefault()}
                        sx={{
                            p: 2, minHeight: 240, display: 'grid', placeItems: 'center', borderRadius: 3,
                            border: '2px dashed rgba(0,0,0,0.15)', bgcolor: 'background.paper'
                        }}
                    >
                        {!previewUrl && (
                            <Stack alignItems="center" spacing={1}>
                                <Typography variant="body1">Arrastra aquí una imagen o PDF</Typography>
                                <Chip label="o usa los botones de arriba" />
                            </Stack>
                        )}
                        {!!previewUrl && (
                            <Box sx={{ width: '100%', maxHeight: 380, overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
                                {file?.type === 'application/pdf' ? (
                                    <object data={previewUrl} type="application/pdf" width="100%" height="380">
                                        <Box sx={{ p: 2, textAlign: 'center' }}>Vista previa no disponible</Box>
                                    </object>
                                ) : (
                                    <Box component="img" src={previewUrl} alt="vista" sx={{ maxWidth: '100%', maxHeight: 380, borderRadius: 2 }} />
                                )}
                            </Box>
                        )}
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card sx={{ p: 2, borderRadius: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={700}>Datos extraídos</Typography>
                            <Stack direction="row" spacing={1}>
                                <Chip label={file ? file.name : 'Sin archivo'} />
                                <Chip label={request?.movements?.length ? `${request?.movements?.length} ítems` : '0 ítems'} color={request?.movements?.length ? 'success' : 'default'} />
                            </Stack>
                        </Stack>

                        {loadingOCR && (
                            <Stack alignItems="center" sx={{ py: 4 }}>
                                <CircularProgress />
                                <Typography variant="body2" sx={{ mt: 1 }}>Procesando OCR…</Typography>
                            </Stack>
                        )}

                        {!loadingOCR && (
                            <>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {request?.movements.map(it => (
                                            <TableRow key={it.id}>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={it.nombre}
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ width: 108 }}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        type="number"
                                                        inputProps={{ min: 0 }}
                                                        value={it.count}
                                                        onChange={(e) => {
                                                          const val = parseInt(e.target.value, 10) || 0

                                                          setRequest(prev => {
                                                            if (!prev) return prev             // por si null

                                                            return {
                                                              ...prev,
                                                              movements: prev.movements.map(m =>
                                                                m.id === it.id
                                                                  ? { ...m, count: val }       // actualizo solo este movimiento
                                                                  : m
                                                              ),
                                                            }
                                                          })
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center" sx={{ width: 88 }}>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {request?.movements.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>Sin datos</Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                                    <Button onClick={() => {}}>Agregar fila</Button>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                    </Stack>
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                <Stack alignItems="center">
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={!file || request?.movements.length === 0 || saving}
                                        onClick={saveToInventory}
                                        sx={{ borderRadius: 999, px: 3 }}
                                    >
                                        {saving ? 'Guardando…' : 'Guardar en Inventario'}
                                    </Button>
                                </Stack>
                            </>
                        )}
                    </Card>
                </Grid>
            </Grid>

            <Snackbar
                open={snack.open}
                autoHideDuration={2500}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export interface StockRequest {
  ID: string;
  ClientAccountID: string;
  Status: string;
  CreatedAt: string;     // o Date si después la parseas
  UpdatedAt: string;
  MovementTypeId: number;
  Documents: any | null; // ajustalo si conocés el shape
}

export interface Movement {
  id: string;
  nombre: string;
  count: number;
  created_at: string;   // ISO datetime
  updated_at: string;   // ISO datetime
}

export interface Request {
  id: string;
  request_type: 'in' | 'out' | string;
  status: 'pending' | 'approved' | 'rejected' | string;
  created_at: string;     // ISO datetime
  updated_at: string;     // ISO datetime
  client_account_id: string;
  movements: Movement[];
}

export function usePollRequest(id: string | null, intervalMs = 3000, loadingSetter?: (loading: boolean) => void) {
  const [request, setRequest] = useState<Request>();
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOnce = async () => {
      try {
        console.log('Polling request ID:', id);
        loadingSetter?.(true);
        const r = await fetch(
          `https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/stock/request/${id}`,
          { headers: { "X-Client-Account-Id": "8d1b88f0-e5c7-4670-8bbb-3045f9ab3995" } }
        );
        const resultObject = await convertData(r);
        setRequest(resultObject);

        // 👇 Cortar polling si ya pasó a otro estado
        if (resultObject.movements.length !== 0) {
          if (timer.current) clearInterval(timer.current);
          loadingSetter?.(false);
        }
      } finally {
      }
    };



    fetchOnce();
    // luego cada X tiempo
    timer.current = setInterval(fetchOnce, intervalMs);

    // cleanup al desmontar
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [id]);

  const convertData = async (res: Response): Promise<Request> => {
    const json = await res.json();
    return json as Request;
  };

  return { request, setRequest };
}