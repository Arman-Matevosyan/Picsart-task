# React + TypeScript + Vite Image Gallery

This application is a performance-optimized image gallery using React, TypeScript, and Vite. It showcases high-quality photos from Pexels and Unsplash APIs with a focus on performance and user experience.

## Performance Optimization Plan

Our performance optimization strategy targets the following key issues:

1. **Largest Contentful Paint (LCP) Optimization** 
   - Identify and prioritize LCP elements (often an image or large text block)
   - Add `fetchpriority="high"` to hero images
   - Remove render-blocking resources
   - Optimize JS execution before LCP
   - Set LCP performance budget (<2.5s on mobile)

2. **Text Compression**
   - Enable gzip/Brotli compression for all text resources
   - Properly serve compressed (.gz/.br) files from the static server
   - Verify compression via Content-Encoding headers

3. **JavaScript Optimization**
   - Use production builds for performance testing
   - Ensure proper minification and tree-shaking
   - Optimize bundle splitting configuration
   - Remove source maps in production

4. **Code Reduction**
   - Eliminate unused libraries (react-router-dom, axios, react-query)
   - Implement dynamic imports for code splitting
   - Analyze bundle contents to identify bloat
   - Replace heavy libraries with lighter alternatives when possible

5. **Production Deployment Optimization**
   - Configure CDN and edge caching
   - Enable server compression
   - Implement long-term asset caching
   - Monitor real-user performance
   - Consider server-side rendering if needed

## Implemented Optimizations

1. **Production Build Optimization**
   - Minification and compression (Gzip/Brotli)
   - Code splitting and tree-shaking
   - Vendor chunk optimization

2. **Image Optimization**
   - WebP format usage for smaller file sizes
   - Responsive image loading with appropriate sizes
   - Properly prioritized LCP images
   - Layout shift prevention with aspect ratios

3. **React Rendering Optimization**
   - Memoized components to prevent unnecessary re-renders
   - Virtualized grid for efficient rendering
   - Lazy loading for non-critical components

4. **Loading Performance**
   - DNS prefetching and preconnect hints
   - Preloading critical resources
   - Effective image lazy loading strategy

5. **Back/Forward Cache Compatibility**
   - Proper event listeners (pageshow instead of unload)
   - State preservation for instant navigation

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run performance` - Run performance tests and measure Core Web Vitals
- `npm run analyze` - Analyze bundle sizes

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your API keys (see `.env.example`)
4. Run the development server with `npm run dev`
5. Build for production with `npm run build`

## References

The performance optimizations in this project are based on best practices from the following sources:

- [Optimize Largest Contentful Paint](https://web.dev/lcp/)
- [Render Blocking Resources](https://web.dev/render-blocking-resources/)
- [Remove Unused JavaScript](https://web.dev/unused-javascript/)
- [Code Splitting](https://web.dev/code-splitting/)
- [Enable Text Compression](https://web.dev/uses-text-compression/)
- [Optimize CLS](https://web.dev/optimize-cls/)
- [Best CLS Practices for Images](https://dev.to/daine/stop-your-website-from-jumping-around-cumulative-layout-shift-2aoo)
- [React.memo Performance Optimization](https://stackoverflow.com/questions/53165945/does-react-memo-improve-performance)
- [Prevent Unnecessary Re-rendering in React](https://dev.to/femak/preventing-unnecessary-re-rendering-in-react-components-5c96)
- [Back/Forward Cache (bfcache)](https://web.dev/bfcache/)
- [Lazy Loading for Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading)
- [Vite Official Guide – Building for Production](https://vitejs.dev/guide/build.html)
- [Vite Build Options](https://vitejs.dev/config/build-options.html)
- [Text compression & Code splitting](https://dev.to/mitchatevs/improving-web-performance-with-code-splitting-and-text-compression-1f3h)
- [Edge Network Compression (Vercel)](https://vercel.com/docs/edge-network/compression)
- [Rollup Plugin Visualizer](https://github.com/btd/rollup-plugin-visualizer)
