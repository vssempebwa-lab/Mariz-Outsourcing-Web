import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Project } from '@/lib/projects';

export function ProjectCard({ project }: { project: Project }) {
  const body = (
    <Card className="group h-full overflow-hidden border-border transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
      <CardContent className="flex h-full flex-col p-0">
        <div className="relative aspect-[2/1] overflow-hidden bg-navy">
          <img
            src={project.image}
            alt={`${project.title} project screenshot`}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
              {project.division}
            </span>
            <span className="rounded-full border border-white/10 bg-navy/80 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur">
              {project.category}
            </span>
          </div>
          {project.metrics && (
            <div className="absolute bottom-3 right-4 rounded-lg border border-white/15 bg-navy/90 px-2.5 py-1 backdrop-blur">
              <span className="mr-1.5 text-[10px] font-bold uppercase text-accent">
                {project.metrics.label}
              </span>
              <span className="text-xs font-bold text-white">{project.metrics.value}</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                {project.title}
              </h3>
              {project.href && (
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
          </div>
          {project.tags && project.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!project.href) {
    return body;
  }

  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer" className="block h-full">
        {body}
      </a>
    );
  }

  return (
    <Link href={project.href} className="block h-full">
      {body}
    </Link>
  );
}
