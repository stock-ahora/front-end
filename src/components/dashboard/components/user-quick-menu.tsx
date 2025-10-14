'use client'

import React, { useState } from 'react'
import {
    IconButton, Menu, Box, Avatar, Typography, Stack, Chip, Divider, Button
} from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

type UserInfo = {
    name: string
    role: string
    department: string
    email: string
    avatarText?: string
}

export default function UserQuickMenu({
                                          user = {
                                              name: 'María González',
                                              role: 'Project Manager',
                                              department: 'Operations',
                                              email: 'maria.gonzalez@truestock.cl',
                                              avatarText: 'MG'
                                          }
                                      }: { user?: UserInfo }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    return (
        <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <PersonOutlineIcon />
            </IconButton>

            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { width: 320, p: 0 } } }}
            >
                <Box sx={{ px: 2.5, pt: 2, pb: 1.75, background: (t) => `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`, color: 'primary.contrastText' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.35)' }}>
                            {user.avatarText ?? user.name.substring(0,2).toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={800} noWrap>{user.name}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip size="small" label={user.role} sx={{ color: 'primary.main', bgcolor: 'primary.contrastText', fontWeight: 700 }} />
                                <Typography variant="caption" sx={{ opacity: 0.9 }} noWrap>· {user.department}</Typography>
                            </Stack>
                            <Typography variant="caption" sx={{ opacity: 0.9 }} noWrap>{user.email}</Typography>
                        </Box>
                    </Stack>
                </Box>

                <Divider />

            </Menu>
        </>
    )
}
