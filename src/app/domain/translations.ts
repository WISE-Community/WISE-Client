export interface Translations extends Record<string, TranslationValue> {}

export interface TranslationValue {
  value: string;
  modified: number;
}
