import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Project } from '@/lib/projects';

export function ProjectCard({ project }: { project: Project }) {
  const body = (
    <Card className="group h-full overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              {project.division}
            </span>
            <span className="rounded-full bg-navy/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {project.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-xl font-bold leading-tight text-foreground">
              {project.title}
            </h3>
            {project.href && (
              <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (!project.href) {
    return body;
  }

  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer">
        {body}
      </a>
    );
  }

  return <Link href={project.href}>{body}</Link>;
}
