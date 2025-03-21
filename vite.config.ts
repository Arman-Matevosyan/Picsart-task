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
 * - Improved CSS optimization
 * - Reduced unused JavaScript
 *
 * References:
 * - Vite Official Guide: https://vitejs.dev/guide/build.html
 * - Vite Build Options: https://vitejs.dev/config/build-options.html
 * - Web.dev - LCP: https://web.dev/lcp/
 * - Enable Text Compression: https://web.dev/uses-text-compression/
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
      filename: "stats.html", // Save stats to a file
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
        passes: 2, // multiple for better minification
        ecma: 2020, //modern syntax
      },
      mangle: {
        safari10: true, // safari compatibility
      },
      format: {
        comments: false, // remove comments
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
        // code splitting
        manualChunks: (id) => {
          // react core - rarely changes
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "vendor-react";
          }

          // routing - lazy loaded by main.tsx
          if (id.includes("node_modules/react-router-dom/")) {
            return "vendor-router";
          }

          // API/query functionality - only loaded when needed
          if (
            id.includes("node_modules/@tanstack/react-query") ||
            id.includes("node_modules/axios/")
          ) {
            return "vendor-api";
          }

          // styling libraries - separate chunk
          if (id.includes("node_modules/styled-components/")) {
            return "vendor-styles";
          }

          // UI components that can be reused
          if (id.includes("src/@design-system/components")) {
            return "ui-components";
          }

          // feature modules should be in their own chunks
          if (id.includes("src/@features/gallery")) {
            return "feature-gallery";
          }

          if (id.includes("src/@features/photo-details")) {
            return "feature-photo-details";
          }

          if (id.includes("src/@features/search")) {
            return "feature-search";
          }

          return null; // default chunk
        },
        // minimize code size
        compact: true,
        // ensure smallest bundle sizes
        minifyInternalExports: true,
        // add content hash for cache
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
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
