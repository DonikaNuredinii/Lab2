import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      views: path.resolve(__dirname, 'src/views'),
      contexts: path.resolve(__dirname, 'src/contexts'),
      routes: path.resolve(__dirname, 'src/routes.jsxx'),
    },
  },
  esbuild: {
    loader: {
      '.js': 'jsx',
    },
    include: /src\/.*\.js$/,
  },
});
