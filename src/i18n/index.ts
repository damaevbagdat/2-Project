export const LOCALES = ['kz', 'ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

export function stripLocaleFromPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  if (LOCALES.includes(parts[0] as Locale)) {
    return '/' + parts.slice(1).join('/');
  }
  return pathname;
}

export function localizePath(pathname: string, locale: Locale) {
  const stripped = stripLocaleFromPath(pathname);
  const normalized = stripped === '/' ? '' : stripped.replace(/^\//, '');
  return `/${locale}/${normalized}`.replace(/\/$/, '') || `/${locale}`;
}

// Simple runtime translation loader (synchronous JSON import)
import ru from './ru.json';
import kz from './kz.json';
import en from './en.json';

const DICTS: Record<Locale, any> = {
  ru,
  kz,
  en,
};

export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  try {
    const dict = DICTS[locale];
    return (
      key.split('.').reduce((o: any, k) => (o ? o[k] : undefined), dict) ?? key
    );
  } catch {
    return key;
  }
}

// Generate hreflang entries for a given pathname.
export function generateHreflangs(pathname: string) {
  return LOCALES.map(locale => ({
    locale,
    href: localizePath(pathname, locale),
  }));
}
