export const SITE = {
  name: 'Mariz Outsourcing Agency',
  shortName: 'MOA',
  legalName: 'Mariz Outsourcing Agency (SMC) Ltd',
  tagline: 'Streamline your business with strategic outsourcing.',
  phone: '+256 705 285 709',
  phoneHref: '+256705285709',
  website: 'www.moa.co.ug',
  websiteUrl: 'https://www.moa.co.ug',
  address: 'Adonai Plaza, Opp Be Energy Petrol Station, Uganda',
  email: 'info@moa.co.ug',
  mission:
    'To help businesses operate more efficiently and profitably by providing reliable outsourcing solutions that reduce operational stress, enhance productivity, and improve overall business performance.',
  vision:
    'To become a globally trusted outsourcing partner, recognized for service excellence, operational transparency, and the ability to build long-term, mutually beneficial client relationships.',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Team', href: '/team' },
  { label: 'Projects', href: '/projects' },
  { label: 'Industries', href: '/industries' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const SERVICES = [
  {
    slug: 'revops-sales',
    title: 'Revenue Operations & Outsourced Sales',
    short: 'Performance-driven pipeline buildout, sales execution, and revenue reconciliation.',
    description:
      'Mariz RevOps builds, optimizes, and executes end-to-end sales pipelines for growing businesses. We align CRM architecture, lead data, closing specialists, contract administration, and financial reconciliation into one measurable revenue engine.',
    icon: 'TrendingUp',
    image:
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    objective: 'End-to-end sales closing and pipeline build',
    targetMetric: 'Closed revenue, pipeline velocity, conversion rate',
    targetAudience: 'B2B companies, high-ticket services, SaaS teams, and growth-stage firms',
    workflow: [
      'Pipeline architecture and CRM synchronization',
      'Automated lead scoring and instant routing',
      'Certified dealmaker deployment',
      'Live discovery calls, demos, outreach, and follow-up',
      'Contract generation, e-signature routing, and invoice sync',
      'Re-engagement, satisfaction tracking, and cross-selling workflows',
    ],
    features: [
      'Salesforce, HubSpot, and Zoho CRM setup',
      'Web form, ad funnel, and channel integration',
      'Automated lead scoring and routing',
      'Real-time pipeline dashboards',
      'High-ticket closing and consultative selling',
      'Inbound calls, demos, outbound calls, email, and SMS follow-up',
      'AI-supported call sentiment analysis and recording audits',
      'Automated contracts, NDAs, e-signatures, and revenue reconciliation',
    ],
  },
  {
    slug: 'recruitment',
    title: 'Strategic Recruitment & Talent Acquisition',
    short: 'Executive search, passive talent sourcing, assessment, and onboarding.',
    description:
      'Mariz Strategic Recruitment & Talent Acquisition provides specialized headhunting, executive search, and workforce scaling. We map markets, engage passive talent, verify capability, and support onboarding so clients can hire for both performance and long-term fit.',
    icon: 'Users',
    image:
      'https://images.pexels.com/photos/5439368/pexels-photo-5439368.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    objective: 'Executive headhunting and staff scaling',
    targetMetric: '95%+ retention, speed-to-value, candidate quality',
    targetAudience: 'Enterprises, scaling startups, technical teams, and specialized operators',
    workflow: [
      'Competitor mapping and passive search',
      'Discrete outreach across specialist networks',
      'Psychometric, behavioral, and technical assessment',
      'Culture-fit scorecards and retention forecasting',
      'ATS integration, background checks, and pipeline reporting',
      '30-60-90 day onboarding and executive coaching',
    ],
    features: [
      'Executive search and specialist headhunting',
      'Competitor mapping for passive talent pools',
      'Niche industry sourcing and discreet outreach',
      'Psychometric profiling and behavioral assessment',
      'Real-world technical skill verification labs',
      'Culture-fit scorecards targeting 95%+ retention',
      'High-volume and boutique recruitment pipeline management',
      'ATS integration, background checks, and structured onboarding',
    ],
  },
  {
    slug: 'call-center',
    title: 'Call Center & Customer Support Operations',
    short: '24/7 omnichannel support, helpdesk, outbound growth, and QA.',
    description:
      'The Call Center & Customer Support division delivers always-on communication infrastructure across voice, email, web, chat, WhatsApp, and social channels. Tiered support, outbound growth campaigns, QA, and compliance controls help every customer touchpoint create measurable value.',
    icon: 'Headset',
    image:
      'https://images.pexels.com/photos/7709179/pexels-photo-7709179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    objective: '24/7 inbound and outbound customer operations',
    targetMetric: 'First-contact resolution, SLA performance, customer satisfaction',
    targetAudience: 'E-commerce, telecom, logistics, hospitality, and service businesses',
    workflow: [
      'Unified omnichannel intake',
      'Tier 1 triage through Tier 3 technical escalation',
      'Predictive outbound dialing and lead nurturing',
      'Dormant account reactivation and satisfaction audits',
      '100% call recording, QA reviews, and sentiment analysis',
      'Secure infrastructure aligned with GDPR and data sovereignty requirements',
    ],
    features: [
      '24/7/365 inbound and outbound coverage',
      'Voice, email, web, chat, WhatsApp, and social media support',
      'Tier 1 to Tier 3 technical helpdesk models',
      'Scalable teams from 5 agents to 200+ seat operations',
      'Predictive dialing and lead-scored outbound campaigns',
      'Reactivation, cross-selling, and upselling workflows',
      'AI-supported sentiment analysis and agent calibration',
      'Compliance-ready recording, reporting, and data security',
    ],
  },
  {
    slug: 'software',
    title: 'Software Development & IT Solutions',
    short: 'Custom enterprise apps, automation, cloud infrastructure, and IT support.',
    description:
      'Mariz builds secure web applications, mobile platforms, enterprise software, and automation systems that remove manual bottlenecks. We centralize disconnected databases into cloud-ready operational platforms built around each client workflow.',
    icon: 'Code2',
    image:
      'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    objective: 'Custom business automation and software infrastructure',
    targetMetric: '99.9% uptime, secure operations, zero manual data drops',
    targetAudience: 'Operations teams, retail businesses, finance teams, and scaling enterprises',
    workflow: [
      'Business process analysis and software architecture',
      'React, TypeScript, Node.js, and modern web/mobile development',
      'Cloud infrastructure engineering on AWS and Azure',
      'Inventory control, stock alerts, and asset reconciliation',
      'Financial dashboards for cash flow, ledgers, payables, and customer credits',
      'Security-by-design, API integration, maintenance, and AI consulting',
    ],
    features: [
      'Bespoke enterprise software and web applications',
      'Cross-platform mobile application development',
      'AWS and Azure cloud infrastructure engineering',
      'Automated inventory tracking and reorder alerts',
      'Financial management dashboards and ledger visibility',
      'Role-based access, encrypted storage, and audit logs',
      'API integration, data migration, and 24/7 maintenance',
      'Practical AI and business automation consulting',
    ],
  },
  {
    slug: 'branding',
    title: 'Strategic Branding & Corporate Identity',
    short: 'Brand strategy, visual identity systems, collateral, and reputation assets.',
    description:
      'The Strategic Branding & Corporate Identity division develops unified visual and narrative systems for organizations that need credibility across every client-facing touchpoint, from market positioning to brand guidelines, pitch collateral, and digital storefront assets.',
    icon: 'Palette',
    image:
      'https://images.pexels.com/photos/8546590/pexels-photo-8546590.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    objective: 'High-authority visual and narrative identity',
    targetMetric: 'Complete Brand Bible, pitch collateral, consistent market presence',
    targetAudience: 'Corporate entities, product launches, founders, and investor-facing teams',
    workflow: [
      'Brand DNA, mission, voice, and positioning definition',
      'Executive branding for leadership credibility',
      'Primary and secondary logo systems',
      'Typography, color palette, and usage rules',
      'Brand Bible development for digital, print, and packaging',
      'Pitch decks, annual reports, social assets, and reputation tracking',
    ],
    features: [
      'Brand mission, voice, differentiators, and positioning',
      'Executive branding and investor relations support',
      'Logo systems, typography suites, and color palettes',
      'Full Brand Bible and visual usage guidelines',
      'Sales decks, prospectuses, annual reports, and corporate stationery',
      'Digital storefront branding and social media asset packages',
      'Packaging, signage, merchandise, and print collateral',
      'Reputation tracking with automated sentiment analysis',
    ],
  },
  {
    slug: 'media',
    title: 'Professional Photography & Cinematic Videography',
    short: 'Broadcast-quality photography, drone footage, brand films, and micro-content.',
    description:
      'The Professional Photography & Cinematic Videography division produces original, broadcast-quality content for corporate storytelling, marketing campaigns, site documentation, investor updates, and web assets.',
    icon: 'Video',
    image:
      'https://images.pexels.com/photos/10024703/pexels-photo-10024703.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    objective: 'High-definition corporate storytelling',
    targetMetric: 'Broadcast-quality photo and video assets',
    targetAudience: 'Real estate, industrial, infrastructure, hospitality, and marketing teams',
    workflow: [
      'Executive portraiture and leadership photography',
      'Team imagery for publications and digital platforms',
      'Industrial, construction, and infrastructure documentation',
      'Licensed 4K aerial drone cinematography',
      'Brand documentaries, executive interviews, and customer success films',
      'Editing, color grading, sound design, and social micro-content optimization',
    ],
    features: [
      'Corporate headshots, leadership portraiture, and team imagery',
      'Technical site and operational facility documentation',
      'Licensed 4K aerial drone videography',
      'Cinematic brand documentaries and executive interviews',
      'Customer success video case studies',
      'Professional editing, color grading, sound design, and audio post',
      'Corporate podcast and video series support',
      'Long-form footage repurposed into social and web micro-content',
    ],
  },
];

export const INDUSTRIES = [
  {
    title: 'Corporate Enterprise',
    description:
      'Scalable staffing, IT systems, and support operations for large organizations managing complex workflows.',
    image:
      'https://images.pexels.com/photos/7792841/pexels-photo-7792841.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Hospitality & Culinary',
    description:
      'Front desk support, reservations, and talent placement for hotels, restaurants, and catering operations.',
    image:
      'https://images.pexels.com/photos/4873361/pexels-photo-4873361.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Construction & Engineering',
    description:
      'Skilled trades recruitment, project staffing, and operational software for construction firms.',
    image:
      'https://images.pexels.com/photos/3680959/pexels-photo-3680959.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Healthcare',
    description:
      'Compliant staffing, patient support lines, and healthcare administration solutions.',
    image:
      'https://images.pexels.com/photos/5452247/pexels-photo-5452247.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Retail & Food Services',
    description:
      'Customer support, inventory tracking systems, and seasonal staffing for retail and food brands.',
    image:
      'https://images.pexels.com/photos/6777536/pexels-photo-6777536.png?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Industrial Manufacturing',
    description:
      'Workforce management, ERP integration, and operational efficiency systems for manufacturers.',
    image:
      'https://images.pexels.com/photos/8961007/pexels-photo-8961007.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export const METRICS = [
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '200+', label: 'Agent Floor Capacity' },
  { value: '98%', label: 'Client Retention Rate' },
  { value: '24/7', label: 'Operations Coverage' },
];

export const WORK_CYCLE = [
  {
    step: '01',
    title: 'Assessment',
    description:
      'We analyze your current operations, identify bottlenecks, and define clear objectives for the engagement.',
    icon: 'ClipboardCheck',
  },
  {
    step: '02',
    title: 'Design',
    description:
      'We architect a tailored solution — staffing model, software spec, or brand strategy — aligned to your goals.',
    icon: 'PenTool',
  },
  {
    step: '03',
    title: 'Implementation',
    description:
      'Our teams execute: recruit talent, build software, or produce media with full project management oversight.',
    icon: 'Rocket',
  },
  {
    step: '04',
    title: 'Quality Assurance',
    description:
      'Rigorous QA, testing, and performance monitoring ensure every deliverable meets our quality bar.',
    icon: 'ShieldCheck',
  },
  {
    step: '05',
    title: 'Reporting',
    description:
      'Transparent, data-driven reports keep you informed on performance, SLAs, and continuous improvement.',
    icon: 'BarChart3',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'MOA transformed our customer support operations. Their 24/7 team handles our entire inbound flow with a 95% first-call resolution rate — we have not looked back.',
    author: 'Director of Operations',
    company: 'Regional Hospitality Group',
  },
  {
    quote:
      'The custom ERP MOA built replaced three disconnected systems. Our inventory reconciliation that used to take a week now runs in real time.',
    author: 'CFO',
    company: 'Manufacturing Firm',
  },
  {
    quote:
      'Their recruitment team filled 40 specialist roles in under eight weeks. The quality of candidates was consistently high across every batch.',
    author: 'Head of HR',
    company: 'Engineering & Construction',
  },
];

export const PORTFOLIO_ITEMS = [
  {
    title: 'Omnichannel Support Center Launch',
    category: 'Call Center',
    description:
      'Designed and launched a 120-seat omnichannel support operation handling voice, email, and chat for a regional telecom client.',
    image:
      'https://images.pexels.com/photos/8867472/pexels-photo-8867472.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Enterprise Resource Planning System',
    category: 'Software',
    description:
      'Built a custom ERP integrating inventory, finance, and HR modules for a mid-size manufacturing company.',
    image:
      'https://images.pexels.com/photos/6803554/pexels-photo-6803554.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Corporate Brand Refresh',
    category: 'Branding',
    description:
      'Complete brand identity redesign including logo system, guidelines, and full marketing collateral suite.',
    image:
      'https://images.pexels.com/photos/7598009/pexels-photo-7598009.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Cinematic Brand Film',
    category: 'Media',
    description:
      'Produced a 3-minute cinematic brand film with aerial footage and motion graphics for a hospitality group.',
    image:
      'https://images.pexels.com/photos/7709678/pexels-photo-7709678.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Specialist Talent Pipeline',
    category: 'Recruitment',
    description:
      'Sourced and placed 40 engineering specialists across three project sites within an eight-week window.',
    image:
      'https://images.pexels.com/photos/5439371/pexels-photo-5439371.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    title: 'Financial Tracking Platform',
    category: 'Software',
    description:
      'Developed a real-time financial tracking and reporting platform with automated reconciliation.',
    image:
      'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
];

export const BLOG_POSTS = [
  {
    slug: 'why-outsource-in-east-africa',
    title: 'Why East Africa Is the Next BPO Frontier',
    excerpt:
      'Uganda and the wider East African region are emerging as competitive destinations for business process outsourcing. Here is what makes the region compelling.',
    date: '2025-06-18',
    readTime: '6 min read',
    category: 'Industry Insights',
  },
  {
    slug: 'building-a-24-7-support-operation',
    title: 'What It Takes to Run a True 24/7 Support Operation',
    excerpt:
      'Around-the-clock support is more than staffing shifts. We break down the infrastructure, QA, and management that make it reliable.',
    date: '2025-05-30',
    readTime: '8 min read',
    category: 'Operations',
  },
  {
    slug: 'custom-erp-vs-off-the-shelf',
    title: 'Custom ERP vs. Off-the-Shelf: Making the Right Call',
    excerpt:
      'When does a custom-built system justify its cost over a packaged solution? A practical framework for the build-vs-buy decision.',
    date: '2025-05-12',
    readTime: '5 min read',
    category: 'Software',
  },
  {
    slug: 'employer-branding-that-works',
    title: 'Employer Branding That Actually Attracts Talent',
    excerpt:
      'Your employer brand is your most powerful recruitment tool. Here is how to build one that resonates with the candidates you want.',
    date: '2025-04-22',
    readTime: '7 min read',
    category: 'Branding',
  },
];

export const JOB_LISTINGS = [
  {
    title: 'Call Center Agent — Night Shift',
    department: 'Operations',
    location: 'On-site, Kampala',
    type: 'Full-time',
    description:
      'Handle inbound and outbound customer interactions across voice and chat channels. Full training provided.',
  },
  {
    title: 'Senior Software Engineer',
    department: 'Software',
    location: 'Hybrid, Kampala',
    type: 'Full-time',
    description:
      'Design and build custom ERP and web applications for enterprise clients. TypeScript, Node.js, PostgreSQL.',
  },
  {
    title: 'Recruitment Specialist',
    department: 'Human Resources',
    location: 'On-site, Kampala',
    type: 'Full-time',
    description:
      'Manage end-to-end recruitment pipelines across multiple client accounts, from sourcing to onboarding.',
  },
  {
    title: 'Brand Designer',
    department: 'Creative',
    location: 'Hybrid, Kampala',
    type: 'Full-time',
    description:
      'Create brand identities, marketing collateral, and digital assets for corporate clients.',
  },
  {
    title: 'Videographer / Editor',
    department: 'Media',
    location: 'On-site, Kampala',
    type: 'Contract',
    description:
      'Shoot and edit cinematic video content for corporate films, events, and advertising campaigns.',
  },
];

export const SERVICE_OPTIONS = [
  'Revenue Operations & Outsourced Sales',
  'Strategic Recruitment & Talent Acquisition',
  'Call Center & Customer Support Operations',
  'Software Development & IT Solutions',
  'Strategic Branding & Corporate Identity',
  'Professional Photography & Cinematic Videography',
  'General Inquiry',
];
