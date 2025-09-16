import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [hydrogen(), tsconfigPaths()],
  resolve: {
    alias: {
      '~': '/app',
    },
  },
  ssr: {
    noExternal: [
      '@shopify/hydrogen',
      '@shopify/remix-oxygen',
      '@remix-run/react',
      '@remix-run/server-runtime',
    ],
  },
});
