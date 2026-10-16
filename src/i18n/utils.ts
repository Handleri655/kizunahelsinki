export const locales = ['fi', 'en', 'ja'] as const;

export type Lang = (typeof locales)[number];

export const defaultLang: Lang = 'fi';

export const localeLabels: Record<Lang, string> = {
  fi: 'Suomi',
  en: 'English',
  ja: '日本語',
};

export const htmlLang: Record<Lang, string> = {
  fi: 'fi',
  en: 'en',
  ja: 'ja',
};

export const ogLocale: Record<Lang, string> = {
  fi: 'fi_FI',
  en: 'en_GB',
  ja: 'ja_JP',
};

export const routePaths = {
  home: '',
  menu: 'menu',
  story: 'tarina',
  school: 'sushikoulu',
  gift: 'lahjakortti',
  reserve: 'varaa',
  contact: 'yhteystiedot',
} as const;

export type RouteId = keyof typeof routePaths;

export function isLang(value: string | undefined): value is Lang {
  return locales.includes(value as Lang);
}

export function localePath(lang: Lang, route: RouteId): string {
  const slug = routePaths[route];
  if (lang === defaultLang) {
    return slug ? `/${slug}` : '/';
  }
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

export function localizedStaticPaths() {
  return [{ params: { lang: 'en' } }, { params: { lang: 'ja' } }];
}

export function euro(amount: string): string {
  return `${amount} €`;
}
