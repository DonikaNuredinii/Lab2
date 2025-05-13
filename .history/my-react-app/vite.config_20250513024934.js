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
      routes: path.resolve(__dirname, 'src/routes.jsx'),
      assets: path.resolve(__dirname, 'src/assets'),
      theme: path.resolve(__dirname, 'src/theme'),
      layouts: path.resolve(__dirname, 'src/layouts'),
      variables: path.resolve(__dirname, 'src/variables'),
    },
  },
  esbuild: {
    loader: 'jsx', // Ensure this is a string and points to JSX files
    include: /src\/.*\.js$/, // Include .js and .jsx files in the src folder
  },
});
