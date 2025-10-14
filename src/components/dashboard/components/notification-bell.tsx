'use client'

import React, {useMemo, useState} from 'react'
import Link from 'next/link'
import {
    IconButton, Badge, Menu, MenuItem, ListItemText, Box, Typography, Divider, Button, Avatar, Stack
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import {FaHome, FaFileContract, FaChartLine, FaClock} from 'react-icons/fa'

export default function NotificationsBell() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const notifications = useMemo(
        () => [
            {
                id: 1,
                title: 'Nueva Facturación Pendiente',
                detail: 'Se ha agregado una nueva facturación',
                time: 'Hace 30 min',
                bg: '#e3f2fd',
                border: '#bbdefb',
                timeColor: '#1976d2',
                iconGradient: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                Icon: FaHome,
            },
            {
                id: 2,
                title: 'Inventario Actualizado',
                detail: '#CON-2024-001 requiere revisión',
                time: 'Hace 2 h',
                bg: '#fff3e0',
                border: '#ffcc02',
                timeColor: '#f57c00',
                iconGradient: 'linear-gradient(45deg, #ff9800, #ffc107)',
                Icon: FaFileContract,
            },
            {
                id: 3,
                title: 'Reporte Generado',
                detail: 'Reporte mensual listo',
                time: 'Hace 4 h',
                bg: '#e8f5e9',
                border: '#c8e6c9',
                timeColor: '#2e7d32',
                iconGradient: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                Icon: FaChartLine,
            },
            {
                id: 4,
                title: 'Peligro de Stock',
                detail: 'CocaCola < 100 unidades',
                time: 'Hace 1 día',
                bg: '#fce4ec',
                border: '#f8bbd9',
                timeColor: '#c2185b',
                iconGradient: 'linear-gradient(45deg, #e91e63, #f06292)',
                Icon: FaClock,
            },
        ],
        []
    )

    const unread = notifications.length

    return (
        <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={unread} color="error">
                    <NotificationsIcon/>
                </Badge>
            </IconButton>

            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                slotProps={{paper: {sx: {width: 360, p: 0.5}}}}
            >
                <Box sx={{px: 2, pt: 1.5, pb: 1}}>
                    <Typography variant="subtitle1" fontWeight={700}>Notificaciones</Typography>
                    <Typography variant="caption" color="text.secondary">{unread} nuevas</Typography>
                </Box>
                <Divider/>
                {notifications.map(n => (
                    <MenuItem
                        key={n.id}
                        onClick={() => setAnchorEl(null)}
                        sx={{
                            alignItems: 'flex-start',
                            py: 1.25,
                            my: 0.75,
                            mx: 1,
                            borderRadius: 2,
                            bgcolor: n.bg,
                            border: `1px solid ${n.border}`,
                        }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{width: '100%'}}>
                            <Avatar sx={{width: 44, height: 44, background: n.iconGradient}}>
                                <n.Icon size={18}/>
                            </Avatar>
                            <ListItemText
                                primary={<Typography variant="body2" fontWeight={700}>{n.title}</Typography>}
                                secondary={
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{n.detail}</Typography>
                                        <Typography variant="caption" sx={{
                                            color: n.timeColor,
                                            display: 'block',
                                            mt: 0.25,
                                            fontWeight: 600
                                        }}>
                                            {n.time}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Stack>
                    </MenuItem>
                ))}
                <Divider/>
                <Box sx={{p: 1.5}}>
                    <Button fullWidth variant="outlined" component={Link} href="/notificaciones"
                            onClick={() => setAnchorEl(null)}>
                        Ver todas
                    </Button>
                </Box>
            </Menu>
        </>
    )
}
