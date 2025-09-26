"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { TextField, Button, Box, Typography, Paper } from "@mui/material"
import { useAuth } from "@/auth/AuthProvider"   // 👈 Importa el hook de tu contexto

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()  // 👈 Extraes login del contexto

  const handleLogin = () => {
    if (email === "" && password === "") {
      login(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRBY2NvdW50SWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJleHAiOjE3MzU2ODk2MDAsImlhdCI6MTczNTY4NjAwMH0.x9wnQYxEIzKvZcVtk-3gRlnv71r4MyDFodcM6xlDXgQ"
      )
    } else {
      alert("Credenciales inválidas")
    }
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        p: {  xs: 0, sm: 0 },
        m: { xs: 0 },
        width: { xs: '100%' },
        boxSizing: 'border-box'

      }}
    >
      <Paper
        sx={{
          p: { xs: 15, sm: 4 },
          width: { xs: '100%', sm: 350 },
          maxWidth: '100%',
          height: {xs: '100vh', sm: 'auto'},
          borderRadius: { xs: 0, sm: 2 },
          boxShadow: { xs: 0, sm: 3 }
        }}
      >
        <Typography variant="h6" gutterBottom>
          Iniciar Sesión
        </Typography>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin}>
          Entrar
        </Button>
      </Paper>
    </Box>
  )
}
