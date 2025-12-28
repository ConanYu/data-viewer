import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage'],
  },
  vite: () => ({
    plugins: [
      tailwindcss(),
      {
        name: 'to-utf8',
        generateBundle(_, bundle) {
          // Iterate through each asset in the bundle
          for (const fileName in bundle) {
            if (bundle[fileName].type === 'chunk') {
              // Assuming you want to convert the chunk's code
              const originalCode = bundle[fileName].code;
              // Update the chunk's code with the modified version
              bundle[fileName].code = originalCode
                .split('')
                .map((ch: string) =>
                  ch.charCodeAt(0) <= 0x7f ? ch : '\\u' + ('0000' + ch.charCodeAt(0).toString(16)).slice(-4),
                )
                .join('');
            }
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  }),
});
