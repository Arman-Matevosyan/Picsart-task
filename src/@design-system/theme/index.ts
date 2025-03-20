export * from "./global-styles";
export * from "./theme";

const baseTheme = {
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.25rem",
      xl: "1.5rem",
      xxl: "2rem",
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  shadows: {
    small: "0 2px 8px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 12px rgba(0, 0, 0, 0.15)",
    large: "0 8px 24px rgba(0, 0, 0, 0.2)",
  },
  transitions: {
    fast: "0.15s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
  },
};

export const lightTheme = {
  ...baseTheme,
  colors: {
    background: "#ffffff",
    backgroundSecondary: "#f8f9fa",
    textPrimary: "#212529",
    textSecondary: "#6c757d",
    primary: "#0d6efd",
    primaryLight: "#cfe2ff",
    primaryDark: "#084298",
    secondary: "#6c757d",
    success: "#198754",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#0dcaf0",
    divider: "#e9ecef",
    border: "#dee2e6",
    skeleton: "#e9ecef",
    backdrop: "rgba(0, 0, 0, 0.5)",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  mode: "light",
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    background: "#121212",
    backgroundSecondary: "#1e1e1e",
    textPrimary: "#e9ecef",
    textSecondary: "#adb5bd",
    primary: "#3b82f6",
    primaryLight: "#1e293b",
    primaryDark: "#93c5fd",
    secondary: "#6c757d",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#06b6d4",
    divider: "#2d3748",
    border: "#4b5563",
    skeleton: "#2d3748",
    backdrop: "rgba(0, 0, 0, 0.75)",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
  mode: "dark",
};

export default lightTheme;
