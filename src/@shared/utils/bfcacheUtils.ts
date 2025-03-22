/**
 * Utilities for working with Back/Forward Cache (bfcache)
 *
 * These utilities help debug and diagnose bfcache issues by monitoring
 * browser behavior and providing insights into why bfcache might not be working.
 *
 * @see https://web.dev/articles/bfcache
 */

declare global {
  interface Window {
    navigation?: {
      addEventListener: (
        type: string,
        listener: EventListenerOrEventListenerObject
      ) => void;
      currentEntry?: {
        sameDocument?: boolean;
      };
    };
    getEventListeners?: (
      target: EventTarget,
      eventName: string
    ) => Array<{
      listener: (...args: unknown[]) => void;
    }>;
  }
}

interface NavigateEvent {
  navigationType: string;
  destination: { url: string };
  canIntercept: boolean;
}

interface PerformanceNavigationEntry extends PerformanceEntry {
  activationStart?: number;
  type: "navigation";
}

/**
 * Available in Chrome 93+, this diagnostic API helps identify why a page
 * might not be eligible for bfcache or why a bfcache restoration failed.
 */
export function monitorBFCacheStatus() {
  if (!window.navigation || !("addEventListener" in window.navigation)) {
    console.info(
      "BFCache monitoring: Navigation API not available in this browser"
    );
    return;
  }

  try {
    window.navigation.addEventListener("navigatecurrententrychange", () => {
      if (!window.navigation?.currentEntry?.sameDocument) {
        console.log("Navigation to a different document detected");
      }
    });

    window.navigation.addEventListener("navigate", (event: unknown) => {
      const navEvent = event as NavigateEvent;

      console.log(
        `Navigation type: ${navEvent.navigationType}, ` +
          `Destination: ${navEvent.destination?.url}, ` +
          `Can intercept: ${navEvent.canIntercept}`
      );
    });

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        console.info("✅ Page was restored from bfcache!");

        if ("performance" in window) {
          const navigationEntry = performance.getEntriesByType(
            "navigation"
          )[0] as PerformanceNavigationEntry;
          if (navigationEntry?.activationStart) {
            const bfcacheDuration = navigationEntry.activationStart;
            console.info(
              `Page was in bfcache for ${bfcacheDuration.toFixed(2)}ms`
            );
          }
        }
      } else {
        console.info(
          "❌ Page was NOT restored from bfcache (normal page load)"
        );
      }
    });

    console.info("BFCache monitoring: Enabled");
  } catch (error) {
    console.error("BFCache monitoring: Error setting up listeners", error);
  }
}

/**
 * Checks if the current browser supports bfcache
 * Most modern browsers support bfcache, but there are exceptions:
 * - Older browsers may not support it
 * - Some browsers disable it for certain conditions (private browsing, etc.)
 */
export function isBFCacheSupported(): boolean {
  const hasPageShowEvent = "onpageshow" in window;
  const hasPersistedProperty =
    typeof Event !== "undefined" && "persisted" in Event.prototype;

  return hasPageShowEvent && hasPersistedProperty;
}

// Resource entry type definition
interface ResourcePerformanceEntry extends PerformanceResourceTiming {
  initiatorType: string;
  name: string;
}

/**
 * List of common reasons why bfcache might be disabled:
 * - unload event listeners
 * - beforeunload event listeners (in some cases)
 * - window.opener references
 * - Service Worker with clients.claim()
 * - Certain HTTP Cache-Control headers
 * - Pending IndexedDB transactions
 * - Open WebSockets/WebRTC connections
 *
 * @returns Array of potential issues detected in the current page
 */
export function detectBFCacheBlockers(): string[] {
  const blockers: string[] = [];

  if (getEventListeners(window, "unload")?.length > 0) {
    blockers.push("Unload event listeners detected - these prevent bfcache");
  }

  if (getEventListeners(window, "beforeunload")?.length > 0) {
    blockers.push(
      "beforeunload event listeners detected - can prevent bfcache if always active"
    );
  }

  if (window.opener) {
    blockers.push("window.opener reference detected");
  }

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    blockers.push(
      "Active Service Worker detected - check that clients.claim() is not used"
    );
  }

  if ("performance" in window && "getEntriesByType" in performance) {
    const resources = performance.getEntriesByType(
      "resource"
    ) as ResourcePerformanceEntry[];
    const hasWebSockets = resources.some(
      (r) => r.initiatorType === "fetch" && r.name.startsWith("wss://")
    );

    if (hasWebSockets) {
      blockers.push(
        "WebSocket connections detected - consider closing when page is hidden"
      );
    }
  }

  return blockers;
}

/**
 * Helper function to safely get event listeners (only works in DevTools)
 * This uses a non-standard API that's only available in Chrome DevTools
 */
function getEventListeners(
  target: EventTarget,
  eventName: string
): Array<{ listener: (...args: unknown[]) => void }> {
  if (window.getEventListeners) {
    try {
      return window.getEventListeners(target, eventName) || [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Setup debug mode for bfcache
 * This helps with development and testing by providing detailed logging
 */
export function enableBFCacheDebugMode() {
  monitorBFCacheStatus();

  const blockers = detectBFCacheBlockers();
  if (blockers.length > 0) {
    console.warn("Potential bfcache blockers detected:", blockers);
  } else {
    console.info("No obvious bfcache blockers detected");
  }

  if (process.env.NODE_ENV === "development") {
    const testButton = document.createElement("button");
    testButton.textContent = "Test BFCache";
    testButton.style.position = "fixed";
    testButton.style.bottom = "10px";
    testButton.style.right = "10px";
    testButton.style.zIndex = "9999";
    testButton.style.padding = "8px";
    testButton.style.background = "#007BFF";
    testButton.style.color = "white";
    testButton.style.border = "none";
    testButton.style.borderRadius = "4px";

    testButton.addEventListener("click", () => {
      // create a temporary page to demonstrate bfcache
      const tempPage = document.createElement("html");
      tempPage.innerHTML = `
        <head>
          <title>BFCache Test Page</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
              color: #333;
            }
            h1 {
              margin-bottom: 20px;
            }
            button {
              padding: 10px 20px;
              background: #007BFF;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h1>BFCache Test Page</h1>
          <p>Now click the browser's back button to test bfcache restoration</p>
          <button id="backButton">Go Back</button>
          <script>
            document.getElementById('backButton').addEventListener('click', () => {
              history.back();
            });
          </script>
        </body>
      `;

      // save current document to a blob URL
      const blob = new Blob([tempPage.outerHTML], { type: "text/html" });
      const blobURL = URL.createObjectURL(blob);

      console.info("Testing bfcache: Navigating away...");
      console.info(
        "To test bfcache: click the Back button or use browser's back button"
      );

      window.location.href = blobURL;
    });

    document.body.appendChild(testButton);
  }

  console.info("BFCache debug mode enabled");
}
