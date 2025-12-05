'use client'

import React, { useEffect } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton
} from '@mui/material'
import { FaHome, FaClock } from 'react-icons/fa'
import { MdNotifications, MdArrowBack } from 'react-icons/md'
import { useRouter } from 'next/navigation'

export default function NotificationCard({ sx = {} as object }) {

  const [notifications, setNotifications] = React.useState<any[]>([])


  useEffect(() => {

    async function load() {

      let notificationsArray: any[] = []

      setNotifications(notificationsArray)

      const r = await fetch(
        'https://pr1vz28mok.execute-api.us-east-2.amazonaws.com/prod/api/stock/movement/notification' ,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const j = await r.json()

      for (let i = 0; i < j.length; i++) {

        const message = j[i].Message
        const type = j[i].Type
        const isRead = j[i].IsRead
        const createdAt = timeAgo(j[i].Date)


        const notification = {
          id: 1,
            title: type === 'request' ? 'Nueva Facturacion Pendiente': 'Peligro Stock',
          description: message ,
          time: createdAt,
          icon: type === 'request' ?  FaHome : FaHome,
          background: type === 'request' ? '#e3f2fd' : '#bbdefb',
          border:  type === 'request' ? '#bbdefb' : '#f8bbd9',
          iconGradient: type === 'request' ? 'linear-gradient(45deg, #1976d2, #42a5f5)' : 'linear-gradient(45deg, #e91e63, #f06292)',
          timeColor: type === 'request' ? '#1976d2' : '#c2185b'
        }

        notificationsArray.push(notification)


        console.log(notificationsArray)
      }
      setNotifications(notificationsArray)

}
      load()

  }, [])




  console.log(notifications)

  const router = useRouter()

  function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      año: 31536000,
      mes: 2592000,
      día: 86400,
      hora: 3600,
      minuto: 60,
      segundo: 1,
    };

    for (const unit in intervals) {
      const value = Math.floor(seconds / intervals[unit]);
      if (value >= 1) {

        if (unit === "segundo") return "hace unos segundos";

        // Pluralización
        const plural = value > 1 ?
          (unit === "mes" ? "meses" : unit + "s")
          : unit;

        return `hace ${value} ${plural}`;
      }
    }

    return "justo ahora";
  }



    return (
        <Card
            sx={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all .3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
                ...sx
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <IconButton onClick={() => router.back()} sx={{ color: '#9e9e9e' }}>
                        <MdArrowBack size={24} />
                    </IconButton>

                    <Typography
                        variant="h6"
                        sx={{ color: 'text.primary', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <MdNotifications style={{ color: '#1976d2' }} />
                        Centro de Notificaciones
                    </Typography>
                </Box>

                <List disablePadding>
                    {notifications.map(n => (
                        <ListItem
                            key={n.id}
                            sx={{ background: n.background, borderRadius: '12px', mb: 2, border: `1px solid ${n.border}` }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ background: n.iconGradient, width: 45, height: 45 }}>
                                    <n.icon style={{ fontSize: 20 }} />
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                        {n.title}
                                    </Typography>
                                }
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
                    <Button
                        variant="outlined"
                        href="/notificaciones"
                        sx={{ borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#1565c0', backgroundColor: '#f3f7ff' } }}
                    >
                        Ver Todas las Notificaciones
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}
