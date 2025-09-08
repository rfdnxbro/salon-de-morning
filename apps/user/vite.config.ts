import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages サブパス配信のため、VITE_BASE（例: /<repo>/user）を利用
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
});

