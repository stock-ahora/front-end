'use client'

import * as React from 'react'
import { Snackbar, Alert, AlertColor, SnackbarOrigin, Box } from '@mui/material'
import { keyframes } from '@mui/material/styles'

type Props = {
    message: string
    severity?: AlertColor
    anchorOrigin?: SnackbarOrigin
    duration?: number
    autoOpen?: boolean
    autoOpenOnceKey?: string
    defaultOpen?: boolean
}

const grow = keyframes`
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
`

export default function NotifyPopup({
                                        message,
                                        severity = 'info',
                                        anchorOrigin = { vertical: 'top', horizontal: 'right' },
                                        duration = 4000,
                                        autoOpen = false,
                                        autoOpenOnceKey,
                                        defaultOpen = false,
                                    }: Props) {
    const [open, setOpen] = React.useState(defaultOpen)
    const [paused, setPaused] = React.useState(false)
    const [animKey, setAnimKey] = React.useState(0)

    React.useEffect(() => {
        if (autoOpen) {
            setAnimKey(k => k + 1)
            setOpen(true)
        }
    }, [autoOpen])

    React.useEffect(() => {
        if (!autoOpenOnceKey || typeof window === 'undefined') return
        const seen = localStorage.getItem(autoOpenOnceKey)
        if (!seen) {
            requestAnimationFrame(() => {
                setAnimKey(k => k + 1)
                setOpen(true)
            })
            localStorage.setItem(autoOpenOnceKey, '1')
        }
    }, [autoOpenOnceKey])

    React.useEffect(() => {
        if (!open) return
        const id = setTimeout(() => setOpen(false), duration)
        return () => clearTimeout(id)
    }, [open, duration])

    const handleClose = () => setOpen(false)

    return (
        <Snackbar open={open} onClose={handleClose} anchorOrigin={anchorOrigin}>
            <Box
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                sx={{
                    position: 'relative',
                    borderRadius: 1.5,
                    boxShadow: 3,
                    overflow: 'hidden',
                    minWidth: 340,
                    bgcolor: '#fff',
                }}
            >
                <Alert
                    icon={false}
                    severity={severity}
                    variant="outlined"
                    onClose={handleClose}
                    sx={{
                        bgcolor: '#fff',
                        color: 'text.primary',
                        borderColor: t => t.palette.divider,
                        '& .MuiAlert-action': { alignItems: 'center' },
                        px: 2,
                        py: 1.25,
                    }}
                >
                    {message}
                </Alert>

                <Box
                    key={animKey}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 4,
                        transformOrigin: 'left',
                        transform: 'scaleX(0)',
                        animation: `${grow} ${duration}ms linear forwards`,
                        animationPlayState: paused ? 'paused' : 'running',
                        bgcolor: t => t.palette.primary.main,
                        willChange: 'transform',
                    }}
                />
            </Box>
        </Snackbar>
    )
}
