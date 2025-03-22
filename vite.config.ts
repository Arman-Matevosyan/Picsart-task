import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import type { BrotliOptions, ZlibOptions } from "zlib";

/**
 * Optimized Vite configuration
 *
 * Optimizations applied:
 * - Brotli and Gzip compression with optimized settings
 * - Terser minification with aggressive settings
 * - Strategic code splitting for better caching
 * - Bundle analysis for monitoring
 * - Improved CSS optimization
 * - Reduced unused JavaScript
 * - Text compression for all assets
 * - Styled-components optimization
 *
 * References:
 * - Vite Official Guide: https://vitejs.dev/guide/build.html
 * - Vite Build Options: https://vitejs.dev/config/build-options.html
 * - Web.dev - LCP: https://web.dev/lcp/
 * - Enable Text Compression: https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression
 */

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: process.env.NODE_ENV !== "production", // only in dev
              fileName: process.env.NODE_ENV !== "production", // only in dev
              minify: true,
              pure: true, // tree-shaking
              transpileTemplateLiterals: true,
            },
          ],
        ],
      },
    }),
    // gzip compression - widely supported
    compression({
      algorithm: "gzip",
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(jpg|jpeg|png|gif|webp)$/],
      threshold: 256, // Lower threshold to compress more files (256 bytes)
      compressionOptions: {
        level: 9, // Maximum compression level for gzip
      } as ZlibOptions,
      deleteOriginalAssets: false,
    }),
    // brotli compression for better compression ratio (much smaller files than gzip)
    compression({
      algorithm: "brotliCompress",
      exclude: [/\.(br)$/, /\.(gz)$/, /\.(jpg|jpeg|png|gif|webp)$/], // dont compress already compressed formats
      threshold: 256,
      compressionOptions: {
        params: {
          [0]: 11, // Compression level (0-11)
        },
      } as BrotliOptions,
      deleteOriginalAssets: false,
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: "./report/stats.html",
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@design-system": "/src/@design-system",
      "@features": "/src/@features",
      "@shared": "/src/@shared",
    },
  },
  build: {
    // enable terser minification for prod
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2,
        ecma: 2020,
      },
      mangle: {
        safari10: true, // safari compatibility
      },
      format: {
        comments: false,
      },
    },
    // increase chunk size
    chunkSizeWarningLimit: 600,
    // ensure CSS optimized
    cssMinify: true,
    cssCodeSplit: true,
    // pre-optimized dependencies that don't need processing
    commonjsOptions: {
      include: [/node_modules/],
      extensions: [".js", ".cjs"],
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - needed for initial render
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "vendor-react";
          }

          // Routing - loaded immediately after app mount
          if (id.includes("node_modules/react-router-dom/")) {
            return "vendor-router";
          }

          // API/query functionality - only loaded when needed for data fetching
          if (
            id.includes("node_modules/@tanstack/react-query") ||
            id.includes("node_modules/axios/")
          ) {
            return "vendor-api";
          }

          // Styling libraries - needed for styled components
          if (id.includes("node_modules/styled-components/")) {
            return "vendor-styles";
          }

          // Core UI components shared across the app
          if (id.includes("src/@design-system/components")) {
            return "ui-components";
          }

          // Shared utilities used app-wide
          if (id.includes("src/@shared/utils")) {
            return "shared-utils";
          }

          // Feature modules - each feature in its own chunk for better lazy loading
          if (id.includes("src/@features/gallery")) {
            return "feature-gallery";
          }

          if (id.includes("src/@features/photo-details")) {
            return "feature-photo-details";
          }

          if (id.includes("src/@features/search")) {
            return "feature-search";
          }

          // SearchBar and related components - lazy loaded when needed
          if (
            id.includes("src/@shared/components/SearchBar") ||
            id.includes("src/@shared/components/DynamicSearchBar")
          ) {
            return "search-component";
          }

          return null; // default chunk
        },
        compact: true,
        minifyInternalExports: true,
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
    // disable sourcemap in production for smaller build size
    sourcemap: false,
    assetsInlineLimit: 4096, // 4kb
    reportCompressedSize: true,
  },
});
