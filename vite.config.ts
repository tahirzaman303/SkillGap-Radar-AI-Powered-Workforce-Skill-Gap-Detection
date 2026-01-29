import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Fix: Cast process to any to resolve "Property 'cwd' does not exist on type 'Process'" error.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Maps VITE_API_KEY to process.env.API_KEY. 
      // Fallback to empty string to prevent undefined replacement errors.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || ''),
    },
  };
});