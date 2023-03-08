import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SlackUtils',
      fileName: 'slack-utils',
    },
    rollupOptions: {
      external: ['@slack/bolt', 'openai'],
    },
  },
  plugins: [dts()],
});
