import { en } from './en';
import { zh } from './zh';

export type Locale = 'en' | 'zh';
export type { LocaleKey } from './en';

const translations: Record<Locale, Record<string, string>> = {
  en: { ...en },
  zh,
};

export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale] ?? translations.en;
}

export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = getTranslations(locale);
  let s = dict[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
    }
  }
  return s;
}
