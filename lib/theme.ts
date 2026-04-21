"use client"

import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      dark: "#1565c0",
      light: "#42a5f5",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "var(--font-sans)",
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 8,
  },
})
