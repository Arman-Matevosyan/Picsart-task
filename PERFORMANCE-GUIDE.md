# Performance Optimization Guide

This document outlines the comprehensive performance optimization strategy implemented in our application to achieve optimal user experience and Core Web Vitals scores.

## Core Web Vitals Focus Areas

### 1. Largest Contentful Paint (LCP)

Target: **< 2.5 seconds**

Optimizations:
- Hero image optimization with proper sizing and WebP format
- `fetchpriority="high"` for critical hero images
- Critical CSS inlining
- Font optimizations (preload, swap, variable fonts)
- Reduced render-blocking resources
- Server response time optimization

### 2. Cumulative Layout Shift (CLS)

Target: **< 0.1**

Optimizations:
- Image dimensions explicitly set with aspect ratios
- Placeholder spaces for dynamic content
- Skeleton screens for loading states
- Font display strategies to prevent layout shift
- Stable container sizing for async content

### 3. First Input Delay (FID) / Interaction to Next Paint (INP)

Target: **< 100ms**

Optimizations:
- Minimized JavaScript execution time
- Deferred non-critical JavaScript
- Event handler optimization and debouncing
- Efficient rendering patterns
- Web worker offloading for heavy calculations

## Specific Optimization Strategies

### 1. Asset Optimization

#### Images
- WebP format with fallbacks
- Responsive sizes with appropriate srcsets
- Compression with quality optimization
- Lazy loading with IntersectionObserver
- AVIF format for next-gen optimization

#### JavaScript
- Code splitting with dynamic imports
- Tree shaking unused code
- Minification and compression
- Efficient bundling with Rollup
- Differential loading for modern browsers

#### CSS
- Critical CSS inline loading
- Non-critical CSS loading with media queries
- CSS-in-JS optimization with styled-components
- Minimal CSS approach with utility classes

### 2. React Performance

#### Rendering Optimization
- Component memoization with React.memo
- Virtualization for long lists (Gallery)
- Effective prop filtering in styled-components
- useCallback and useMemo for referential stability
- Batch state updates for fewer renders

#### Data Fetching
- React Query with staleTime optimization
- Background prefetching for anticipated data
- Cache persistence between sessions
- Optimistic UI updates

### 3. Infinite Scroll Optimization

- IntersectionObserver for efficient scroll detection
- Efficient pagination with useInfiniteQuery
- Memoized gallery sections to prevent re-renders
- Virtualization for large datasets
- Debounced scroll handlers
- Image lazy loading with blur effects

### 4. Back/Forward Cache (bfcache)

- Avoided unload event listeners
- Proper pageshow/pagehide event handling
- Careful usage of beforeunload
- Session state restoration
- React Router sync with bfcache page restoration
- See [BFCACHE-GUIDE.md](./src/@design-system/BFCACHE-GUIDE.md) for detailed implementation

### 5. Network Optimization

- HTTP/2 support
- Preconnect and dns-prefetch
- Resource hints (preload, prefetch)
- Cache policy optimization
- Service Worker for offline support
- Content compression (Brotli/Gzip)

### 6. Build and Deployment

- Optimized chunk splitting
- Progressive enhancement approach
- Source map optimization in production
- Differential serving for modern browsers
- Edge network delivery
- CDN asset caching

## Performance Monitoring

Our application includes integrated performance monitoring:

1. **Core Web Vitals Measurement**
   - Real User Monitoring (RUM)
   - Synthetic testing
   - Periodic Lighthouse audits

2. **React Developer Tools**
   - Profiler for component renders
   - Highlight updates
   - Performance metrics tracking

3. **Bundle Analysis**
   - Webpack Bundle Analyzer
   - Import cost tracking
   - Bundle size budgets

## Performance Testing

When implementing new features, use these tools to verify performance:

1. **Chrome DevTools**
   - Performance tab for recording and analyzing
   - Lighthouse for Core Web Vitals
   - Network throttling for diverse conditions

2. **WebPageTest.org**
   - Multi-location testing
   - Connection throttling
   - Waterfall analysis

3. **Custom Performance Metrics**
   - Time to first meaningful paint
   - Time to interactive
   - Input latency measurements

## References

- [Web Vitals](https://web.dev/vitals/)
- [Optimize Largest Contentful Paint](https://web.dev/lcp/)
- [Cumulative Layout Shift](https://web.dev/cls/)
- [First Input Delay](https://web.dev/fid/)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
- [JavaScript Performance](https://web.dev/fast/#optimize-your-javascript)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [Infinite Scroll Best Practices](https://web.dev/infinite-scroll/)
- [Back/Forward Cache](https://web.dev/bfcache/) 