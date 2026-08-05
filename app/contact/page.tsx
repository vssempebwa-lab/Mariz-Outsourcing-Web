import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { LeadForm } from '@/components/site/lead-form';
import { SITE } from '@/lib/data';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

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
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
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
                    <a key={info.label} href={info.href} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={info.label}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl bg-navy p-6 text-white">
                <h3 className="font-display font-semibold text-lg mb-2">
                  Prefer to talk now?
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  Our operations team is available 24/7. Call us directly and we will
                  connect you with the right specialist.
                </p>
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="inline-flex items-center gap-2 text-accent font-semibold text-lg hover:text-white transition-colors"
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
          <div className="rounded-2xl overflow-hidden border border-border bg-muted/30 h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <p className="font-display font-semibold text-lg text-foreground">
                {SITE.address}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {SITE.website}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
