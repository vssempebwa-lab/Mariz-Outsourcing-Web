'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/site/project-card';
import { PROJECT_DIVISIONS, type Project, type ProjectDivision } from '@/lib/projects';
import { cn } from '@/lib/utils';

type ProjectFilter = 'All' | ProjectDivision;

export function ProjectsFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectFilter>('All');

  const filteredProjects = useMemo(() => {
    if (active === 'All') return projects;
    return projects.filter((project) => project.division === active);
  }, [active, projects]);

  return (
    <div>
      <div
        className="mb-10 flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Filter projects by service division"
      >
        {PROJECT_DIVISIONS.map((division) => (
          <button
            key={division}
            type="button"
            role="tab"
            aria-selected={active === division}
            onClick={() => setActive(division)}
            className={cn(
              'min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              active === division
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            )}
          >
            {division}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
