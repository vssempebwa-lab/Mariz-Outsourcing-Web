import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mariz Outsourcing Agency — Streamline Your Business With Strategic Outsourcing',
    template: '%s | Mariz Outsourcing Agency',
  },
  description:
    'Mariz Outsourcing Agency (SMC) Ltd delivers end-to-end human capital solutions, 24/7 call center support, custom software development, corporate branding, and media production across East Africa and beyond.',
  keywords: [
    'BPO Uganda',
    'outsourcing agency',
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
      'End-to-end human capital, 24/7 call center operations, and custom software development built to scale your business.',
    type: 'website',
    url: 'https://www.moa.co.ug',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mariz Outsourcing Agency — Strategic Outsourcing',
    description:
      'End-to-end human capital, 24/7 call center operations, and custom software development built to scale your business.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
