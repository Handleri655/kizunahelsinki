// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.kizunahelsinki.com',
  output: 'static',
  adapter: vercel(),
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
      filter: (page) => !page.includes('/valmis'),
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
