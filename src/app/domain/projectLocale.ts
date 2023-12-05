import { Language } from './language';
import { localeToLanguage } from './localeToLanguage';

export class ProjectLocale {
  private locale: { default: string; supported: string[] };

  constructor(locale: any) {
    this.locale = locale;
  }

  getAvailableLanguages(): Language[] {
    return [this.getDefaultLanguage()].concat(this.getSupportedLanguages());
  }

  getDefaultLanguage(): Language {
    return { language: localeToLanguage[this.locale.default], locale: this.locale.default };
  }

  setDefaultLocale(locale: string): void {
    this.locale.default = locale;
    this.locale.supported = this.locale.supported.filter(
      (supportedLocale) => supportedLocale != locale
    );
  }

  getSupportedLanguages(): Language[] {
    return this.locale.supported.map((locale) => ({
      language: localeToLanguage[locale],
      locale: locale
    }));
  }

  setSupportedLanguages(languages: Language[]): void {
    this.locale.supported = languages.map((language) => language.locale);
  }

  private hasLocale(locale: string): boolean {
    return this.locale.supported.includes(locale);
  }

  hasTranslations(): boolean {
    return this.locale.supported.length > 1;
  }

  hasTranslationsToApply(locale: string): boolean {
    return !this.isDefaultLocale(locale) && this.hasLocale(locale);
  }

  isDefaultLocale(locale: string): boolean {
    return this.locale.default === locale;
  }
}
