# Image Gallery PicsArt Task

This application is a performance-optimized image gallery using React, TypeScript, and Vite. It showcases high-quality photos from Pexels and Unsplash APIs with a focus on performance and user experience.

## Features

- **Optimized Infinite Scroll** - Efficiently loads and renders photos as you scroll
- **Responsive Layout** - Masonry grid layout that adapts to different screen sizes
- **Performance Optimized** - Implements best practices for Core Web Vitals
- **Styled Components** - Consistent theming with performance-optimized styling
- **Back/Forward Cache Compatible** - Instant navigation with preserved state
- **Virtualization Support** - Handles large collections of photos efficiently

## Project Structure

```
├── src/
│   ├── @design-system/     # Design system components and utilities
│   │   ├── components/     # Reusable UI components
│   │   ├── theme/          # Theme configuration and utilities
│   │   ├── utils/          # Styling utilities
│   │   ├── STYLING-GUIDE.md # Styling best practices
│   │   └── BFCACHE-GUIDE.md # BFCache optimization guide
│   ├── @shared/           # Shared utilities and hooks
│   │   ├── contexts/      # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # General utilities
│   ├── @features/         # Features folder
│   │   ├── gallery/       # Gallery feature
│   │   ├── photo-details/ # Photo details feature
│   │   └── search/       # Search feature
│   ├── components/       # Application-specific components
│   └── main.tsx          # Application entry point
├── PERFORMANCE-GUIDE.md  # Performance optimization guide
└── README.md             # Project documentation
```

## Architecture Documentation

We maintain detailed guides for various aspects of the application:

- **[Performance Guide](./PERFORMANCE-GUIDE.md)** - Comprehensive performance optimization strategy
- **[Styling Guide](./src/@design-system/STYLING-GUIDE.md)** - Best practices for using styled-components
- **[BFCache Guide](./src/@design-system/BFCACHE-GUIDE.md)** - Browser back/forward cache optimization

## Performance Highlights

This application implements numerous performance optimizations, including:

- Optimized image loading and rendering
- Efficient state management with React Query
- Back/forward cache compatibility
- Responsive and virtualized UI
- Modern browser features usage

See the [Performance Guide](./PERFORMANCE-GUIDE.md) for detailed information.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler and builds)
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview production build locally
- `npm run preview:compressed` - Build and serve compressed production files
- `npm run performance` - Run performance tests and measure Core Web Vitals
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run analyze` - Analyze bundle sizes and open stats visualization
- `npm run test:perf` - Build and preview for performance testing
- `npm run test:lighthouse` - Run Lighthouse audit and generate report
- `npm run dev:mock` - Start development server with mock data

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. **Environment Variables Setup**:

   Set up environment variables as described in the [Environment Variables](#environment-variables) section:

   - For development: Create a local `.env` file
   - For production: Configure variables in your deployment platform
   - For development without API keys: Use `npm run dev:mock`

4. Run the development server with `npm run dev`
5. Build for production with `npm run build`

## API Integration

The application is integrated with the Pexels API for photo data. The authorization is handled with the API key that you must provide in the environment variables. If you encounter `unauthorized` errors when scrolling, please verify:

1. You have a valid Pexels API key in your environment variables
2. The key is formatted correctly as `VITE_PEXELS_API_KEY=your_key_here` without quotes
3. You've restarted the server after adding the key

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
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Pexels API Documentation](https://www.pexels.com/api/documentation/)

## Environment Variables

The application uses the following environment variables:

| Variable                   | Description                                 | Required | Default            |
| -------------------------- | ------------------------------------------- | -------- | ------------------ |
| `VITE_PEXELS_API_KEY`      | API key for Pexels                          | Yes      | -                  |
| `VITE_UNSPLASH_ACCESS_KEY` | Access key for Unsplash (optional)          | Yes      | -                  |
| `VITE_API_CACHE_TIME`      | Cache time for API requests in milliseconds | No       | 300000 (5 minutes) |
| `VITE_DEFAULT_THEME`       | Default theme (light or dark)               | No       | light              |
| `VITE_USE_MOCK_DATA`       | Use mock data instead of real API           | No       | false              |
| `VITE_PEXELS_PER_PAGE`     | Number of items per page for Pexels API     | No       | 15                 |

An `.env.example` file is provided in the repository as a template for your environment variables. Copy this file to create your `.env` file:

```bash
cp .env.example .env
```

Then edit the `.env` file to add your actual API keys.
