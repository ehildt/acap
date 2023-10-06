import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  plugins: [tsConfigPaths(), react()],
  envDir: './env',
  css: {
    modules: {
      localsConvention: 'camelCase' as any,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-setup.ts',
    coverage: {
      reporter: 'json',
    },
    css: {
      modules: {
        classNameStrategy: 'stable',
      },
    },
  },
}));
