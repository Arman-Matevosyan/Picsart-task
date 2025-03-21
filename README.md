# React + TypeScript + Vite Image Gallery

This application is a performance-optimized image gallery using React, TypeScript, and Vite. It showcases high-quality photos from Pexels and Unsplash APIs with a focus on performance and user experience.

## Performance Optimizations

This project implements various performance optimizations to improve Core Web Vitals and overall user experience:

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

## References

The performance optimizations in this project are based on best practices from the following sources:

- Vite Official Guide – [Building for Production](https://vitejs.dev/guide/build.html) and [Build Options](https://vitejs.dev/config/build-options.html)
- Dev.to (Mitchell) – [Text compression & Code splitting](https://dev.to/mitchatevs/improving-web-performance-with-code-splitting-and-text-compression-1f3h)
- Dev.to (Daine Mawer) – [Best CLS Practices for Images](https://dev.to/daine/stop-your-website-from-jumping-around-cumulative-layout-shift-2aoo)
- Chrome Web Dev (Johnny Schwarz) – [Optimize Largest Contentful Paint](https://web.dev/lcp/)
- Chrome Developers – [Remove Unused JavaScript](https://web.dev/unused-javascript/) and [Code-splitting](https://web.dev/code-splitting/)
- Stack Overflow (user jsejcksn) – [React.memo Performance Optimization](https://stackoverflow.com/questions/53165945/does-react-memo-improve-performance)
- Dev.to (Femi Akinyemi) – [Prevent Unnecessary Re-rendering in React](https://dev.to/femak/preventing-unnecessary-re-rendering-in-react-components-5c96)
- Google Web Dev (Philip Walton & Barry Pollard) – [Back/Forward Cache (bfcache)](https://web.dev/bfcache/)

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your API keys (see `.env.example`)
4. Run the development server with `npm run dev`
5. Build for production with `npm run build`
