'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Typography, Container, Box, Grid, Card, CardActionArea, Avatar, Divider, Chip, Button, Stack
} from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptIcon from '@mui/icons-material/Receipt'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import NotificationCard from '@/components/dashboard/components/notification-card'

export default function DashboardSelector() {
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'
    if (isLoginPage) return null

    const quickTiles = [
        {
            title: 'Notificaciones',
            icon: NotificationsIcon,
            href: '/notification',
            bg: '#eaf2ff',
            ring: '#cfe0ff',
            avatarBg: 'linear-gradient(45deg,#0056b3,#4db8ff)',
        },
        {
            title: 'Inventario',
            icon: InventoryIcon,
            href: '/inventory',
            bg: '#e6f6ff',
            ring: '#b3e6ff',
            avatarBg: 'linear-gradient(45deg,#0288d1,#4db8ff)',
        },
        {
            title: 'Reportes',
            icon: AssessmentIcon,
            href: '/reports',
            bg: '#eaf2ff',
            ring: '#cfe0ff',
            avatarBg: 'linear-gradient(45deg,#0056b3,#4db8ff)',
        },
        {
            title: 'Factura',
            icon: ReceiptIcon,
            href: '/invoice',
            bg: '#fff8e1',
            ring: '#ffe69b',
            avatarBg: 'linear-gradient(45deg,#ffa726,#ffd54f)',
        },
        {
            title: 'Dashboard',
            icon: DashboardIcon,
            href: '/reports/dashboards',
            bg: '#f1ecff',
            ring: '#d8cff6',
            avatarBg: 'linear-gradient(45deg,#7e57c2,#b39ddb)',
        },
    ] as const

    const user = {
        name: 'María González',
        role: 'Project Manager',
        department: 'Operations',
        email: 'maria.gonzalez@truestock.cl',
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Container component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={7}>
                        <NotificationCard sx={{ borderRadius: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={4} lg={5} sx={{ mt: { xs: 1, md: 0 } }}>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            {quickTiles.map((t) => (
                                <Grid item xs={12} sm={6} key={t.title}>
                                    <Card
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: t.bg,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
                                            transition: 'transform .2s ease, box-shadow .2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 8px 22px rgba(0,0,0,0.12)',
                                            },
                                        }}
                                    >
                                        <CardActionArea
                                            component={Link}
                                            href={t.href}
                                            sx={{
                                                p: 2.5,
                                                height: 120,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1.5,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: 54,
                                                    height: 54,
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
                                                <t.icon sx={{ color: '#fff' }} />
                                            </Box>
                                            <Box sx={{ minWidth: 0, textAlign: 'left' }}>
                                                <Typography variant="subtitle1" fontWeight={700} noWrap>
                                                    {t.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    Abrir {t.title}
                                                </Typography>
                                            </Box>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Card
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 6px 18px rgba(0,0,0,0.10)',
                            }}
                        >
                            <Box sx={{ height: 60, bgcolor: 'primary.main' }} />
                            <Box sx={{ px: 2.5, pb: 2.5, mt: -4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            border: '3px solid #fff',
                                            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                            bgcolor: 'primary.main',
                                        }}
                                    >
                                        <PersonOutlineIcon sx={{ color: '#fff' }} />
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="subtitle1" fontWeight={800} noWrap>
                                            {user.name}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                                            <Chip size="small" label={user.role} sx={{ fontWeight: 600 }} />
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                · {user.department}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
                                            {user.email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 1.5 }} />

                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button variant="outlined" startIcon={<PersonOutlineIcon />} component={Link} href="/profile">
                                        View profile
                                    </Button>
                                    <Button variant="contained" startIcon={<SettingsOutlinedIcon />} component={Link} href="/settings">
                                        Settings
                                    </Button>
                                </Stack>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}
