import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type ColorModePreference = "system" | "light" | "dark";

const STORAGE_KEY = "colorMode";

const readPreference = (): ColorModePreference => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  } catch {
    // Storage can be unavailable (private windows, blocked site data).
  }
  return "system";
};

interface ColorModeContextValue {
  readonly preference: ColorModePreference;
  readonly setPreference: (preference: ColorModePreference) => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

/**
 * Light or dark theme, following the operating system unless the user picks
 * one. The choice is a per-browser convenience, so it lives in localStorage
 * rather than in the calculator's inputs.
 */
export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ColorModePreference>(readPreference);
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = preference === "system" ? (prefersDark ? "dark" : "light") : preference;

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Not persisting is fine; the toggle still works for this visit.
    }
  }, [preference]);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  const value = useMemo(() => ({ preference, setPreference }), [preference]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const value = useContext(ColorModeContext);
  if (!value) throw new Error("useColorMode must be used inside a ColorModeProvider");
  return value;
}
