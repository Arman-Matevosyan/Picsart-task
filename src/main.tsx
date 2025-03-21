import { theme } from "@design-system/theme";
import isPropValid from "@emotion/is-prop-valid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import ErrorBoundary from "./@shared/components/ErrorBoundary.tsx";

// lazy load the App
const App = lazy(() => import("./App.tsx"));

const AppLoading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
      color: "#333",
    }}
  >
    Loading...
  </div>
);

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

// create a preconnect link for API domains
function addPreconnect(domain: string) {
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = domain;
  document.head.appendChild(link);
}

// preconnect to API domains
addPreconnect("https://api.unsplash.com");
addPreconnect("https://api.pexels.com");

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
              <Suspense fallback={<AppLoading />}>
                <App />
              </Suspense>
            </BrowserRouter>
          </ThemeProvider>
        </StyleSheetManager>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
