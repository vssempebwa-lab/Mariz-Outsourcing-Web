import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { LeadForm } from '@/components/site/lead-form';
import { SITE } from '@/lib/data';
import { Phone, Mail, MapPin, Clock, Navigation } from 'lucide-react';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Mariz Outsourcing Agency. Request a consultation, explore our services, or ask a question — our team responds within one business day.',
};

const CONTACT_INFO = [
  {
    icon: 'Phone',
    label: 'Phone',
    value: SITE.phone,
    href: `tel:${SITE.phoneHref}`,
  },
  {
    icon: 'Mail',
    label: 'Email',
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: 'MapPin',
    label: 'Address',
    value: SITE.address,
    href: SITE.mapDirectionsUrl,
    external: true,
  },
  {
    icon: 'Clock',
    label: 'Hours',
    value: '24/7 Operations & Support',
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Contact Us
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance text-foreground">
              Let&apos;s talk about your operations
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              Whether you are exploring outsourcing for the first time or looking
              to scale existing operations, our team is ready to help. Request a
              consultation and we will respond within one business day.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <SectionHeading
                eyebrow="Contact Details"
                title="Reach us directly"
                align="left"
              />
              <div className="mt-8 space-y-4">
                {CONTACT_INFO.map((info) => {
                  const content = (
                    <Card className="border-border hover:border-primary/20 transition-colors">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                          <Icon name={info.icon} className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                            {info.label}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {info.value}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                  return info.href ? (
                    <a
                      key={info.label}
                      href={info.href}
                      className="block"
                      {...(info.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={info.label}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl bg-secondary p-6 text-foreground">
                <h3 className="font-display font-semibold text-lg mb-2">
                  Prefer to talk now?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our operations team is available 24/7. Call us directly and we will
                  connect you with the right specialist.
                </p>
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="inline-flex min-h-[44px] items-center gap-2 text-primary font-semibold text-lg hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  {SITE.phone}
                </a>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card className="border-border shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                    Request a Consultation
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Fill out the form below and our team will reach out within one
                    business day.
                  </p>
                  <LeadForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Visit Us"
            title="Find our office in Zzana, Kampala"
            description="We are on Level 3 of Honora Plaza, opposite Be Energy Fuels. Free consultation visits are available by appointment."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Head Office
                  </p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                    {SITE.address}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button asChild className="min-h-[44px]">
                  <a href={SITE.mapDirectionsUrl} target="_blank" rel="noreferrer">
                    <Navigation className="mr-2 h-4 w-4" />
                    Get Directions
                  </a>
                </Button>
                <Button asChild variant="outline" className="min-h-[44px]">
                  <a href={`tel:${SITE.phoneHref}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Us
                  </a>
                </Button>
              </div>
            </div>
            <iframe
              src={SITE.mapEmbedUrl}
              title={`Google Map showing ${SITE.name} at ${SITE.address}`}
              className="h-[320px] w-full sm:h-[400px] lg:h-[440px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  );
}
