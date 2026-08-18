/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // 构建产物用相对 base：可部署到任意子路径（如 GitHub Pages 的 /reborn-3am/）甚至 file:// 直开
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
}));
