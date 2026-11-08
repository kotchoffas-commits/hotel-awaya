type Locale = 'fr' | 'en';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hotel-awaya.com';

const HOTEL_INFO = {
  name: 'Hôtel Awaya Colline 132',
  description:
    "Hôtel de charme sur la Colline 132 au Bénin. Chambres élégantes, service attentionné, réservation en ligne.",
  telephone: '+229 00 00 00 00',
  email: 'contact@awaya-colline132.com',
  streetAddress: 'Colline 132',
  addressLocality: 'Colline 132',
  addressCountry: 'BJ',
  priceRange: '$$',
};

export function organizationSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: HOTEL_INFO.name,
    url: SITE_URL + '/' + locale,
    logo: SITE_URL + '/favicon.ico',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: HOTEL_INFO.telephone,
      email: HOTEL_INFO.email,
      contactType: 'reservations',
      availableLanguage: ['French', 'English'],
    },
    sameAs: [],
  };
}

export function hotelSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: HOTEL_INFO.name,
    description: HOTEL_INFO.description,
    url: SITE_URL + '/' + locale,
    telephone: HOTEL_INFO.telephone,
    email: HOTEL_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOTEL_INFO.streetAddress,
      addressLocality: HOTEL_INFO.addressLocality,
      addressCountry: HOTEL_INFO.addressCountry,
    },
    image: SITE_URL + '/' + locale + '/opengraph-image',
    priceRange: HOTEL_INFO.priceRange,
    currenciesAccepted: 'XOF',
    paymentAccepted: 'Cash, Credit Card, Mobile Money',
    checkinTime: '14:00',
    checkoutTime: '12:00',
    starRating: { '@type': 'Rating', ratingValue: '4' },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Piscine', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Petit-déjeuner', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Réception 24h/24', value: true },
    ],
  };
}

export function roomSchema(
  locale: Locale,
  room: { slug: string; nameFr: string; nameEn: string; descFr: string; descEn: string; basePrice: number; images: string; capacity: number }
) {
  const name = locale === 'fr' ? room.nameFr : room.nameEn;
  const desc = locale === 'fr' ? room.descFr : room.descEn;
  const images = JSON.parse(room.images) as string[];
  const url = SITE_URL + '/' + locale + '/chambres/' + room.slug;
  return {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name,
    description: desc,
    url,
    image: images[0] || SITE_URL + '/' + locale + '/opengraph-image',
    occupancy: { '@type': 'Occupancy', maxValue: room.capacity },
    offers: {
      '@type': 'Offer',
      price: room.basePrice,
      priceCurrency: 'XOF',
      availability: 'https://schema.org/InStock',
      url,
    },
  };
}

export function breadcrumbSchema(locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: SITE_URL + '/' + locale + item.path,
    })),
  };
}