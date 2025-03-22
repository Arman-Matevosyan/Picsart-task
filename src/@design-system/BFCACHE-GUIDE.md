# Back/Forward Cache (bfcache) Optimization Guide

## Overview

The Back/Forward cache (bfcache) is a browser optimization that stores a complete snapshot of a page in memory when the user navigates away, enabling instant back/forward navigation experiences. This guide outlines our approach to ensuring optimal bfcache compatibility in our application.

## Why bfcache Matters

- **Instant page loads**: Pages load instantly when navigating with the browser's back/forward buttons
- **Reduced network requests**: No need to re-download resources
- **Preserved JavaScript state**: All React state, scroll positions, form input values are preserved exactly
- **Improved Core Web Vitals**: Better user experience metrics (especially Largest Contentful Paint)
- **Reduced server load**: Fewer page reloads mean fewer requests to your servers

According to Google, pages restored from bfcache are loaded **instantaneously**, resulting in metrics showing:
- ~30% of all Chrome desktop navigations use bfcache
- Mobile users benefit even more with higher cache hit rates
- Users spend ~10% of their time on pages restored from bfcache

## Implementation Strategy

Our application is optimized for bfcache with the following best practices:

### 1. Avoid bfcache Blockers

We meticulously avoid common issues that prevent bfcache:

- **No `unload` event listeners**: These completely disable bfcache
- **Careful use of `beforeunload`**: Only added conditionally when actually needed (e.g., unsaved changes)
- **Proper handling of resources**: Database connections, WebSockets, etc. are managed appropriately
- **Avoidance of window.opener references**: These can prevent bfcache on some browsers

### 2. Event Listeners for bfcache Detection

We use the appropriate events to detect and handle bfcache:

- **`pageshow` event with `persisted` property**: Detects when a page is restored from bfcache
- **`pagehide` event**: Provides opportunity to clean up resources when page might enter bfcache
- **`visibilitychange` event**: Used as a backup for mobile browsers

### 3. React Router Integration

Our application uses a custom `BFCacheAwareRouter` component that properly handles React Router state synchronization when pages are restored from bfcache.

### 4. Analytics & Monitoring

We track bfcache hits with:
- Instrumentation for analytics platforms
- Console logging in development
- Performance measurements of time spent in bfcache

### 5. Debug & Testing Tools

Our development environment includes tools to:
- Detect potential bfcache blockers
- Visualize bfcache usage
- Test bfcache behavior

## Testing bfcache Compatibility

To manually test if your feature is bfcache compatible:

1. Open Chrome DevTools > Application > Back/Forward Cache
2. Enable "Test back/forward cache" button in DevTools
3. Navigate to your feature, then away from it
4. Use the browser's back button
5. Check the DevTools console for info and any errors

If the page was restored from bfcache, you'll see:
- "Page restored from bfcache" log message
- No full page reload (preserved state)
- Instant load

If the page was NOT restored from bfcache, check the console for the reason it was blocked.

## Common bfcache Issues

### 1. Unintentional `unload` Listeners

Third-party libraries might add `unload` listeners that break bfcache. Use our detection tools to identify and remove these.

### 2. Persistent Connections

WebSockets, WebRTC, or IndexedDB connections might need special handling. Close or pause connections when the page is hidden.

### 3. Service Worker Issues

Service workers with `clients.claim()` can interfere with bfcache. Consider disabling this or using a different activation pattern.

### 4. HTTP Cache Headers

Certain Cache-Control headers can influence bfcache behavior. Review your server configuration if experiencing issues.

## Resources

- [Chrome bfcache Documentation](https://web.dev/articles/bfcache)
- [Firefox bfcache Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/1.5/Using_Firefox_1.5_caching)
- [bfcache Tester Tool](https://back-forward-cache-tester.glitch.me/?persistent_logs=1)

## Our Custom Utilities

We've created dedicated utilities for working with bfcache:

1. **bfcacheUtils.ts**: Contains helper functions for detection, monitoring, and debugging
2. **BFCacheAwareRouter**: Custom wrapper for React Router with bfcache support
3. **enableBFCache()**: Core implementation for enabling and configuring bfcache

---

Remember: When implementing new features, avoid using the `unload` event, and be thoughtful about persistent connections or storage access. When in doubt, use our testing tools to verify bfcache compatibility. 