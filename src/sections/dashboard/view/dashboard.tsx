'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Box,
    Container,
    Grid,
    Card,
    CardActionArea,
    Typography,
    Divider,
    Stack,
    Badge,
    Tooltip
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import AssessmentIcon from '@mui/icons-material/Assessment'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptIcon from '@mui/icons-material/Receipt'
import NotificationsIcon from '@mui/icons-material/Notifications'
import BoltIcon from '@mui/icons-material/Bolt'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'

import ChatbotWidget from '@/components/dashboard/components/chat-bot'
import NotifyPopup from '@/components/ui/notify-popup'

export default function DashboardSelector() {
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'
    if (isLoginPage) return null

    const quickTiles = [
        {
            title: 'Notificaciones',
            icon: NotificationsIcon,
            disabled: false,
            href: '/notification',
            bg: 'linear-gradient(135deg, #eaf2ff 0%, #f4f8ff 100%)',
            ring: '#cfe0ff',
            avatarBg: 'linear-gradient(45deg,#0056b3,#4db8ff)',
            badge: 0,
            hint: 'Revisa alertas recientes'
        },
        {
            title: 'Inventario',
            icon: InventoryIcon,
            disabled: false,
            href: '/inventory',
            bg: 'linear-gradient(135deg, #e6f6ff 0%, #eefbff 100%)',
            ring: '#b3e6ff',
            avatarBg: 'linear-gradient(45deg,#0288d1,#4db8ff)',
            badge: 0,
            hint: 'Productos bajo stock'
        },
        {
            title: 'Dashboard',
            icon: AssessmentIcon,
            disabled: false,
            href: '/reports',
            bg: 'linear-gradient(135deg, #edf1ff 0%, #f3f0ff 100%)',
            ring: '#d8cff6',
            avatarBg: 'linear-gradient(45deg,#7e57c2,#b39ddb)',
            badge: 0,
            hint: 'Resumen y KPI'
        },
        {
            title: 'OCR Online',
            icon: ReceiptIcon,
            disabled: false,
            href: '/invoice',
            bg: 'linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)',
            ring: '#ffe69b',
            avatarBg: 'linear-gradient(45deg,#ffa726,#ffd54f)',
            badge: 0,
            hint: 'Documentos por emitir'
        },
        {
            title: 'Modelo Predictivo',
            icon: AutoGraphIcon,
            disabled: false,
            href: '/predictive-model',
            bg: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
            ring: '#ef5350',
            avatarBg: 'linear-gradient(45deg,#e53935,#ef5350)',
            badge: 0,
            hint: 'Basado en análisis predictivo'
        }
    ] as const

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'transparent'
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    py: 6,
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: 1200,
                        mx: 'auto',
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                        background: '#fff'
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mb: 2 }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <BoltIcon color="primary" />
                            <Box>
                                <Typography variant="h5" fontWeight={800}>
                                    Accesos rápidos
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Atajos a lo más usado: notificaciones, inventario y más.
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    <Divider textAlign="left" sx={{ mb: 3 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Tu actividad
                        </Typography>
                    </Divider>

                    <Grid container spacing={3} justifyContent="center">
                        <Grid
                            item
                            xs={12}
                            md={12}
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                sx={{ maxWidth: 900, width: '100%' }}
                            >
                                {quickTiles.map(t => {
                                    const Icon = t.icon
                                    return (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            key={t.title}
                                            sx={{ display: 'flex', justifyContent: 'center' }}
                                        >
                                            <Tooltip title={t.hint} arrow sx={{ width: '100%' }}>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        position: 'relative',
                                                        borderRadius: 3,
                                                        bgcolor: t.bg,
                                                        boxShadow:
                                                            '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
                                                        transition: 'transform .2s ease, box-shadow .2s ease',
                                                        overflow: 'hidden',
                                                        opacity: t.disabled ? 0.5 : 1,
                                                        pointerEvents: t.disabled ? 'none' : 'auto',
                                                        height: '100%',
                                                        width: '100%',
                                                        maxWidth: 460,
                                                        '&:hover': {
                                                            transform: 'translateY(-3px)',
                                                            boxShadow: '0 10px 26px rgba(0,0,0,0.12)'
                                                        },
                                                        '&:focus-within': {
                                                            outline: th =>
                                                                `2px solid ${alpha(th.palette.primary.main, 0.6)}`
                                                        }
                                                    }}
                                                >
                                                    <CardActionArea
                                                        component={Link}
                                                        href={t.href}
                                                        sx={{
                                                            p: 3,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            position: 'relative',
                                                            height: '100%',
                                                            minHeight: 110
                                                        }}
                                                    >
                                                        <Badge
                                                            color="error"
                                                            badgeContent={t.badge}
                                                            overlap="circular"
                                                            sx={{
                                                                '& .MuiBadge-badge': {
                                                                    boxShadow: '0 0 0 2px #fff'
                                                                }
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    position: 'relative',
                                                                    width: 56,
                                                                    height: 56,
                                                                    display: 'grid',
                                                                    placeItems: 'center',
                                                                    borderRadius: '50%',
                                                                    background: t.avatarBg,
                                                                    '&::after': {
                                                                        content: '""',
                                                                        position: 'absolute',
                                                                        inset: -3,
                                                                        borderRadius: '50%',
                                                                        border: `2px solid ${t.ring}`,
                                                                        opacity: 0.7
                                                                    }
                                                                }}
                                                            >
                                                                <Icon sx={{ color: '#fff', fontSize: 28 }} />
                                                            </Box>
                                                        </Badge>

                                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight={800}
                                                                sx={{ wordBreak: 'break-word' }}
                                                            >
                                                                {t.title}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mt: 0.25, wordBreak: 'break-word' }}
                                                            >
                                                                Abrir {t.title}
                                                            </Typography>
                                                        </Box>
                                                    </CardActionArea>
                                                </Card>
                                            </Tooltip>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Container>

            <NotifyPopup
                message="Tienes nuevas notificaciones disponibles."
                severity="info"
                autoOpenOnceKey="ts_seen_dashboard_toast_v222"
            />

            <ChatbotWidget />
        </Box>
    )
}
