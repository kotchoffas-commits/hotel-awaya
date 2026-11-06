import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import fs from 'fs';
import path from 'path';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Lecture directe du fichier, contourne le bug de résolution de Turbopack
  const messagesPath = path.join(process.cwd(), 'messages', `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));

  return {
    locale,
    messages,
  };
});