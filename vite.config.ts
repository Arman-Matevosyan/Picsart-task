import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";

/**
 * Optimized Vite configuration
 *
 * Optimizations applied:
 * - Brotli and Gzip compression
 * - Terser minification with aggressive settings
 * - Strategic code splitting for better caching
 * - Bundle analysis for monitoring
 *
 * References:
 * - Vite Official Guide: https://vitejs.dev/guide/build.html
 * - Vite Build Options: https://vitejs.dev/config/build-options.html
 * - Dev.to (Mitchell): https://dev.to/mitchatevs/improving-web-performance-with-code-splitting-and-text-compression-1f3h
 */

export default defineConfig({
  plugins: [
    react(),
    // gzip compression
    compression({
      algorithm: "gzip",
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 512, // lower threshold to compress more files
      deleteOriginalAssets: false, // keep original files for browsers that dont support compression
    }),
    // brotli compression for better compression ratio
    compression({
      algorithm: "brotliCompress",
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 512, // Lower threshold to compress more files
      deleteOriginalAssets: false, // Keep original files
    }),
    // bundle analyze monitor size
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
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
      },
      format: {
        comments: false, // remove comments
      },
    },
    // increase chunk size
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // code splitting
        manualChunks: (id) => {
          // framework chunk - not changes
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/")
          ) {
            return "vendor-framework";
          }

          // libraries chunk - may change with updates
          if (
            id.includes("node_modules/styled-components/") ||
            id.includes("node_modules/@tanstack/react-query") ||
            id.includes("node_modules/axios/")
          ) {
            return "vendor-libs";
          }

          // UI components that can  be reused
          if (id.includes("src/@design-system/components")) {
            return "ui-components";
          }

          return null; // default chunk
        },
        // minimize code size
        compact: true,
        // ensure smallest bundle sizes
        minifyInternalExports: true,
      },
    },
    // disable sourcemap in production smaller build size
    sourcemap: false,
    // ensure assets are optimized
    assetsInlineLimit: 4096, // 4kb
    // report performance issues
    reportCompressedSize: true,
  },
});
