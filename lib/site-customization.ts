import { cache, type CSSProperties } from 'react';

import { NAV_LINKS, SITE } from '@/lib/data';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { CurrentStaff } from '@/lib/staff-session';

export type SiteTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type SiteNavItem = {
  label: string;
  href: string;
};

export type SiteRevision = {
  id: string;
  status: 'draft' | 'published' | 'archived';
  name: string | null;
  theme: SiteTheme;
  nav_items: SiteNavItem[];
  footer: Record<string, string>;
  published_at: string | null;
  created_at: string;
};

export type PageSection = {
  id: string;
  revision_id: string;
  page_slug: string;
  section_type: string;
  sort_order: number;
  enabled: boolean;
  content: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    buttonLabel?: string;
    buttonHref?: string;
    imageUrl?: string;
  };
};

export type MediaAsset = {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
  alt: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export const defaultSiteTheme: SiteTheme = {
  primary: '#0075ff',
  secondary: '#020617',
  accent: '#00a995',
  background: '#000000',
  text: '#f8fbff',
};

export const editablePages = [
  'home',
  'about',
  'services',
  'industries',
  'portfolio',
  'careers',
  'blog',
  'contact',
] as const;

export const defaultNavItems: SiteNavItem[] = NAV_LINKS.map((item) => ({
  label: item.label,
  href: item.href,
}));

export const defaultFooter = {
  tagline: SITE.tagline,
  contactCta: 'Ready to scale your operations?',
};

const defaultSections = [
  {
    page_slug: 'home',
    section_type: 'hero',
    sort_order: 10,
    enabled: true,
    content: {
      eyebrow: 'Trusted BPO Partner in East Africa',
      heading: 'One agency for the services that keep your business moving.',
      body:
        'Recruitment, customer support, software, branding, and media production delivered through one coordinated outsourcing partner.',
      buttonLabel: 'Request Consultation',
      buttonHref: '/contact',
    },
  },
  {
    page_slug: 'home',
    section_type: 'cta',
    sort_order: 20,
    enabled: true,
    content: {
      eyebrow: 'Get Started',
      heading: 'Ready to Scale Your Operations?',
      body:
        'Tell us about your business and the challenges you are facing. Our team will reach out within one business day.',
      buttonLabel: 'Contact MOA',
      buttonHref: '/contact',
    },
  },
] satisfies Array<Omit<PageSection, 'id' | 'revision_id'>>;

export function assertSiteCustomizer(staff: CurrentStaff) {
  if (staff.role !== 'super_admin') {
    throw new Error('Only Super Admin can manage site customization.');
  }
}

export function hexToHslTriplet(hex: string) {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function siteThemeToCssVars(theme: SiteTheme) {
  return {
    '--primary': hexToHslTriplet(theme.primary),
    '--ring': hexToHslTriplet(theme.primary),
    '--accent': hexToHslTriplet(theme.accent),
    '--secondary': hexToHslTriplet(theme.secondary),
    '--background': hexToHslTriplet(theme.background),
    '--foreground': hexToHslTriplet(theme.text),
    '--card': hexToHslTriplet(theme.background),
    '--card-foreground': hexToHslTriplet(theme.text),
  } as CSSProperties;
}

export const getPublishedSiteTheme = cache(async () => {
  try {
    const { data } = await getSupabaseAdmin()
      .from('site_revisions')
      .select('theme')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return (data?.theme as SiteTheme | null) || defaultSiteTheme;
  } catch {
    return defaultSiteTheme;
  }
});

export const getPublishedPageSections = cache(async (pageSlug: string) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data: revision } = await supabase
      .from('site_revisions')
      .select('id')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!revision?.id) {
      return [] as PageSection[];
    }

    const { data } = await supabase
      .from('page_sections')
      .select('*')
      .eq('revision_id', revision.id)
      .eq('page_slug', pageSlug)
      .eq('enabled', true)
      .order('sort_order');

    return (data || []) as PageSection[];
  } catch {
    return [] as PageSection[];
  }
});

export async function ensureCustomizationDraft(staff: CurrentStaff) {
  assertSiteCustomizer(staff);

  const supabase = getSupabaseAdmin();
  const { data: draft } = await supabase
    .from('site_revisions')
    .select('*')
    .eq('status', 'draft')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (draft) {
    return draft as SiteRevision;
  }

  const { data: published } = await supabase
    .from('site_revisions')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const base = published as SiteRevision | null;
  const { data: revision, error } = await supabase
    .from('site_revisions')
    .insert({
      name: 'Working draft',
      status: 'draft',
      theme: base?.theme || defaultSiteTheme,
      nav_items: base?.nav_items || defaultNavItems,
      footer: base?.footer || defaultFooter,
      created_by: staff.id && staff.id !== 'employee-preview' ? staff.id : null,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (base) {
    const { data: publishedSections } = await supabase
      .from('page_sections')
      .select('page_slug, section_type, sort_order, enabled, content')
      .eq('revision_id', base.id)
      .order('sort_order');

    if (publishedSections?.length) {
      await supabase.from('page_sections').insert(
        publishedSections.map((section) => ({
          ...section,
          revision_id: revision.id,
        }))
      );
    }
  } else {
    await supabase.from('page_sections').insert(
      defaultSections.map((section) => ({
        ...section,
        revision_id: revision.id,
      }))
    );
  }

  return revision as SiteRevision;
}

export async function getCustomizationWorkspace(staff: CurrentStaff) {
  const draft = await ensureCustomizationDraft(staff);
  const supabase = getSupabaseAdmin();

  const [{ data: sections }, { data: media }, { data: versions }] =
    await Promise.all([
      supabase
        .from('page_sections')
        .select('*')
        .eq('revision_id', draft.id)
        .order('page_slug')
        .order('sort_order'),
      supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(24),
      supabase
        .from('site_revisions')
        .select('*')
        .in('status', ['published', 'archived'])
        .order('published_at', { ascending: false })
        .limit(8),
    ]);

  return {
    draft,
    sections: (sections || []) as PageSection[],
    media: (media || []) as MediaAsset[],
    versions: (versions || []) as SiteRevision[],
  };
}
