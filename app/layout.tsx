import './globals.css';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter, Instrument_Serif } from 'next/font/google';
import { SiteChrome } from '@/components/site/site-chrome';
import { Toaster } from '@/components/ui/sonner';
import { defaultSiteTheme, getPublishedSiteTheme, siteThemeToCssVars } from '@/lib/site-customization';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});
const serif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: '400',
  style: ['italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  icons: {
    icon: { url: '/brand/moa-logo.png', type: 'image/png' },
    shortcut: '/brand/moa-logo.png',
    apple: '/brand/moa-logo.png',
  },
  title: {
    default: 'Mariz Outsourcing Agency — Streamline Your Business With Strategic Outsourcing',
    template: '%s | Mariz Outsourcing Agency',
  },
  description:
    'Mariz Outsourcing Agency (SMC) Ltd delivers revenue operations, talent acquisition, 24/7 call center support, custom software development, corporate branding, and media production across East Africa and beyond.',
  keywords: [
    'BPO Uganda',
    'outsourcing agency',
    'revenue operations',
    'outsourced sales',
    'call center',
    'talent acquisition',
    'software development',
    'corporate branding',
    'media production',
    'Mariz Outsourcing Agency',
  ],
  metadataBase: new URL('https://www.moa.co.ug'),
  openGraph: {
    title: 'Mariz Outsourcing Agency — Strategic Outsourcing',
    description:
      'Revenue operations, talent acquisition, 24/7 call center operations, and custom software development built to scale your business.',
    type: 'website',
    url: 'https://www.moa.co.ug',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mariz Outsourcing Agency — Strategic Outsourcing',
    description:
      'Revenue operations, talent acquisition, 24/7 call center operations, and custom software development built to scale your business.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getPublishedSiteTheme();

  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${serif.variable}`} suppressHydrationWarning>
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
