'use client'

import React from 'react'
import {
    Box, Typography, Card, CardContent, Button, List, ListItem,
    ListItemAvatar, ListItemText, Avatar
} from '@mui/material'
import { FaHome, FaFileContract, FaChartLine, FaClock } from 'react-icons/fa'
import { MdNotifications } from 'react-icons/md'

export default function NotificationCard({ sx = {} as object }) {
    const notifications = [
        { id: 1, title: 'Nueva Facturacion Pendiente', description: 'Se ha agregado una nueva facturacion', time: 'Hace 30 minutos', icon: FaHome, background: '#e3f2fd', border: '#bbdefb', iconGradient: 'linear-gradient(45deg, #1976d2, #42a5f5)', timeColor: '#1976d2' },
        { id: 2, title: 'Inventario Actualizado', description: 'El producto #CON-2024-001 ha sido modificado y requiere revisión', time: 'Hace 2 horas', icon: FaFileContract, background: '#fff3e0', border: '#ffcc02', iconGradient: 'linear-gradient(45deg, #ff9800, #ffc107)', timeColor: '#f57c00' },
        { id: 3, title: 'Reporte Generado', description: 'El reporte mensual de proyectos ha sido generado exitosamente', time: 'Hace 4 horas', icon: FaChartLine, background: '#e8f5e8', border: '#c8e6c9', iconGradient: 'linear-gradient(45deg, #4caf50, #66bb6a)', timeColor: '#2e7d32' },
        { id: 4, title: 'Peligro Stock', description: 'El producto CocaCola quedan menos de 100 unidades - Requiere renovación', time: 'Hace 1 día', icon: FaClock, background: '#fce4ec', border: '#f8bbd9', iconGradient: 'linear-gradient(45deg, #e91e63, #f06292)', timeColor: '#c2185b' }
    ]

    return (
        <Card sx={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all .3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }, ...sx }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MdNotifications style={{ color: '#1976d2' }} />
                    Centro de Notificaciones
                </Typography>
                <List disablePadding>
                    {notifications.map(n => (
                        <ListItem key={n.id} sx={{ background: n.background, borderRadius: '12px', mb: 2, border: `1px solid ${n.border}` }}>
                            <ListItemAvatar>
                                <Avatar sx={{ background: n.iconGradient, width: 45, height: 45 }}>
                                    <n.icon style={{ fontSize: 20 }} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{n.title}</Typography>}
                                secondary={
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {n.description}
                                        <br />
                                        <Typography component="span" variant="caption" sx={{ color: n.timeColor, fontWeight: 500 }}>
                                            {n.time}
                                        </Typography>
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button variant="outlined" href="/notificaciones" sx={{ borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#1565c0', backgroundColor: '#f3f7ff' } }}>
                        Ver Todas las Notificaciones
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}
