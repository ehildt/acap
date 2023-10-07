import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  plugins: [tsConfigPaths(), react()],
  envDir: './env',
  build: {
    lib: {
      entry: './index.ts', // Path to your library entry file
      name: '@acap/ui-react', // Global name for your library
      fileName: 'acap-ui-react', // Output file name for your library
      formats: ['es'] as any,
    },
  },
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
