import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/site/section-heading';
import { ProjectCard } from '@/components/site/project-card';
import { ProjectsFilter } from '@/components/site/projects-filter';
import { PROJECTS } from '@/lib/projects';

export const metadata = {
  title: 'Projects Executed',
  description:
    'Explore completed Mariz Outsourcing Agency projects across revenue operations, call center operations, software development, branding, talent acquisition, and media production.',
};

export default function ProjectsPage() {
  const featuredProjects = PROJECTS.filter((project) => project.featured);
  const generalProjects = PROJECTS.filter((project) => !project.featured);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-16 pt-16 lg:pb-20 lg:pt-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5">
              <BriefcaseBusiness className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Projects Executed
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              Completed work across the Mariz service ecosystem
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground">
              Explore representative case studies from our revenue operations,
              talent acquisition, call center, software, branding, and media
              divisions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured Projects"
            title="High-impact engagements"
            description="Selected work that shows how Mariz combines people, process, technology, and creative execution."
            align="left"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Project Library"
            title="Filter work by service division"
            description="Use the tabs to browse the completed projects most relevant to your operating challenge."
            align="left"
          />
          <div className="mt-10">
            <ProjectsFilter projects={generalProjects} />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading
            title="Ready to execute your next project?"
            description="From one focused initiative to a multi-division operating system, our team can help you scope, staff, build, and deliver."
          />
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">
                Start a Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
