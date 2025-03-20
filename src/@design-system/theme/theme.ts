export const theme = {
  colors: {
    primary: "#6200ee",
    primaryDark: "#3700b3",
    secondary: "#03dac6",
    secondaryDark: "#018786",
    background: "#ffffff",
    surface: "#ffffff",
    error: "#b00020",
    onPrimary: "#ffffff",
    onSecondary: "#000000",
    onBackground: "#000000",
    onSurface: "#000000",
    onError: "#ffffff",
    textPrimary: "#000000",
    textSecondary: "#757575",
    textDisabled: "#9e9e9e",
    divider: "#e0e0e0",
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  spacing: (multiplier: number) => `${multiplier * 8}px`,
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "16px",
    round: "50%",
  },
  breakpoints: {
    xs: "0px",
    sm: "600px",
    md: "960px",
    lg: "1280px",
    xl: "1920px",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
} as const;

export type Theme = typeof theme;
