import { theme } from "@design-system/theme";
import { shouldForwardProp } from "@design-system/utils/styleUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense, lazy, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import ErrorBoundary from "./@shared/components/ErrorBoundary.tsx";
import {
  enableBFCacheDebugMode,
  isBFCacheSupported,
} from "./@shared/utils/bfcacheUtils";
import { AppLoading } from "./components/AppLoading";

// add gtag type declaration for Google Analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

const App = lazy(() => import("./App.tsx"));

/**
 * Enhance back/forward cache (bfcache) support
 *
 * This implementation follows best practices from web.dev:
 * - Uses pageshow for detecting bfcache restoration
 * - Avoids unload events that would break bfcache
 * - Properly handles state rehydration on bfcache restore
 * - Instruments bfcache usage for analytics
 *
 * @see https://web.dev/articles/bfcache
 */
function enableBFCache() {
  // Log bfcache support status
  if (isBFCacheSupported()) {
    console.info("Browser supports bfcache");
  } else {
    console.warn("Browser may not fully support bfcache");
  }

  // track bfcache restorations
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      console.info("Page restored from bfcache");

      // send analytics event if needed
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          navigation_type: "back_forward_cache",
        });
      }

      // Optional: refresh data that might be stale
      // This would depend on our app needs
      // queryClient.invalidateQueries({ queryKey: ['time-sensitive-data'] });
    }
  });

  // Use 'pagehide' instead of 'unload'
  // this is bfcache-friendly and works in all scenarios
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) {
      console.info("Page entering bfcache");

      // Opportunity to clean up resources that shouldn't be frozen
      // For example, close WebSocket connections
    }
  });

  // fallback for visibility changes - important for mobile browsers
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // this is intentionally left as a no-op to avoid breaking bfcache
    }
  });

  if (process.env.NODE_ENV === "development") {
    // this is deferred to avoid slowing down initial load
    setTimeout(() => {
      enableBFCacheDebugMode();
    }, 2000);
  }
}

enableBFCache();

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

// add script to apply theme class before React loads
// this prevents flash of wrong theme on initial load
const injectThemeScript = () => {
  try {
    const script = document.createElement("script");
    script.innerHTML = `
      (function() {
        try {
          var savedTheme = localStorage.getItem('theme');
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-theme');
          }
        } catch (e) {}
      })();
    `;
    document.head.appendChild(script);
  } catch (e) {
    console.warn("Could not inject theme script", e);
  }
};

// apply theme early
injectThemeScript();

// BFCacheAwareRouter adds a hook to handle navigations from bfcache properly
function BFCacheAwareRouter({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sets up a pageshow listener to handle bfcache restorations
    // and ensure router state is in sync with the actual URL
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // page was restored from bfcache
        // react Router will handle state sync automatically,
        // but we can trigger any updates here
        console.info("Router detected bfcache restoration");
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return <BrowserRouter>{children}</BrowserRouter>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <StyleSheetManager shouldForwardProp={shouldForwardProp}>
          <ThemeProvider theme={theme}>
            <BFCacheAwareRouter>
              <Suspense fallback={<AppLoading />}>
                <App />
              </Suspense>
            </BFCacheAwareRouter>
          </ThemeProvider>
        </StyleSheetManager>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
