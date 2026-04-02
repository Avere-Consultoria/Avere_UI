import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      entryRoot: 'src',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'node_modules', 'dist'],
      afterBuild: () => {
        console.log('Tipagens geradas com sucesso!');
      }
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AvereUI',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // Adicionamos o jsx-runtime aqui também
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime' // Resolve o aviso MISSING_GLOBAL_NAME
        },
      },
    },
  },
});