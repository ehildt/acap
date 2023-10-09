import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const productionConfig = isProduction ? { minify: true } : { minify: false };

  return {
    plugins: [tsConfigPaths()],
    envDir: './env',
    build: {
      ...productionConfig,
      emptyOutDir: true,
      rollupOptions: {
        treeshake: true,
      },
      lib: {
        entry: 'src/index.ts',
        name: '@acap/libs-react',
        fileName: 'acap-libs-react',
        formats: ['es'] as any,
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test-setup.ts',
      coverage: {
        reporter: 'json',
      },
    },
  };
});
