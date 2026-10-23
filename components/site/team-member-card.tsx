import { Linkedin, Link as LinkIcon, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { TeamMember } from '@/lib/team';

export function TeamMemberCard({ member }: { member: TeamMember }) {
  const socials = [
    {
      label: 'LinkedIn',
      href: member.socials?.linkedin,
      icon: Linkedin,
    },
    {
      label: 'Website',
      href: member.socials?.website,
      icon: LinkIcon,
    },
    {
      label: 'Email',
      href: member.socials?.email ? `mailto:${member.socials.email}` : undefined,
      icon: Mail,
    },
  ].filter((item) => item.href);

  return (
    <Card className="group h-full min-w-0 overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-xl">
      <CardContent className="p-0">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/70 to-transparent" />
          <span className="absolute bottom-4 left-4 right-4 w-fit max-w-[calc(100%-2rem)] rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">
            {member.department}
          </span>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 basis-40">
              <h3 className="break-words font-display text-xl font-bold leading-tight text-foreground">
                {member.name}
              </h3>
              <p className="mt-1 break-words text-sm font-semibold text-primary">
                {member.role}
              </p>
            </div>
            {socials.length > 0 && (
              <div className="flex shrink-0 items-center gap-1">
                {socials.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={`${member.name} ${social.label}`}
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      target={social.label === 'Email' ? undefined : '_blank'}
                      rel={social.label === 'Email' ? undefined : 'noreferrer'}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
