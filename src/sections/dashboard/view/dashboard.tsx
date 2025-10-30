'use client'

import React from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {
    Box, Container, Grid, Card, CardActionArea, Typography, Divider,
    Chip, Stack, Badge, Tooltip, CardHeader, CardContent
} from '@mui/material'
import {alpha} from '@mui/material/styles'
import AssessmentIcon from '@mui/icons-material/Assessment'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptIcon from '@mui/icons-material/Receipt'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BoltIcon from '@mui/icons-material/Bolt'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import dayjs from 'dayjs'
import 'dayjs/locale/es'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar'
import {esES} from '@mui/x-date-pickers/locales'

import ChatbotWidget from '@/components/dashboard/components/chat-bot'
import NotifyPopup from '@/components/ui/notify-popup'

dayjs.locale('es')

export default function DashboardSelector() {
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'
    if (isLoginPage) return null

    const quickTiles = [
        {
            title: 'Notificaciones',
            icon: NotificationsIcon,
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
            href: '/invoice',
            bg: 'linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)',
            ring: '#ffe69b',
            avatarBg: 'linear-gradient(45deg,#ffa726,#ffd54f)',
            badge: 0,
            hint: 'Documentos por emitir'
        }
    ] as const

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'transparent',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="lg" sx={{py: 6}}>
                <Card
                    sx={{
                        p: {xs: 3, md: 4},
                        borderRadius: 4,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                        background: '#fff',
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <BoltIcon color="primary"/>
                            <Box>
                                <Typography variant="h5" fontWeight={800}>Accesos rápidos</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Atajos a lo más usado: notificaciones, inventario y más.
                                </Typography>
                            </Box>
                        </Stack>


                    </Stack>

                    <Divider textAlign="left" sx={{mb: 3}}>
                        <Typography variant="caption" sx={{color: 'text.secondary'}}>
                            Tu actividad
                        </Typography>
                    </Divider>

                    <Grid container spacing={4} alignItems="stretch">
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                {quickTiles.map((t) => {
                                    const Icon = t.icon
                                    return (
                                        <Grid item xs={12} sm={6} key={t.title}>
                                            <Tooltip title={t.hint} arrow>
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        position: 'relative',
                                                        borderRadius: 3,
                                                        bgcolor: t.bg,
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
                                                        transition: 'transform .2s ease, box-shadow .2s ease',
                                                        overflow: 'hidden',
                                                        '&:hover': {
                                                            transform: 'translateY(-3px)',
                                                            boxShadow: '0 10px 26px rgba(0,0,0,0.12)',
                                                        },
                                                        '&:focus-within': {
                                                            outline: (th) => `2px solid ${alpha(th.palette.primary.main, 0.6)}`
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
                                                        }}
                                                    >
                                                        <Badge
                                                            color="error"
                                                            badgeContent={t.badge}
                                                            overlap="circular"
                                                            sx={{'& .MuiBadge-badge': {boxShadow: '0 0 0 2px #fff'}}}
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
                                                                        opacity: 0.7,
                                                                    },
                                                                }}
                                                            >
                                                                <Icon sx={{color: '#fff', fontSize: 28}}/>
                                                            </Box>
                                                        </Badge>

                                                        <Box sx={{minWidth: 0}}>
                                                            <Typography variant="subtitle1" fontWeight={800} noWrap>
                                                                {t.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" noWrap>
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

                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: 'none',
                                    boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
                                }}
                            >
                                <CardHeader
                                    avatar={<CalendarMonthIcon color="primary"/>}
                                    title={<Typography variant="h6" fontWeight={800}>Calendario</Typography>}
                                    subheader={<Typography variant="body2" color="text.secondary">Agenda y
                                        vencimientos</Typography>}
                                    sx={{pb: 0.5}}
                                />
                                <CardContent sx={{pt: 1}}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        adapterLocale="es"
                                        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                                    >
                                        <DateCalendar
                                            sx={{
                                                borderRadius: 2,
                                                bgcolor: '#f9fafc',
                                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                                                p: 1.5,
                                                '& .MuiPickersDay-root': {
                                                    borderRadius: '8px',
                                                    '&.Mui-selected': (t) => ({
                                                        background: `linear-gradient(45deg, ${t.palette.primary.main}, ${t.palette.primary.light})`
                                                    })
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>

                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{mt: 1}}>
                                        <InfoOutlinedIcon fontSize="small" sx={{color: 'text.secondary'}}/>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Chip size="small" label="Vence hoy" color="error" variant="outlined"/>
                                            <Chip size="small" label="Entrega" color="primary" variant="outlined"/>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Card>
            </Container>

            <NotifyPopup
                message="Tienes nuevas notificaciones disponibles."
                severity="info"
                autoOpenOnceKey="ts_seen_dashboard_toast_v222"
            />

            <ChatbotWidget/>
        </Box>
    )
}
