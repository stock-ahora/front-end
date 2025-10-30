'use client'

import React, {useMemo, useRef, useState, useEffect} from 'react'
import {Box, Paper, IconButton, Typography, TextField, Button, Stack, Avatar, Chip, Divider, Badge} from '@mui/material'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import MinimizeRoundedIcon from '@mui/icons-material/MinimizeRounded'
import { Autocomplete } from '@mui/material'

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
    const [productos, setProductos] = useState<any[]>([])
    const [productoSel, setProductoSel] = useState<any>(null)

  useEffect(() => {
    fetch('https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/stock/product?page=1&size=1000', {
      headers: {
        'X-Client-Account-Id': '8d1b88f0-e5c7-4670-8bbb-3045f9ab3995',
      },
    })
      .then(r => r.json())
      .then(j => setProductos(j.data))
  }, [])

  // transformamos para crear label único (como countries)
  const options = productos.map(p => ({
    id: p.id,
    name: p.name,
    stock: p.stock,
    // label ÚNICO y humano (como en el ejemplo)
    label: `${p.name} — ${p.id.slice(0, 4)}`,
  }))


  console.log({productoSel})

    useEffect(() => {
        if (open) {
            setUnread(0)
            requestAnimationFrame(() => {
                if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
            })
        }
    }, [open, messages.length])

    const send = async (text: string) => {
      console.log({text})
        if (!text.trim()) return
        if (!productoSel) return

      const Request = {
        id: crypto.randomUUID(),
        role: 'user',
        text: text,
        at: Date.now()
      } as Message


      setMessages(prev => [...prev, Request])

      const r = await fetch('https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/v1/stock/chatbot?productId='+productoSel+"&queryClient="+text, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Account-Id': productoSel,
        },
      })
      const j = await r.json()
      const first = j?.output?.message?.content?.[0].text ?? null;

      console.log({first, j})



      const responseChatBot = {
          id: crypto.randomUUID(),
          role: 'bot',
          text: first,
          at: Date.now()
      } as Message


        setMessages(prev => [...prev, responseChatBot])
        setInput('')

    }




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
                      overflow: 'visible',
                      overflowY: 'visible',
                        bottom: 96,
                        width: {xs: 320, sm: 360},
                        height: 480,
                        borderRadius: 3,
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
                                    Ayuda sobre productos y inventario
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

                        </Stack>
                    </Box>

                    <Divider/>

                    <Box sx={{p: 1.5}}>
                        <Stack direction="row" spacing={1}>
                        </Stack>
                    </Box>
                  <Box sx={{p: 1.5,
                    sx: { zIndex: 99999 },
                  }}>
                    <Autocomplete
                      disablePortal
                      slotProps={{
                        popper: {
                          sx: { zIndex: 3000 },   // por encima del Paper (1400 en tu case)
                        }
                      }}
                      sx={{ width: 300 }}
                      options={options}
                      autoHighlight

                      // qué se muestra en el input
                      getOptionLabel={(option) => option.label}

                      value={options.find(o => o.id === productoSel) ?? null}
                      onChange={(_, v) => setProductoSel(v?.id ?? null)}

                      renderOption={(props, option) => {
                        const { key, ...rest } = props
                        return (
                          <Box key={key} component="li" {...rest}>
                            {option.name} — stock:{option.stock}
                          </Box>
                        )
                      }}

                      renderInput={(params) =>
                        <TextField
                          {...params}
                          label="Selecciona producto"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // igual que tu ejemplo
                          }}
                        />
                      }
                    />


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
