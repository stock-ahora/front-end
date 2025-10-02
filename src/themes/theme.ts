// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light", // "dark" si más adelante quieres tema oscuro
        primary: {
            main: "#0056b3",        // azul corporativo
            contrastText: "#ffffff" // texto claro sobre botones/appbar
        },
        secondary: {
            main: "#4db8ff",        // celeste empresarial
            contrastText: "#0f172a" // texto oscuro para contraste
        },
        error: {
            main: "#d32f2f"
        },
        warning: {
            main: "#ed6c02"
        },
        info: {
            main: "#0288d1" // azul claro para mensajes informativos
        },
        success: {
            main: "#2e7d32"
        },
        background: {
            default: "#f5f7fa", // fondo general suave
            paper: "#ffffff"    // fondo de tarjetas y paneles
        },
        text: {
            primary: "#0f172a",   // casi negro, sobrio
            secondary: "#4f5d75"  // gris azulado para subtítulos
        }
    },
    shape: {
        borderRadius: 12
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
        h6: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 600 }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#0056b3" // AppBar en azul corporativo
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow:
                        "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)"
                }
            }
        }
    }
});

export default theme;
