'use client'

import React, { useMemo, useRef, useState } from 'react'
import {
    Box, Container, Typography, Card, Stack, Button, IconButton, Grid, Chip,
    Table, TableHead, TableRow, TableCell, TableBody, TextField, Divider, Snackbar, Alert, CircularProgress
} from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'

type Item = { id: string; producto: string; cantidad: number; precio: number }

export default function OCRScanPage() {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const cameraRef = useRef<HTMLInputElement | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [items, setItems] = useState<Item[]>([])
    const [loadingOCR, setLoadingOCR] = useState(false)
    const [saving, setSaving] = useState(false)
    const [snack, setSnack] = useState<{ open: boolean; msg: string; sev: 'success'|'error'|'info' }>({ open: false, msg: '', sev: 'success' })

    const total = useMemo(() => items.reduce((s, it) => s + it.cantidad * it.precio, 0), [items])

    const handlePick = () => inputRef.current?.click()
    const handleCamera = () => cameraRef.current?.click()

    const handleFile = (f: File | null) => {
        if (!f) return
        setFile(f)
        const url = URL.createObjectURL(f)
        setPreviewUrl(url)
        setItems([])
        setLoadingOCR(true)
        setTimeout(() => {
            setItems([
                { id: crypto.randomUUID(), producto: 'Producto A', cantidad: 2, precio: 1290 },
                { id: crypto.randomUUID(), producto: 'Producto B', cantidad: 1, precio: 2590 }
            ])
            setLoadingOCR(false)
        }, 1200)
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
        setItems([])
        setLoadingOCR(false)
    }

    const updateItem = (id: string, patch: Partial<Item>) => {
        setItems(prev => prev.map(it => (it.id === id ? { ...it, ...patch } : it)))
    }

    const addEmpty = () => setItems(prev => [{ id: crypto.randomUUID(), producto: '', cantidad: 1, precio: 0 }, ...prev])
    const removeItem = (id: string) => setItems(prev => prev.filter(it => it.id !== id))

    const saveToInventory = async () => {
        if (!file || items.length === 0) {
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
                                <Chip label={items.length ? `${items.length} ítems` : '0 ítems'} color={items.length ? 'success' : 'default'} />
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
                                            <TableCell align="right">$</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map(it => (
                                            <TableRow key={it.id}>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={it.producto}
                                                        onChange={(e) => updateItem(it.id, { producto: e.target.value })}
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ width: 108 }}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        type="number"
                                                        inputProps={{ min: 0 }}
                                                        value={it.cantidad}
                                                        onChange={(e) => updateItem(it.id, { cantidad: Math.max(0, Number(e.target.value)) })}
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ width: 140 }}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        type="number"
                                                        inputProps={{ min: 0 }}
                                                        value={it.precio}
                                                        onChange={(e) => updateItem(it.id, { precio: Math.max(0, Number(e.target.value)) })}
                                                    />
                                                </TableCell>
                                                <TableCell align="center" sx={{ width: 88 }}>
                                                    <IconButton onClick={() => removeItem(it.id)}><DeleteIcon fontSize="small" /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {items.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>Sin datos</Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                                    <Button onClick={addEmpty}>Agregar fila</Button>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography variant="subtitle2">Total</Typography>
                                        <Typography variant="h6" fontWeight={800}>${new Intl.NumberFormat('es-CL').format(total)}</Typography>
                                    </Stack>
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                <Stack alignItems="center">
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={!file || items.length === 0 || saving}
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
