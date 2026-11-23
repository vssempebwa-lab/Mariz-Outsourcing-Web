import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { TeamMemberCard } from '@/components/site/team-member-card';
import { TEAM_MEMBERS } from '@/lib/team';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';

export const metadata = {
  title: 'Our Team',
  description:
    'Meet the leadership and specialist operators behind Mariz Outsourcing Agency, spanning revenue operations, talent acquisition, call center operations, software, branding, and media.',
};

const DEPARTMENT_SUMMARY = Array.from(new Set(TEAM_MEMBERS.map((member) => member.department)));

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="The operators behind every Mariz engagement"
        description="Meet the leadership and specialist teams coordinating revenue, talent, customer operations, software, brand, and media delivery across client engagements."
      />

      <section className="border-y border-border bg-muted/30 py-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
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
            description="Meet the people behind MARIZ OUTSOURCING (U) - SMC LIMITED, spanning leadership, human resource, finance, and software development."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Build your next operating team with Mariz"
        description="Tell us the roles, systems, or support workflows you need, and we will assemble the right specialists around your objectives."
      />
    </>
  );
}
