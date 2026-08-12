import './globals.css';
import type { Metadata } from 'next';
import { SiteChrome } from '@/components/site/site-chrome';
import { Toaster } from '@/components/ui/sonner';
import { getPublishedSiteTheme, siteThemeToCssVars } from '@/lib/site-customization';

export const metadata: Metadata = {
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
    <html lang="en" className="font-local" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SiteChrome publicThemeStyle={siteThemeToCssVars(theme)}>
          {children}
        </SiteChrome>
        <Toaster />
      </body>
    </html>
  );
}
