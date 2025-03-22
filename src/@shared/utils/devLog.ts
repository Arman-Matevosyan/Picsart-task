/**
 * Development-only logging utility to reduce console noise in production
 *
 * Reference: https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression
 * Reason: Excessive logging can affect performance and is stripped in production
 */
export const devLog = {
  info: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.info("[Dev]", ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn("[Dev]", ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error("[Dev Error]", ...args);
    } else {
      console.error(...args);
    }
  },
  debug: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.debug("[Dev Debug]", ...args);
    }
  },
  time: (label: string) => {
    if (import.meta.env.DEV) {
      console.time(`[Dev Time] ${label}`);
    }
  },
  timeEnd: (label: string) => {
    if (import.meta.env.DEV) {
      console.timeEnd(`[Dev Time] ${label}`);
    }
  },
};
