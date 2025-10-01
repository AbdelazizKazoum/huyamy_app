// lib/getDictionary.ts
export async function getDictionary(locale: string) {
  return (await import(`@/i18n/dictionaries/${locale}.json`)).default;
}
