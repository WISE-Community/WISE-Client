import { Language } from './language';
import { localeToLanguage } from './localeToLanguage';

const defaultLocales = {
  default: 'en_US',
  supported: []
};
export class ProjectLocale {
  private default: string;
  private supported: string[];

  constructor(locales: any = defaultLocales) {
    this.default = locales.default;
    this.supported = locales.supported;
  }

  getSupportedLanguages(): Language[] {
    return this.supported.map((locale) => ({
      language: localeToLanguage[locale],
      locale: locale
    }));
  }

  private hasLocale(locale: string): boolean {
    return this.supported.includes(locale);
  }

  hasTranslations(): boolean {
    return this.supported.length > 1;
  }

  hasTranslationsToApply(locale: string): boolean {
    return !this.isDefaultLocale(locale) && this.hasLocale(locale);
  }

  isDefaultLocale(locale: string): boolean {
    return this.default === locale;
  }
}
