import './globals.css';
import type { Metadata } from 'next';
import { SiteChrome } from '@/components/site/site-chrome';
import { StructuredData } from '@/components/site/structured-data';
import { Toaster } from '@/components/ui/sonner';
import { defaultSiteTheme, getPublishedSiteTheme, siteThemeToCssVars } from '@/lib/site-customization';
import { HOME_DESCRIPTION, HOME_TITLE, OG_IMAGE_URL, SITE_URL, SOCIAL_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Mariz Outsourcing (U) SMC Ltd',
  title: {
    default: HOME_TITLE,
    template: '%s | Mariz Outsourcing Uganda',
  },
  description: HOME_DESCRIPTION,
  keywords: [
    'outsourcing companies',
    'outsourcing companies in Uganda',
    'outsourcing company Kampala',
    'BPO companies Uganda',
    'Mariz Outsourcing (U) SMC Ltd',
    'Mariz Group',
    'Mariz Outsourcing',
    'Mariz Outsourcing Uganda',
    'BPO Kampala',
    'business process outsourcing Uganda',
    'outsourcing company Kampala',
    'revenue operations Uganda',
    'outsourced sales Kampala',
    'recruitment agency Kampala',
    'talent acquisition Uganda',
    '24/7 call center Uganda',
    'call support services Kampala',
    'IVR and CRBT services Uganda',
    'software development Uganda',
    'ERP development Kampala',
    'corporate branding Uganda',
    'corporate photography and videography Kampala',
    'business consultancy Uganda',
    'digital marketing agency Kampala',
    'SEO services Uganda',
    'sales and marketing outsourcing Uganda',
  ],
  category: 'Business Services',
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: { url: '/brand/moa-logo.png', type: 'image/png' },
    shortcut: '/brand/moa-logo.png',
    apple: '/brand/moa-logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_UG',
    siteName: 'Mariz Outsourcing (U) SMC Ltd',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE_URL, alt: SOCIAL_IMAGE.alt }],
  },
  other: {
    'geo.region': 'UG-C',
    'geo.placename': 'Kampala',
    'geo.position': '0.2644;32.5499',
    ICBM: '0.2644, 32.5499',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getPublishedSiteTheme();

  return (
    <html lang="en" className="font-local" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <StructuredData />
        <SiteChrome publicThemeStyle={siteThemeToCssVars({
          ...theme,
          background: defaultSiteTheme.background,
          text: defaultSiteTheme.text,
          secondary: defaultSiteTheme.secondary,
          primary: defaultSiteTheme.primary,
          accent: defaultSiteTheme.accent,
        })}>
          {children}
        </SiteChrome>
        <Toaster />
      </body>
    </html>
  );
}
