import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react'
import * as path from 'path';
import * as pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __VERSION__: JSON.stringify(pkg.version),
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.PUBLIC_URL': JSON.stringify('./'),
  },
  base: './',
  resolve: {
    alias: {
      $src: path.resolve(__dirname, './src'),
      src: path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'assets',
  build: {
    // sourcemap: true,
    // the default value is 'dist'
    // which make more sense
    // but change this may break other people's tools
    outDir: 'public',
  },
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src',
      outDir: 'public',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      base: './',
    }),
  ],
}));
