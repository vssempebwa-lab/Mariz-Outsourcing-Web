import { SERVICES, SITE } from '@/lib/data';

export const SITE_URL = 'https://www.marizgroup.com';
export const SITE_HOST = 'www.marizgroup.com';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_URL = `${SITE_URL}/brand/moa-logo.png`;
export const OG_IMAGE_URL = `${SITE_URL}/brand/og-image.jpg`;

export const HOME_TITLE =
  'Outsourcing Companies in Uganda | Mariz Outsourcing';

export const HOME_DESCRIPTION =
  'Mariz Outsourcing (U) SMC Ltd is an outsourcing company in Kampala, Uganda delivering BPO, recruitment, 24/7 call support, software and marketing.';

export const BRAND_ALTERNATES = [
  'Mariz',
  'Mariz Group',
  'Mariz Outsourcing',
  'Mariz Outsourcing Uganda',
];

export const SOCIAL_IMAGE = {
  url: OG_IMAGE_URL,
  width: 1200,
  height: 630,
  alt: 'Mariz Outsourcing (U) SMC Ltd — BPO, IT and growth partner in Kampala, Uganda',
};

const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress:
    'Level 3 Rm HC3, Honora Plaza, Opposite Be Energy Fuels, Zzana',
  addressLocality: 'Kampala',
  addressRegion: 'Central Region',
  addressCountry: 'UG',
};

const GEO_COORDINATES = {
  '@type': 'GeoCoordinates',
  latitude: 0.2644,
  longitude: 32.5499,
};

const AREA_SERVED = [
  { '@type': 'Country', name: 'Uganda' },
  { '@type': 'Place', name: 'East Africa' },
  { '@type': 'Place', name: 'Worldwide' },
];

const SERVICE_CATALOG = {
  '@type': 'OfferCatalog',
  name: 'Mariz Outsourcing Services',
  itemListElement: SERVICES.map((service, index) => ({
    '@type': 'Offer',
    position: index + 1,
    itemOffered: {
      '@type': 'Service',
      name: service.title,
      serviceType: service.title,
      description: service.short,
      url: `${SITE_URL}/services/${service.slug}`,
      provider: { '@id': ORGANIZATION_ID },
      areaServed: AREA_SERVED,
    },
  })),
};

const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE.legalName,
  legalName: SITE.legalName,
  alternateName: BRAND_ALTERNATES,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: LOGO_URL,
    contentUrl: LOGO_URL,
    width: 1654,
    height: 1557,
    caption: `${SITE.legalName} logo`,
  },
  image: { '@id': `${SITE_URL}/#logo` },
  description: HOME_DESCRIPTION,
  address: POSTAL_ADDRESS,
  geo: GEO_COORDINATES,
  hasMap: SITE.mapDirectionsUrl,
  telephone: SITE.phone,
  areaServed: AREA_SERVED,
  knowsAbout: [
    'Outsourcing companies',
    'Business process outsourcing (BPO)',
    'Outsourcing services Uganda',
    ...SERVICES.map((service) => service.title),
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: SITE.phone,
      areaServed: ['UG', 'KE', 'TZ', 'RW', 'BI', 'SS'],
      availableLanguage: ['en'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: SITE.phone,
      areaServed: 'UG',
      availableLanguage: ['en'],
    },
  ],
  hasOfferCatalog: SERVICE_CATALOG,
};

const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE.legalName,
  alternateName: 'Mariz Outsourcing',
  description: HOME_DESCRIPTION,
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: 'en-UG',
};

export const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
};
