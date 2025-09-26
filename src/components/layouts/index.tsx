'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import AssessmentIcon from '@mui/icons-material/Assessment'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptIcon from '@mui/icons-material/Receipt'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DashboardIcon from '@mui/icons-material/Dashboard'

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();
  const isLoginPage = pathname === '/login'; // Ajusta esta ruta según corresponda

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Si estamos en la página de login, solo renderiza el contenido sin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Para cualquier otra página, renderiza el layout completo
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header con MUI AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <HomeIcon sx={{ mr: 1 }} />
            TrueStock
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                sx={{
                  '& .MuiPaper-root': {
                    width: '250px',
                    maxHeight: '80vh',
                  }
                }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} component={Link} href="/Reportes">
                  <AssessmentIcon sx={{ mr: 1 }} />
                  Reportes
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/inventario">
                  <InventoryIcon sx={{ mr: 1 }} />
                  Inventario
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/">
                  <ReceiptIcon sx={{ mr: 1 }} />
                  Facturas
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/">
                  <NotificationsIcon sx={{ mr: 1 }} />
                  Notificación
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/">
                  <DashboardIcon sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/">
                <AssessmentIcon sx={{ mr: 0 }} />
                Reportes</Button>
              <Button color="inherit" component={Link} href="/inventario">
                <InventoryIcon sx={{ mr: 0 }} />
                Inventario</Button>
              <Button color="inherit" component={Link} href="/">
                <ReceiptIcon sx={{ mr: 0 }} />
                Facturas</Button>
              <Button color="inherit" component={Link} href="/inventario">
                <NotificationsIcon sx={{ mr: 0 }} />
                Notificación</Button>
              <Button color="inherit" component={Link} href="/">
                <DashboardIcon sx={{ mr: 0 }} />
                Dashboard</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          {children}
      </Container>

      {/* Footer con MUI */}
      <Box
          component="footer"
          sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: (theme) => theme.palette.grey[200]
          }}
      >
          <Container maxWidth="sm">
              <Typography variant="body2" color="text.secondary" align="center">
                  © {new Date().getFullYear()} TrueStock
              </Typography>
          </Container>
      </Box>
    </Box>
  );
}