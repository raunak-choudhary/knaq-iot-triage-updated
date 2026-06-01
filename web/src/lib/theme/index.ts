import { createTheme, type Theme } from "@mui/material/styles";

const brandColors = {
  primary: "#EFC01A",
  secondary: "#4B8189",
  error: "#F44336",
  warning: "#FFA726",
  info: "#29B6F6",
  success: "#66BB6A",
};

export function getTheme(mode: "light" | "dark"): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: brandColors.primary,
        contrastText: mode === "light" ? "#000000" : "#000000",
      },
      secondary: {
        main: brandColors.secondary,
        contrastText: "#ffffff",
      },
      error: { main: brandColors.error },
      warning: { main: brandColors.warning },
      info: { main: brandColors.info },
      success: { main: brandColors.success },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
    },
  });
}
