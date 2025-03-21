import { theme } from "@design-system/theme";
import isPropValid from "@emotion/is-prop-valid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import ErrorBoundary from "./@shared/components/ErrorBoundary.tsx";
import App from "./App.tsx";

// enable back/forward cache
function enableBFCache() {
  // enable bfcache
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      console.info("Page restored from bfcache");
    }
  });
  // avoid unload events as they can delete bfcache
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
    }
  });
}

enableBFCache();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// custom shouldForwardProp that filters props like 'variant' and 'fullWidth'
const shouldForwardProp = (prop: string) => {
  return isPropValid(prop) && prop !== "variant" && prop !== "fullWidth";
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </StyleSheetManager>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
