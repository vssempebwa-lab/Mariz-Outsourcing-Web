import Link from 'next/link';
import { ArrowRight, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { TeamMemberCard } from '@/components/site/team-member-card';
import { TEAM_MEMBERS } from '@/lib/team';

export const metadata = {
  title: 'Our Team',
  description:
    'Meet the leadership and specialist operators behind Mariz Outsourcing Agency, spanning revenue operations, talent acquisition, call center operations, software, branding, and media.',
};

const DEPARTMENT_SUMMARY = [
  'Leadership',
  'Revenue Operations',
  'Talent Acquisition',
  'Call Center Operations',
  'Software Development',
  'Branding & Media',
];

export default function TeamPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-16 pt-16 lg:pb-20 lg:pt-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5">
              <Users2 className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Our Team
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              The operators behind every Mariz engagement
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground">
              Meet the leadership and specialist teams coordinating revenue,
              talent, customer operations, software, brand, and media delivery
              across client engagements.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {DEPARTMENT_SUMMARY.map((department) => (
              <Card key={department} className="border-border">
                <CardContent className="flex min-h-24 items-center p-4">
                  <p className="text-sm font-semibold leading-tight text-foreground">
                    {department}
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
            eyebrow="People"
            title="Leadership and delivery specialists"
            description="Placeholder profiles are structured for easy replacement with real names, portraits, departments, and social links."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-balance text-white sm:text-4xl">
            Build your next operating team with Mariz
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-balance text-white/70">
            Tell us the roles, systems, or support workflows you need, and we
            will assemble the right specialists around your objectives.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">
                Request Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
