'use client'

import React, { useMemo, useState } from 'react'
import { IconButton, Badge, Menu, MenuItem, ListItemText, Box, Typography, Divider, Button } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Link from 'next/link'

export default function NotificationsBell() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const notifications = useMemo(
        () => [
            { id: 1, title: 'Nueva Facturacion', detail: 'Facturacion Coca Cola', time: 'Hace 30 min' },
            { id: 2, title: 'Inventario Actualizado', detail: '#CON-2024-001 requiere revisión', time: 'Hace 2 h' },
            { id: 3, title: 'Reporte Mensual', detail: 'Generado exitosamente', time: 'Hace 4 h' }
        ],
        []
    )

    const unread = notifications.length

    return (
        <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={unread} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { width: 340 } } }}
            >
                <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>Notificaciones</Typography>
                    <Typography variant="caption" color="text.secondary">{unread} nuevas</Typography>
                </Box>
                <Divider />
                {notifications.map((n) => (
                    <MenuItem key={n.id} onClick={() => setAnchorEl(null)} sx={{ alignItems: 'start', py: 1.2 }}>
                        <ListItemText
                            primary={<Typography variant="body2" fontWeight={600}>{n.title}</Typography>}
                            secondary={
                                <Typography variant="caption" color="text.secondary">
                                    {n.detail} · {n.time}
                                </Typography>
                            }
                        />
                    </MenuItem>
                ))}
                <Divider />
                <Box sx={{ p: 1.5 }}>
                    <Button fullWidth variant="outlined" component={Link} href="/notificaciones" onClick={() => setAnchorEl(null)}>
                        Ver todas
                    </Button>
                </Box>
            </Menu>
        </>
    )
}
