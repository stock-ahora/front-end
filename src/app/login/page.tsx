'use client'

import { useState, useEffect } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography, Avatar } from '@mui/material'
import { keyframes } from '@mui/system'
import { alpha } from '@mui/material/styles'
import { useAuth } from '@/auth/AuthProvider'

const rotate = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`

const pulse = keyframes`
    0% { transform: scale(1); opacity: 0.95; }
    50% { transform: scale(1.07); opacity: 1; }
    100% { transform: scale(1); opacity: 0.95; }
`

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const { login } = useAuth()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    const handleLogin = () => {
        if (email === '' && password === '') {
            login(
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRBY2NvdW50SWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJleHAiOjE3MzU2ODk2MDAsImlhdCI6MTczNTY4NjAwMH0.x9wnQYxEIzKvZcVtk-3gRlnv71r4MyDFodcM6xlDXgQ'
            )
        } else {
            alert('Credenciales inválidas')
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                px: 2,
                background: t =>
                    `
          radial-gradient(1200px 500px at -10% -10%, ${alpha(t.palette.primary.light, 0.07)}, transparent 60%),
          radial-gradient(1200px 500px at 110% -20%, ${alpha(t.palette.secondary.light, 0.08)}, transparent 55%),
          linear-gradient(180deg,#f6f8fc, #eef3ff 45%, #ffffff 100%)
        `
            }}
        >
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 3,
                        zIndex: 10
                    }}
                >
                    <Box
                        sx={{
                            width: 150,
                            height: 150,
                            borderRadius: '50%',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: `${pulse} 1.6s ease-in-out infinite`
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: -6,
                                borderRadius: '50%',
                                border: '4px solid rgba(0,0,0,0.08)',
                                animation: `${rotate} 2.4s linear infinite`
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.8)',
                                boxShadow: '0 18px 45px rgba(0,0,0,0.18)'
                            }}
                        />
                        <Avatar
                            src="/icon-192x192.png"
                            sx={{
                                width: 90,
                                height: 90,
                                zIndex: 2
                            }}
                        />
                    </Box>

                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'text.primary',
                            fontWeight: 600,
                            fontSize: '0.95rem'
                        }}
                    >
                    </Typography>
                </Box>
            )}

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                    opacity: isLoading ? 0 : 1,
                    transform: isLoading ? 'translateY(10px)' : 'translateY(0)',
                    zIndex: 5
                }}
            >
                <Paper
                    sx={{
                        borderRadius: 4,
                        px: { xs: 3, sm: 4 },
                        py: { xs: 3.5, sm: 4.5 },
                        boxShadow: '0 20px 45px rgba(15,23,42,0.12)',
                        backgroundColor: 'rgba(255,255,255,0.96)',
                        border: '1px solid rgba(148,163,184,0.45)'
                    }}
                >
                    <Stack spacing={3}>
                        <Stack spacing={1} alignItems="center">
                            <Avatar src="/icon-192x192.png" sx={{ width: 72, height: 72 }} />
                            <Typography
                                variant="h4"
                                sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 0.5 }}
                            >
                                true
                                <Box component="span" sx={{ color: 'info.main' }}>
                                    Stock
                                </Box>
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Inicia sesión para acceder al panel de inventario inteligente.
                            </Typography>
                        </Stack>

                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(248,250,252,0.95)'
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(248,250,252,0.95)'
                                    }
                                }}
                            />
                            <Typography
                                variant="body2"
                                align="right"
                                sx={{
                                    color: 'primary.main',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    textDecorationColor: 'transparent',
                                    transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
                                    '&:hover': {
                                        color: 'primary.dark',
                                        textDecorationColor: 'primary.main'
                                    }
                                }}
                            >
                                ¿Olvidaste tu contraseña?
                            </Typography>
                        </Stack>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleLogin}
                            sx={{
                                mt: 1,
                                py: 1.15,
                                borderRadius: 999,
                                fontWeight: 700,
                                textTransform: 'none',
                                letterSpacing: 0.4,
                                fontSize: '0.95rem',
                                background: t =>
                                    `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.info.main} 100%)`,
                                boxShadow: '0 14px 32px rgba(37,99,235,0.35)',
                                '&:hover': {
                                    background: t =>
                                        `linear-gradient(135deg, ${t.palette.primary.dark} 0%, ${t.palette.info.dark} 100%)`,
                                    boxShadow: '0 18px 40px rgba(15,23,42,0.25)'
                                }
                            }}
                        >
                            Iniciar sesión
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Box>
    )
}
