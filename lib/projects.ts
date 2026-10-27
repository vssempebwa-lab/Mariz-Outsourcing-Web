export type ProjectDivision =
  | 'RevOps'
  | 'Talent Acquisition'
  | 'Call Support'
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
  tags?: string[];
  metrics?: { label: string; value: string };
};

export const PROJECT_DIVISIONS: Array<'All' | ProjectDivision> = [
  'All',
  'RevOps',
  'Talent Acquisition',
  'Call Support',
  'Software Dev',
  'Branding',
  'Media',
];

export const PROJECTS: Project[] = [
  {
    id: 'rolkat',
    title: 'Rolkat Financial Services',
    division: 'RevOps',
    category: 'Financial Services & Revenue Operations',
    image: '/projects/rolkat.webp',
    summary:
      'Engineered high-performance revenue operations, loan processing pipelines, CRM synchronization, and digital outreach workflows for Rolkat Financial Services.',
    featured: true,
    tags: ['Financial Services', 'RevOps', 'Pipeline Architecture', 'CRM Sync'],
    metrics: { label: 'Pipeline Velocity', value: '+42%' },
  },
  {
    id: 'rubshoots',
    title: 'Rub Shoots Photography',
    division: 'Media',
    category: 'Photography Portfolio & Booking Platform',
    image: '/projects/rubshoots.webp',
    summary:
      'Custom portfolio and booking website for Rub Shoots Photography, showcasing wedding, portrait, graduation, and event galleries with online session reservation.',
    featured: true,
    tags: ['Photography Portfolio', 'Session Booking', 'Gallery Showcase', 'Web Design'],
    metrics: { label: 'Client Inquiries', value: '+75%' },
  },
  {
    id: 'socialnest',
    title: 'Social Nest',
    division: 'Software Dev',
    category: 'AI Publishing & Workflow Automation',
    image: '/projects/socialnest.webp',
    summary:
      'Plan, create, and publish faster with AI-powered media tools, content scheduling, and team publishing workflows in one unified web platform.',
    featured: true,
    tags: ['AI Publishing', 'Content Automation', 'Media Scheduling', 'Team Workflow'],
    metrics: { label: 'Workflow Boost', value: '3.5x' },
  },
  {
    id: 'kunju',
    title: 'Kunju Uganda',
    division: 'Software Dev',
    category: 'Property Platform & Real Estate Marketplace',
    image: '/projects/kunju.webp',
    summary:
      'Digital real estate marketplace featuring 2,400+ verified listings across 12 cities in Uganda, with landlord verification workflows and automated search filters.',
    featured: true,
    tags: ['Property Platform', 'Real Estate', 'Verified Listings', 'Marketplace'],
    metrics: { label: 'Active Listings', value: '2,400+' },
  },
  {
    id: 'rakenta',
    title: 'Rakentaa Real Estate',
    division: 'Software Dev',
    category: 'Property Management, Construction & Design',
    image: '/projects/rakenta.webp',
    summary:
      'Full-service property development, architecture, construction, and property management web platform developed for Rakenta Group of Companies.',
    featured: true,
    tags: ['Property Management', 'Construction', 'Architecture', 'Web Platform'],
    metrics: { label: 'Online Bookings', value: '3.2x' },
  },
  {
    id: 'shope4me',
    title: 'Shope4me',
    division: 'Software Dev',
    category: 'Digital Marketplace & E-Commerce Platform',
    image: '/projects/shope4me.webp',
    summary:
      'Modern e-commerce platform featuring automated inventory synchronization, secure multi-currency payment processing, mobile checkout optimization, and instant order dispatching.',
    featured: false,
    tags: ['E-Commerce', 'Inventory Sync', 'Payment Gateway', 'Cloud Backend'],
    metrics: { label: 'Checkout Speed', value: '1.2s' },
  },
  {
    id: 'wabzfoods',
    title: 'Wabz Foods',
    division: 'Software Dev',
    category: 'Online Food Ordering & Delivery Platform',
    image: '/projects/wabzfoods.webp',
    summary:
      'Modern food ordering and dispatch platform featuring real-time menu browsing, secure online payments, instant meal tracking, and localized delivery logistics.',
    featured: true,
    tags: ['Food Delivery', 'Online Ordering', 'Order Tracking', 'E-Commerce'],
    metrics: { label: 'Order Speed', value: '<25 Mins' },
  },
];
