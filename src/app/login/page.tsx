"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { TextField, Button, Box, Typography, Paper } from "@mui/material"
import { useAuth } from "@/auth/AuthProvider"
import { Stack } from '@mui/system'   // 👈 Importa el hook de tu contexto

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()

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

        <Box
          sx={{
            position: "relative",
            margin: "0 auto 20px auto",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "1px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: "0.05px solid rgba(0, 0, 0, 0.3)",
            }}
          />

          <Box

            sx={{
              position: "absolute",
              width: 115,
              height: 80,
              borderRadius: "50%",
              border: "0.05px white solid",
              backgroundColor: "white",
            }}

          />

          <Typography

            variant="h5"
            component="div"
            align="center"
            fontWeight="bold"
            sx={{ fontSize: "1.0rem",
              zIndex: 10
            }}
          >
            Bienvenido<br />a<br />trueStock
          </Typography>
        </Box>


        <Stack sx={{
          mt: 5
        }}>



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

        <Typography

          variant="h5"
          component="div"
          align="center"
          sx={{ fontSize: "0.7rem", color: "text.secondary", mt: 1, mb: 2, display: "block", cursor: "pointer" }}
        >
          Forgot password?
        </Typography>

        <Button fullWidth variant="contained" color="primary" sx={{
          mt: 2,
          width: { xs: 100, sm: "100%" },
          mx: "auto",
          display: "block"

        }} onClick={handleLogin}>
          login
        </Button>

        </Stack>

      </Paper>
    </Box>
  )
}
