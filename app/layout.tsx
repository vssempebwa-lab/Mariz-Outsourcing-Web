import './globals.css';
import type { Metadata } from 'next';
import { SiteChrome } from '@/components/site/site-chrome';
import { Toaster } from '@/components/ui/sonner';
import { defaultSiteTheme, getPublishedSiteTheme, siteThemeToCssVars } from '@/lib/site-customization';

export const metadata: Metadata = {
  icons: {
    icon: { url: '/brand/moa-logo.png', type: 'image/png' },
    shortcut: '/brand/moa-logo.png',
    apple: '/brand/moa-logo.png',
  },
  title: {
    default: 'Mariz Outsourcing (U) SMC Ltd — Strategic BPO & Corporate Growth',
    template: '%s | Mariz Outsourcing (U) SMC Ltd',
  },
  description:
    'Mariz Outsourcing (U) SMC Ltd is a strategic BPO and corporate growth enterprise delivering revenue operations, talent acquisition, 24/7 call support and audio services, software development, consultancy, digital marketing, branding, media production, and community skills development across East Africa and beyond.',
  keywords: [
    'BPO Uganda',
    'business process outsourcing Uganda',
    'outsourcing company Uganda',
    'revenue operations',
    'outsourced sales',
    'call support',
    'audio services',
    'talent acquisition',
    'software development',
    'corporate branding',
    'media production',
    'community skilling',
    'Mariz Outsourcing (U) SMC Ltd',
  ],
  metadataBase: new URL('https://www.moa.co.ug'),
  openGraph: {
    title: 'Mariz Outsourcing (U) SMC Ltd — Strategic BPO Partner',
    description:
      'Revenue operations, talent acquisition, 24/7 call support and audio services, and custom software development built to scale your business.',
    type: 'website',
    url: 'https://www.moa.co.ug',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mariz Outsourcing (U) SMC Ltd — Strategic BPO Partner',
    description:
      'Revenue operations, talent acquisition, 24/7 call support and audio services, and custom software development built to scale your business.',
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
