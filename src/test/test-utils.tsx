import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

const mockTheme = {
  colors: {
    textPrimary: "#000000",
    textSecondary: "#666666",
    background: "#ffffff",
    primary: "#3498db",
    secondary: "#2ecc71",
    skeleton: "#f0f0f0",
    accent: "#e74c3c",
  },
  borderRadius: {
    small: "2px",
    medium: "4px",
    large: "8px",
    rounded: "50%",
  },
  boxShadow: {
    small: "0 1px 3px rgba(0,0,0,0.12)",
    medium: "0 4px 6px rgba(0,0,0,0.12)",
    large: "0 10px 20px rgba(0,0,0,0.12)",
  },
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export function renderWithProviders(ui: ReactElement) {
  const testQueryClient = createTestQueryClient();

  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider theme={mockTheme}>
          <MemoryRouter>{ui}</MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    ),
    queryClient: testQueryClient,
  };
}

export const createWrapper = () => {
  const testQueryClient = createTestQueryClient();

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider theme={mockTheme}>
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
