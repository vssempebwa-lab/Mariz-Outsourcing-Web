import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { SITE, METRICS } from '@/lib/data';
import { Target, Eye, Heart, ArrowRight, Award, Handshake, Lightbulb, Activity } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description:
    'Mariz Outsourcing Agency (SMC) Ltd is a professional BPO and strategic consulting firm headquartered in Uganda, delivering end-to-end human capital solutions, call center operations, software development, and media production.',
};

const VALUES = [
  {
    icon: 'Target',
    title: 'Performance-Driven',
    description:
      'We measure our success by the operational outcomes we deliver — reduced costs, improved efficiency, and measurable growth for our clients.',
  },
  {
    icon: 'Eye',
    title: 'Operational Transparency',
    description:
      'Full visibility into performance, SLAs, and reporting. Our clients always know exactly how their operations are running.',
  },
  {
    icon: 'Handshake',
    title: 'Long-Term Partnership',
    description:
      'We operate as a direct extension of your team, building relationships grounded in trust, reliability, and mutual benefit.',
  },
  {
    icon: 'Lightbulb',
    title: 'Continuous Innovation',
    description:
      'We invest in technology, training, and process improvement to stay ahead of the curve and deliver increasingly better results.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                About MOA
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance text-foreground">
              Your strategic outsourcing partner in East Africa
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              {SITE.legalName} is a professional Business Process Outsourcing and
              strategic consulting firm delivering end-to-end human capital
              solutions, 24/7 call center support, software development, corporate
              branding, and media production.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 border-y border-border bg-navy">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent mb-5">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-3">
                Our Mission
              </h2>
              <p className="text-white/70 leading-relaxed">
                {SITE.mission}
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent mb-5">
                <Eye className="h-7 w-7" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-3">
                Our Vision
              </h2>
              <p className="text-white/70 leading-relaxed">
                {SITE.vision}
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent mb-5">
                <Heart className="h-7 w-7" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-3">
                Our Approach
              </h2>
              <p className="text-white/70 leading-relaxed">
                We operate as a direct extension of our clients&apos; teams —
                optimizing workflows, reducing administrative costs, and improving
                operational efficiency with a relentless focus on quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl aspect-[4/3]">
                <img
                  src="https://images.pexels.com/photos/7792841/pexels-photo-7792841.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Business partnership and collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-background rounded-2xl shadow-xl border border-border p-6 max-w-[240px] hidden sm:block">
                <div className="grid grid-cols-2 gap-4">
                  {METRICS.slice(0, 2).map((m) => (
                    <div key={m.label}>
                      <p className="font-display font-bold text-2xl text-primary">
                        {m.value}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <SectionHeading
                eyebrow="Who We Are"
                title="A full-service outsourcing agency built for scale"
                description="Headquartered at Adonai Plaza in Uganda, MOA serves corporate enterprises, hospitality groups, construction firms, healthcare providers, retailers, and manufacturers — delivering integrated solutions that span talent, technology, and brand."
                align="left"
              />
              <div className="mt-8 space-y-4">
                {[
                  'Integrated service divisions covering talent, technology, support, and creative under one roof',
                  '24/7 operations with a 200+ seat call center and omnichannel support capabilities',
                  'Custom software development from ERPs to financial tracking platforms',
                  'Strategic branding and cinematic media production for corporate clients',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 shrink-0 mt-0.5">
                      <Icon name="CheckCircle2" className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm text-foreground/80 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Values"
            title="The principles that guide every engagement"
            description="Our values are not aspirational statements — they are the operating standards we hold ourselves to every day."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <Card key={v.title} className="border-border hover:border-accent/30 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon name={v.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Industries We Serve"
            title="Sector expertise across six industries"
            description="We bring domain-specific knowledge to every engagement, tailoring our solutions to the operational realities of your sector."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: 'Building2', name: 'Corporate Enterprise' },
              { icon: 'Utensils', name: 'Hospitality & Culinary' },
              { icon: 'HardHat', name: 'Construction & Engineering' },
              { icon: 'Stethoscope', name: 'Healthcare' },
              { icon: 'ShoppingCart', name: 'Retail & Food Services' },
              { icon: 'Factory', name: 'Industrial Manufacturing' },
            ].map((ind) => (
              <div
                key={ind.name}
                className="flex items-center gap-4 p-5 rounded-xl border border-border bg-background hover:border-primary/20 hover:bg-muted/30 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Icon name={ind.icon} className="h-6 w-6" />
                </div>
                <span className="font-display font-semibold text-foreground">
                  {ind.name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/industries">
                Explore Industries
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-navy">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white text-balance">
            Let&apos;s build something efficient together
          </h2>
          <p className="mt-4 text-white/70 text-lg text-balance">
            Whether you need a single service or an integrated outsourcing solution,
            our team is ready to help you scale.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Request Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
