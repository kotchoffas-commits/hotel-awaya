import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hotel-awaya.com';

const STATIC_PATHS = [
  '',
  '/chambres',
  '/services',
  '/faq',
  '/galerie',
  '/tarifs',
  '/avis',
  '/demande',
  '/legal/cgv',
  '/legal/confidentialite',
  '/legal/mentions',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = SITE_URL + '/' + locale + path;
    }
    for (const locale of routing.locales) {
      entries.push({
        url: SITE_URL + '/' + locale + path,
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: { languages },
      });
    }
  }

  try {
    const rooms = await prisma.room.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    for (const room of rooms) {
      const languages: Record<string, string> = {};
      for (const locale of routing.locales) {
        languages[locale] = SITE_URL + '/' + locale + '/chambres/' + room.slug;
      }
      for (const locale of routing.locales) {
        entries.push({
          url: SITE_URL + '/' + locale + '/chambres/' + room.slug,
          lastModified: room.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.9,
          alternates: { languages },
        });
      }
    }
  } catch (err) {
    console.warn('[sitemap] Prisma indisponible, chambres ignorees:', err);
  }

  return entries;
}