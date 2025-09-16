/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: 'app',
  server: './server.ts',
  serverBuildPath: 'dist/server/index.js',
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  ignoredRouteFiles: ['**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
  tailwind: true,
  postcss: true,
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
};
