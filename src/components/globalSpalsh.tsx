'use client'

import { useEffect, useState } from 'react'
import { Box, Avatar, Typography } from '@mui/material'
import { keyframes } from '@mui/system'

const rotate = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`

const pulse = keyframes`
    0% { transform: scale(1); opacity: 0.95; }
    50% { transform: scale(1.07); opacity: 1; }
    100% { transform: scale(1); opacity: 0.95; }
`

export function GlobalSplash() {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const hasSeen = window.sessionStorage.getItem('hasSeenSplash')
        if (hasSeen) {
            setShow(false)
            return
        }
        const timer = setTimeout(() => {
            setShow(false)
            window.sessionStorage.setItem('hasSeenSplash', 'true')
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    if (!show) return null

    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                zIndex: 1300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 3,
                background: 'linear-gradient(180deg,#f6f8fc,#eef3ff 45%,#ffffff 100%)'
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
                Cargando panel
            </Typography>
        </Box>
    )
}
