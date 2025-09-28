'use client'

import React, { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Paper, Typography } from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import InventoryIcon from '@mui/icons-material/Inventory'
import SettingsIcon from '@mui/icons-material/Settings'

export default function TrueStockMobile() {

  const [userNane, setUserName] = useState('cargando...');

      return (<>

          <Box
            sx={{
              width: '100%',
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100vh",
              justifyContent: "flex-start",
              paddingTop: "10vh",
              bgcolor: "#fff",
            }}
          >
            {/* Saludo */}
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Hola buenas tardes
            </Typography>
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              {userNane}
            </Typography>

            {/* Contenedor con íconos */}
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                gap: 4,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                cursor: "pointer",
                padding: 3,
                borderRadius: 2,
                mt: 4,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DescriptionIcon sx={{ fontSize: 40 }} />
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>Ingreso productos</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <InventoryIcon sx={{ fontSize: 40 }} />
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>inventario</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SettingsIcon sx={{ fontSize: 40 }} />
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>Configuraciones</Typography>
              </Box>

            </Paper>
          </Box>
        </>
    )
}
