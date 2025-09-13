import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';

const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
});
