import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { JOB_LISTINGS } from '@/lib/data';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Users, Heart, Award } from 'lucide-react';

export const metadata = {
  title: 'Careers',
  description:
    'Join Mariz Outsourcing Agency. Explore open roles across operations, software, recruitment, creative, and media divisions in Kampala, Uganda.',
};

const PERKS = [
  { icon: 'Award', title: 'Professional Growth', description: 'Structured training and career progression across all divisions.' },
  { icon: 'Heart', title: 'Health & Wellbeing', description: 'Comprehensive health coverage and wellbeing support for all staff.' },
  { icon: 'Users', title: 'Collaborative Culture', description: 'Work alongside experienced professionals in a supportive team environment.' },
  { icon: 'TrendingUp', title: 'Performance Rewards', description: 'Competitive compensation with performance-based incentives.' },
];

export default function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Careers at MOA
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance text-foreground">
              Build your career at East Africa&apos;s growing outsourcing partner
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              We are always looking for talented professionals to join our team —
              across operations, software, recruitment, creative, and media
              divisions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Join Us"
            title="More than a job — a career path"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p) => (
              <Card key={p.title} className="border-border">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                    <Icon name={p.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-base text-foreground mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Open Positions"
            title="Current job openings"
            description="Browse our active roles. Don't see a fit? Send us your CV and we will keep you in mind for future opportunities."
          />
          <div className="mt-12 space-y-4">
            {JOB_LISTINGS.map((job) => (
              <Card key={job.title} className="border-border hover:border-primary/20 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-foreground">
                          {job.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground lg:ml-13 ml-0">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="flex h-2 w-2 rounded-full bg-accent" />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                      <Button asChild size="sm" variant="outline">
                        <Link href="/contact">Apply Now</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-navy">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white text-balance">
            Ready to join the MOA team?
          </h2>
          <p className="mt-4 text-white/70 text-lg text-balance">
            Send us your CV and a brief note about your experience. We review every
            application carefully.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">Submit Your Application</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
