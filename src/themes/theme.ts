// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // "dark" si quieres tema oscuro
    primary: {
      main: "#d9b90c", // azul por defecto, cámbialo a tu color
      contrastText: "#ffffff", // color del texto sobre primary
    },
    secondary: {
      main: "#9c27b0",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ed6c02",
    },
    info: {
      main: "#d9b90c", // azul por defecto, cámbialo a tu color
    },
    success: {
      main: "#2e7d32",
    },
    background: {
      default: "#f5f5f5", // fondo general
      paper: "#ffffff",   // fondo de los componentes tipo Card, Paper
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
