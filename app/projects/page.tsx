import { SectionHeading } from '@/components/site/section-heading';
import { ProjectCard } from '@/components/site/project-card';
import { ProjectsFilter } from '@/components/site/projects-filter';
import { PROJECTS } from '@/lib/projects';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';

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
      <PageHero
        eyebrow="Projects Executed"
        title="Completed work across the Mariz service ecosystem"
        description="Explore representative case studies from our revenue operations, talent acquisition, call center, software, branding, and media divisions."
      />

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

      <CtaBand
        title="Ready to execute your next project?"
        description="From one focused initiative to a multi-division operating system, our team can help you scope, staff, build, and deliver."
        primary={{ label: 'Start a Project', href: '/contact' }}
      />
    </>
  );
}
