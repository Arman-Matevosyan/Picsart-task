import { darkTheme, lightTheme } from "@design-system/theme";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Get the initial theme from localStorage or system preference
 *
 * This function is called synchronously during initialization,
 * but we minimize its impact by using it only once
 */
const getInitialTheme = (): ThemeMode => {
  try {
    const savedTheme = localStorage.getItem("theme") as ThemeMode;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
  } catch {
    console.warn("Could not access localStorage for theme");
  }

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

/**
 * ThemeProvider component for managing theme state
 *
 * Optimizations:
 * 1. Uses useMemo for theme object to prevent unnecessary re-renders
 * 2. Uses useCallback for toggleTheme to maintain referential equality
 * 3. Batches DOM updates and localStorage writes efficiently
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

  const isDark = useMemo(() => mode === "dark", [mode]);
  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("theme", mode);
      } catch {
        console.warn("Could not save theme to localStorage");
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [mode, isDark]);

  // memo toggle handler to maintain referential equality
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  // memo context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ mode, toggleTheme, isDark }),
    [mode, toggleTheme, isDark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
