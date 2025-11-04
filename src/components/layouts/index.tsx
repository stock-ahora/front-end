'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {
    AppBar, Toolbar, Typography, Container, Box, IconButton,
    List, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Stack
} from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import MenuIcon from '@mui/icons-material/Menu'
import AssessmentIcon from '@mui/icons-material/Assessment'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptIcon from '@mui/icons-material/Receipt'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DashboardIcon from '@mui/icons-material/Dashboard'
import NotificationsBell from '@/components/dashboard/components/notification-bell'
import UserQuickMenu from '@/components/dashboard/components/user-quick-menu'

export function Layout({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'
    const [drawerOpen, setDrawerOpen] = useState(false)

    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
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
        {label: 'Dashboard', href: '/Dashboard', icon: <AssessmentIcon/>},
        {label: 'Inventario', href: '/inventario', icon: <InventoryIcon/>},
        {label: 'OCR Online', href: '/OCR', icon: <ReceiptIcon/>},
        {label: 'Notificaciones', href: '/notificaciones', icon: <NotificationsIcon/>},
        {label: 'Dashboard', href: '/', icon: <DashboardIcon/>},

    ]

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <AppBar position="static" color="primary" elevation={1}>
                <Toolbar>
                    {/* Logo + marca (link a home) */}
                    <Box
                        component={Link}
                        href="/"
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            gap: 1.25,
                            minWidth: 0,
                        }}
                    >
                        <Box
                            component="img"
                            src="/iconos/truestock-logo.svg"
                            alt="TrueStock"
                            sx={{width: 34, height: 34, display: 'inline-block'}}
                        />
                        <Typography variant="h6" sx={{fontWeight: 800, letterSpacing: 0.2, whiteSpace: 'nowrap'}}>
                            TrueStock
                        </Typography>
                    </Box>


                    <NotificationsBell/>
                    <UserQuickMenu/>

                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="abrir menú"
                        onClick={toggleDrawer(true)}
                        sx={{ml: 1}}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>

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
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    },
                }}
            >
                <Box
                    sx={{
                        px: 2.5,
                        pt: 2.5,
                        pb: 2,
                        background: (t) =>
                            `linear-gradient(90deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
                        color: '#fff',
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            variant="rounded"
                            sx={{bgcolor: 'rgba(255,255,255,0.12)', p: 0.5}}
                        >
                            <Box component="img" src="/iconos/truestock-logo.svg" alt="TS" width={28} height={28}/>
                        </Avatar>
                        <Box sx={{minWidth: 0}}>
                            <Typography variant="subtitle1" fontWeight={700} noWrap>
                                TrueStock
                            </Typography>
                            <Typography variant="body2" sx={{opacity: 0.9}} noWrap>
                                Menú principal
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <List sx={{py: 1}}>
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
                                    bgcolor: (t) =>
                                        t.palette.mode === 'light'
                                            ? 'rgba(0,0,0,0.04)'
                                            : 'rgba(255,255,255,0.06)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{minWidth: 36}}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={<Typography variant="body1" fontWeight={600}>{item.label}</Typography>}
                            />
                        </ListItemButton>
                    ))}
                </List>

                <Divider sx={{my: 1.5}}/>

                <Box sx={{px: 2.5, pb: 2.5}}>
                    <Typography variant="caption" color="text.secondary">
                        © {new Date().getFullYear()} TrueStock
                    </Typography>
                </Box>
            </SwipeableDrawer>

            <Container component="main" sx={{flexGrow: 1, py: 4}}>
                {children}
            </Container>

            <Box
                component="footer"
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (t) => t.palette.grey[200],
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
