import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://alash-zan.kz',
  outDir: './dist',
  i18n: {
    // Язык по умолчанию
    defaultLocale: 'ru',
    // Список всех поддерживаемых языков
    locales: ['ru', 'kz', 'en'],
    routing: {
      // Не добавлять префикс для языка по умолчанию (например, будет /about вместо /ru/about)
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
});
