'use client'

import { Container } from '@mui/material'
import NotificationCard from '@/components/dashboard/components/notification-card'

export default function Page() {
    return (
        <Container maxWidth="md" sx={{ py: 2 }}>
            <NotificationCard />
        </Container>
    )
}
