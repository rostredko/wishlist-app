import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tsconfigPaths({
      projects: ['tsconfig.app.json', 'tsconfig.test.json'],
    }),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },

  build: {
    target: 'es2018',
    minify: 'esbuild',
    sourcemap: false,
    cssMinify: true,
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 650,

    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
      unknownGlobalSideEffects: false,
    },

    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-mui': ['@mui/material', '@mui/system', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'vendor-firebase-auth': ['firebase/app', 'firebase/auth'],
          'vendor-firebase-firestore': ['firebase/firestore'],
          'vendor-firebase-analytics': ['firebase/analytics'],
        },
      },
    },
  },

  define: {
    __DEV__: mode !== 'production',
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.ts'],
    css: false,
    globals: true,
  },
}));