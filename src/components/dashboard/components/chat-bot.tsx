'use client'

import React, {useMemo, useRef, useState, useEffect} from 'react'
import {Box, Paper, IconButton, Typography, TextField, Button, Stack, Avatar, Chip, Divider, Badge} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import MinimizeRoundedIcon from '@mui/icons-material/MinimizeRounded'

type Message = { id: string; role: 'user' | 'bot'; text: string; at: number }

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
        {
            id: crypto.randomUUID(),
            role: 'bot',
            text: 'Hola, soy tu asistente. ¿En qué proceso necesitas ayuda?',
            at: Date.now()
        }
    ])
    const [unread, setUnread] = useState(0)
    const boxRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (open) {
            setUnread(0)
            requestAnimationFrame(() => {
                if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
            })
        }
    }, [open, messages.length])

    const send = (text: string) => {
        if (!text.trim()) return
        const userMsg: Message = {id: crypto.randomUUID(), role: 'user', text: text.trim(), at: Date.now()}
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setTimeout(() => {
            const replyText =
                text.toLowerCase().includes('inventario')
                    ? 'Para inventario: ve a Inventario → Ingresos/Egresos. ¿Quieres que te guíe paso a paso?'
                    : text.toLowerCase().includes('factura') || text.toLowerCase().includes('boleta')
                        ? 'Para emitir factura: Facturación → Nueva factura. Puedes traer productos desde el inventario.'
                        : text.toLowerCase().includes('reporte') || text.toLowerCase().includes('reportes')
                            ? 'Reportes: Reports → Selecciona el tablero o genera un PDF desde filtros.'
                            : 'Puedo ayudarte con inventario, facturación y reportes. ¿Qué deseas hacer ahora?'
            const botMsg: Message = {id: crypto.randomUUID(), role: 'bot', text: replyText, at: Date.now()}
            setMessages(prev => [...prev, botMsg])
            if (!open) setUnread(u => u + 1)
        }, 500)
    }

    const quick = useMemo(
        () => [
            {label: '¿Cómo crear una factura?', value: '¿Cómo crear una factura?'},
            {label: 'Actualizar stock', value: 'Quiero actualizar el stock'},
            {label: 'Ver reportes', value: '¿Dónde veo los reportes?'}
        ],
        []
    )

    return (
        <>
            <Badge
                overlap="circular"
                badgeContent={unread > 0 ? unread : null}
                color="error"
                sx={{
                    position: 'fixed',
                    right: 20,
                    bottom: 20,
                    zIndex: 1400
                }}
            >
                <IconButton
                    onClick={() => setOpen(v => !v)}
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        boxShadow: '0 8px 28px rgba(0,0,0,.22)',
                        background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                        color: '#fff',
                        '&:hover': {transform: 'translateY(-2px)', boxShadow: '0 10px 32px rgba(0,0,0,.26)'},
                        transition: 'all .18s ease'
                    }}
                >
                    {open ? <MinimizeRoundedIcon/> : <ChatBubbleOutlineIcon/>}
                </IconButton>
            </Badge>

            {open && (
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        right: 20,
                        bottom: 96,
                        width: {xs: 320, sm: 360},
                        height: 480,
                        borderRadius: 3,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1400
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText'
                        }}
                    >
                        <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar
                                sx={{bgcolor: 'primary.contrastText', color: 'primary.main', width: 32, height: 32}}>
                                <HelpOutlineRoundedIcon/>
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} lineHeight={1.1}>
                                    Asistente
                                </Typography>
                                <Typography variant="caption" sx={{opacity: 0.9}}>
                                    Ayuda sobre procesos
                                </Typography>
                            </Box>
                        </Stack>
                        <IconButton size="small" onClick={() => setOpen(false)} sx={{color: 'primary.contrastText'}}>
                            <CloseRoundedIcon fontSize="small"/>
                        </IconButton>
                    </Box>

                    <Box
                        ref={boxRef}
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            px: 2,
                            py: 2,
                            bgcolor: theme => (theme.palette.mode === 'dark' ? 'background.default' : 'background.paper')
                        }}
                    >
                        <Stack spacing={1.5}>
                            {messages.map(m => (
                                <Stack key={m.id} alignItems={m.role === 'user' ? 'flex-end' : 'flex-start'}>
                                    <Box
                                        sx={{
                                            maxWidth: '85%',
                                            px: 1.5,
                                            py: 1.25,
                                            borderRadius: 2,
                                            bgcolor:
                                                m.role === 'user'
                                                    ? 'primary.main'
                                                    : theme => (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100'),
                                            color: m.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                            boxShadow: m.role === 'user' ? '0 2px 10px rgba(0,0,0,.12)' : 'none'
                                        }}
                                    >
                                        <Typography variant="body2">{m.text}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>

                    <Box sx={{px: 2, pt: 1}}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {quick.map(q => (
                                <Chip
                                    key={q.label}
                                    size="small"
                                    label={q.label}
                                    onClick={() => send(q.value)}
                                    sx={{mb: 1}}
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    </Box>

                    <Divider/>

                    <Box sx={{p: 1.5}}>
                        <Stack direction="row" spacing={1}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Escribe tu mensaje..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        send(input)
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => send(input)}
                                startIcon={<SendRoundedIcon/>}
                                sx={{minWidth: 0, px: 2}}
                            >
                                Enviar
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            )}
        </>
    )
}
