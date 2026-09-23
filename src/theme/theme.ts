import { createTheme } from "@mui/material";
import { PALETTE } from "./palette";

const { green, yellow, rose, orange, cyan, neutral } = PALETTE;

/**
 * Semantic colours from the project palette: green for the result, rose for
 * errors, orange for warnings, cyan for information. Chain colours live in
 * `chains.ts` so they cannot collide with these meanings.
 */
export const theme = createTheme({
  palette: {
    primary: { light: green[400], main: green[600], dark: green[800], contrastText: "#fff" },
    secondary: { light: yellow[300], main: yellow[500], dark: yellow[700], contrastText: "#fff" },
    error: { light: rose[400], main: rose[600], dark: rose[800] },
    warning: { light: orange[400], main: orange[500], dark: orange[700] },
    info: { light: cyan[400], main: cyan[600], dark: cyan[800] },
    success: { light: green[400], main: green[600], dark: green[800] },
    grey: neutral,
    divider: neutral[200],
    background: { default: neutral[50], paper: "#fff" },
    text: { primary: neutral[950], secondary: neutral[700] },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "'Segoe UI'",
      "Roboto",
      "'Helvetica Neue'",
      "sans-serif",
    ].join(","),
  },
});
