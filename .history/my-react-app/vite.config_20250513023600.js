import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      routes: path.resolve(__dirname, './src/routes.jsxx'),
      'layouts/auth/Default': path.resolve(__dirname, './src/layouts/auth/Default.jsx'),
      'variables/charts': path.resolve(__dirname, './src/variables/charts.js'),
    },
  },
  esbuild: {
    loader: {
      '.js': 'jsx',
    },
    include: /src\/.*\.js$/,
  },
});

