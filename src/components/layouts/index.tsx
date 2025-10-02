'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    AppBar, Toolbar, Typography, Container, Box, IconButton,
    List, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Stack
} from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import AssessmentIcon from '@mui/icons-material/Assessment'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptIcon from '@mui/icons-material/Receipt'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NotificationsBell from '@/components/dashboard/components/notification-bell'

export function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'
    const [drawerOpen, setDrawerOpen] = useState(false)

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                // Evita que el tab/shift+tab cierre/abra accidentalmente
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return
                }
                setDrawerOpen(open)
            }

    if (isLoginPage) return <>{children}</>

    const items = [
        { label: 'Reportes', href: '/reportes', icon: <AssessmentIcon /> },
        { label: 'Inventario', href: '/inventario', icon: <InventoryIcon /> },
        { label: 'Facturación', href: '/facturacion', icon: <ReceiptIcon /> },
        { label: 'Notificaciones', href: '/notificaciones', icon: <NotificationsIcon /> },
        { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
    ]

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* AppBar minimal: nombre + campana + hamburguesa */}
            <AppBar position="static" color="primary" elevation={1}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        href="/"
                        sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                    >
                        <HomeIcon sx={{ mr: 1 }} />
                        TrueStock
                    </Typography>

                    {/* Notificaciones */}
                    <NotificationsBell />

                    {/* Tres rayas: abre barra lateral */}
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="abrir menú"
                        onClick={toggleDrawer(true)}
                        sx={{ ml: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Barra lateral tipo teléfono */}
            <SwipeableDrawer
                anchor="right"
                open={drawerOpen}
                onOpen={toggleDrawer(true)}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        width: 320,
                        borderTopLeftRadius: 16,
                        borderBottomLeftRadius: 16,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }
                }}
            >
                {/* Header del drawer */}
                <Box
                    sx={{
                        px: 2.5,
                        pt: 2.5,
                        pb: 2,
                        background: (t) =>
                            `linear-gradient(90deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
                        color: '#fff'
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.25)' }}>TS</Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={700} noWrap>
                                TrueStock
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }} noWrap>
                                Menú principal
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <List sx={{ py: 1 }}>
                    {items.map((item) => (
                        <ListItemButton
                            key={item.label}
                            component={Link}
                            href={item.href}
                            onClick={toggleDrawer(false)}
                            sx={{
                                px: 2.5,
                                py: 1.25,
                                borderRadius: 1.5,
                                mx: 1.25,
                                mb: 0.5,
                                '&:hover': {
                                    bgcolor: (t) => (t.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'),
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="body1" fontWeight={600}>
                                        {item.label}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>

                <Divider sx={{ my: 1.5 }} />

                {/* Footer del drawer (opcional, se ve pro) */}
                <Box sx={{ px: 2.5, pb: 2.5 }}>
                    <Typography variant="caption" color="text.secondary">
                        © {new Date().getFullYear()} TrueStock
                    </Typography>
                </Box>
            </SwipeableDrawer>

            {/* Contenido */}
            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                {children}
            </Container>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (t) => t.palette.grey[200]
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} TrueStock
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}
