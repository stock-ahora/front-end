'use client'

import * as React from 'react'
import { CircularProgress, Typography, Box } from '@mui/material'

type LoadingProps = React.ComponentProps<typeof CircularProgress> & { value: number }

function Loading(props: LoadingProps) {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'inline-flex',
            }}
        >
            <CircularProgress
                variant="determinate"
                {...props}
                size={100}
                thickness={4}
                sx={{
                    color: '#22B8F0',
                    backgroundColor: '#E6F7FD',
                    borderRadius: '50%',
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" sx={{ color: '#0F172A' }}>
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    )
}

export default function CircularWithValueLabel() {
    const [progress, setProgress] = React.useState(10)

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 10))
        }, 800)
        return () => {
            clearInterval(timer)
        }
    }, [])

    return <Loading value={progress} />
}
