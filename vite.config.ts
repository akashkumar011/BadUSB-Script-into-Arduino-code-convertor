import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set base to the repository name for GitHub Pages deployment
  // Update this if you deploy under a different repo name or custom domain
  base: '/BadUSB-Script-into-Arduino-code-convertor/',
});


