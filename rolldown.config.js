import { defineConfig } from 'rolldown';

export default defineConfig({
  input: './main.ts',
  tsconfig: './tsconfig.json',
  output: {
    file: 'bundle.js',
    format: 'iife',
    sourcemap: true,
  },
});
