// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.kizunahelsinki.com',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'fi',
    locales: ['fi', 'en', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fi',
        locales: {
          fi: 'fi-FI',
          en: 'en',
          ja: 'ja',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
