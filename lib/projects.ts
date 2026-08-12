export type ProjectDivision =
  | 'RevOps'
  | 'Talent Acquisition'
  | 'Call Center'
  | 'Software Dev'
  | 'Branding'
  | 'Media';

export type Project = {
  id: string;
  title: string;
  division: ProjectDivision;
  category: string;
  image: string;
  summary: string;
  featured?: boolean;
  href?: string;
  external?: boolean;
};

export const PROJECT_DIVISIONS: Array<'All' | ProjectDivision> = [
  'All',
  'RevOps',
  'Talent Acquisition',
  'Call Center',
  'Software Dev',
  'Branding',
  'Media',
];

export const PROJECTS: Project[] = [
  {
    id: 'crm-sales-engine',
    title: 'B2B CRM & Sales Pipeline Engine',
    division: 'RevOps',
    category: 'High-Ticket Services',
    image:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    summary:
      'Designed a CRM architecture with lead scoring, routing rules, deal dashboards, follow-up automations, and contract handoff flows.',
    featured: true,
  },
  {
    id: 'omnichannel-support-center',
    title: 'Omnichannel Support Center Launch',
    division: 'Call Center',
    category: 'Telecom & Logistics',
    image:
      'https://images.pexels.com/photos/8867472/pexels-photo-8867472.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    summary:
      'Launched a 120-seat support operation across voice, email, live chat, WhatsApp, and social media with QA reporting.',
    featured: true,
  },
  {
    id: 'inventory-finance-platform',
    title: 'Inventory & Financial Control Platform',
    division: 'Software Dev',
    category: 'Manufacturing',
    image:
      'https://images.pexels.com/photos/6803554/pexels-photo-6803554.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    summary:
      'Built a custom platform for asset entry, stock sync, reorder alerts, transaction posting, and executive finance dashboards.',
    featured: true,
  },
  {
    id: 'specialist-talent-pipeline',
    title: 'Specialist Talent Pipeline',
    division: 'Talent Acquisition',
    category: 'Engineering & Construction',
    image:
      'https://images.pexels.com/photos/5439371/pexels-photo-5439371.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    summary:
      'Mapped competitors, sourced passive candidates, screened technical capability, and supported onboarding for specialist roles.',
  },
  {
    id: 'corporate-identity-system',
    title: 'Corporate Identity & Brand Bible',
    division: 'Branding',
    category: 'Corporate Services',
    image:
      'https://images.pexels.com/photos/7598009/pexels-photo-7598009.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    summary:
      'Created a full visual identity system with positioning, logo rules, typography, color palette, pitch decks, and collateral.',
  },
  {
    id: 'cinematic-brand-documentary',
    title: 'Cinematic Brand Documentary',
    division: 'Media',
    category: 'Hospitality',
    image:
      'https://images.pexels.com/photos/7709678/pexels-photo-7709678.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    summary:
      'Produced a corporate film with executive interviews, site footage, aerial scenes, color grading, and web-ready micro-content.',
  },
  {
    id: 'reactivation-campaign',
    title: 'Dormant Account Reactivation Campaign',
    division: 'Call Center',
    category: 'E-Commerce',
    image:
      'https://images.pexels.com/photos/7709179/pexels-photo-7709179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    summary:
      'Executed outbound reactivation and satisfaction audit workflows with segmented lists, call QA, and conversion reporting.',
  },
  {
    id: 'executive-search-program',
    title: 'Executive Search Program',
    division: 'Talent Acquisition',
    category: 'Scaling Startup',
    image:
      'https://images.pexels.com/photos/5439368/pexels-photo-5439368.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    summary:
      'Delivered a leadership shortlist using market mapping, discreet outreach, behavioral scorecards, and culture-fit assessment.',
  },
];
