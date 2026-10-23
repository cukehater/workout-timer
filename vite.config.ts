import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/workout-timer/', // GitHub Pages 프로젝트 페이지 하위 경로
});
