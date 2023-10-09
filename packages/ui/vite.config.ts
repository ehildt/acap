import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const productionConfig = isProduction
    ? {
        cssMinify: true,
        minify: true,
      }
    : {
        cssMinify: false,
        minify: false,
      };

  return {
    plugins: [tsConfigPaths(), react()],
    envDir: './env',
    build: {
      ...productionConfig,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: true,
      },
      lib: {
        entry: 'src/index.ts',
        name: '@acap/ui-react',
        fileName: 'acap-ui-react',
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
  };
});
