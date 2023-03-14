import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OpenAIUtils',
      fileName: 'openai-utils',
    },
    rollupOptions: {
      external: ['openai'],
    },
  },
});
