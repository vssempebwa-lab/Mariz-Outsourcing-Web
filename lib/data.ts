export const SITE = {
  name: 'Mariz Outsourcing (U) SMC Ltd',
  shortName: 'Mariz',
  legalName: 'Mariz Outsourcing (U) SMC Ltd',
  tagline: 'Your strategic BPO and corporate growth partner.',
  phone: '+256 766 630 248',
  phoneHref: '+256766630248',
  website: 'www.moa.co.ug',
  websiteUrl: 'https://www.moa.co.ug',
  address: 'Level 3 Rm HC3 Honora Plaza, Opposite Be Energy Fuels, Zzana, Kampala',
  mapEmbedUrl:
    'https://www.google.com/maps?q=Honora%20Plaza%2C%20Zzana%2C%20Kampala%2C%20Uganda&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Honora%20Plaza%2C%20Zzana%2C%20Kampala%2C%20Uganda',
  email: 'info@moa.co.ug',
  mission:
    'To help organizations operate lean, adopt modern digital technology, and stay agile by delivering reliable, end-to-end outsourcing across human capital, technology, brand, call support, multimedia, and community skills development.',
  vision:
    'To become a globally trusted BPO and corporate growth partner, recognized for service excellence, operational transparency, and long-term, mutually beneficial client relationships.',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Programs', href: '/programs' },
  { label: 'Projects', href: '/projects' },
  { label: 'Clients', href: '/clients' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const SERVICES = [
  {
    slug: 'revops-sales',
    title: 'Revenue Operations & Outsourced Sales',
    shortTitle: 'Revenue Operations',
    short: 'Performance-driven pipeline buildout, sales execution, and revenue reconciliation.',
    description:
      'Mariz RevOps builds, optimizes, and executes end-to-end sales pipelines for growing businesses. We align CRM architecture, lead data, closing specialists, contract administration, and financial reconciliation into one measurable revenue engine.',
    icon: 'TrendingUp',
    image: '/services/revenue-operations.jpeg',
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
    shortTitle: 'Recruitment',
    short: 'Executive search, passive talent sourcing, assessment, and onboarding.',
    description:
      'Mariz Strategic Recruitment & Talent Acquisition provides specialized headhunting, executive search, and workforce scaling. We map markets, engage passive talent, verify capability, and support onboarding so clients can hire for both performance and long-term fit.',
    icon: 'Users',
    image: '/services/strategic-recruitment.jpeg',
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
    slug: 'call-support-audio',
    title: 'Call Support & Audio Services',
    shortTitle: 'Call Support & Audio',
    short: '24/7 inbound support, outbound campaigns, branded CRBT, and IVR voice production.',
    description:
      'The Call Support & Audio Services division runs always-on communication infrastructure across voice, email, web chat, WhatsApp, and social channels. Tiered helpdesk support and outbound campaigns sit alongside branded Corporate Ring Back Tunes (CRBT) and professional IVR, prompt, and multimedia voice production.',
    icon: 'Headset',
    image: '/services/call-center.jpeg',
    objective: '24/7 inbound support, outbound call operations, and branded audio',
    targetMetric: 'First-contact resolution, SLA performance, customer satisfaction',
    targetAudience: 'E-commerce, telecom, logistics, hospitality, and service businesses',
    workflow: [
      'Unified omnichannel intake',
      'Tier 1 triage through Tier 3 technical escalation',
      'Predictive outbound dialing and lead nurturing',
      'Dormant account reactivation and satisfaction audits',
      'Corporate Ring Back Tunes (CRBT) and professional IVR voice recording',
      '100% call recording, QA reviews, and secure, compliant infrastructure',
    ],
    features: [
      '24/7/365 inbound and outbound call support',
      'Voice, email, web, chat, WhatsApp, and social media support',
      'Tier 1 to Tier 3 technical helpdesk models',
      'Scalable teams from 5 agents to 200+ seat operations',
      'Predictive dialing and lead-scored outbound campaigns',
      'Reactivation, cross-selling, and upselling workflows',
      'Corporate Ring Back Tunes (CRBT) with branded caller messages',
      'Professional voice overs and IVR menu recording',
      'AI-supported sentiment analysis and agent calibration',
      'Compliance-ready recording, reporting, and data security',
    ],
  },
  {
    slug: 'software',
    title: 'Software Development & IT Solutions',
    shortTitle: 'Software Development',
    short: 'Custom enterprise apps, automation, cloud infrastructure, and IT support.',
    description:
      'Mariz builds secure web applications, mobile platforms, enterprise software, and automation systems that remove manual bottlenecks. We centralize disconnected databases into cloud-ready operational platforms built around each client workflow.',
    icon: 'Code2',
    image: '/services/software-development.jpeg',
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
      'Custom websites, portals, and e-commerce platforms built for conversion',
      'Bespoke enterprise software and web applications',
      'ERP modules for HR, operations, inventory, and finance',
      'Multi-store POS with real-time stock monitoring and digital receipts',
      'Cross-platform mobile application development for iOS and Android',
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
    shortTitle: 'Branding',
    short: 'Brand strategy, visual identity systems, collateral, and reputation assets.',
    description:
      'The Strategic Branding & Corporate Identity division develops unified visual and narrative systems for organizations that need credibility across every client-facing touchpoint, from market positioning to brand guidelines, pitch collateral, and digital storefront assets.',
    icon: 'Palette',
    image: '/services/branding.jpeg',
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
      'Company profiles and investor pitch decks',
      'Digital storefront branding and social media asset packages',
      'Large-format printing: teardrop and pull-up banners, billboards, and trade show displays',
      'Corporate merchandise: calendars, flyers, business cards, brochures, uniforms, and gifts',
      'Reputation tracking with automated sentiment analysis',
    ],
  },
  {
    slug: 'media',
    title: 'Professional Photography & Cinematic Videography',
    shortTitle: 'Media Production',
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
      'Commercial video adverts and 2D/3D motion graphics',
      'Product photography and commercial stills with professional retouching',
      'Customer success video case studies',
      'Professional editing, color grading, sound design, and audio post',
      'Corporate podcast and video series support',
      'Long-form footage repurposed into social and web micro-content',
    ],
  },
  {
    slug: 'business-consultancy',
    title: 'Business Consultancy & Advisory',
    shortTitle: 'Business Consultancy',
    short: 'Process audits, governance, feasibility studies, and HR & payroll advisory.',
    description:
      'Mariz Business Consultancy & Advisory helps leadership teams make confident decisions. We map internal workflows, remove operational redundancies, structure governance and internal controls, test feasibility, and advise on HR and payroll so growth is planned rather than improvised.',
    icon: 'Briefcase',
    image: '/services/business-consultancy.jpg',
    objective: 'Actionable insight and structural frameworks for growth and compliance',
    targetMetric: 'Productivity gains, cost reduction, audit-ready governance',
    targetAudience: 'Growing SMEs, corporate boards, family businesses, and expansion-stage firms',
    workflow: [
      'Discovery interviews and operational diagnostics',
      'Workflow mapping and redundancy elimination',
      'Governance, policy, and internal control design',
      'Feasibility studies, risk assessment, and market analysis',
      'Growth strategy and diversification roadmaps',
      'HR, payroll, and compliance advisory',
    ],
    features: [
      'Business process optimization and operational audits',
      'Corporate governance and compliance advisory',
      'Policy guidelines and internal control frameworks',
      'Feasibility studies and growth strategy',
      'Market analysis and operational expansion roadmaps',
      'HR and payroll advisory',
      'Labor law and employment contract guidance',
      'Performance management metrics and outsourced payroll infrastructure',
    ],
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing & SEO',
    shortTitle: 'Digital Marketing',
    short: 'Technical SEO, social media management, paid ads, and content strategy.',
    description:
      'Mariz Digital Marketing builds brand visibility and drives qualified leads through performance-driven campaigns and organic search strategy. From technical SEO and localized keyword work to platform-native social media management, paid media, and content strategy, every channel is measured against qualified enquiries.',
    icon: 'Globe',
    image: '/services/digital-marketing.jpg',
    objective: 'Brand visibility and qualified lead generation',
    targetMetric: 'Organic traffic, engagement, cost per lead, qualified enquiries',
    targetAudience: 'B2B teams, consumer brands, and businesses scaling their digital presence',
    workflow: [
      'Technical SEO audit and keyword mapping',
      'Content calendar and channel strategy',
      'Social media management and community engagement',
      'Paid campaign setup across Google, Meta, and LinkedIn',
      'Copywriting, creative production, and conversion tracking',
      'Monthly performance reporting and optimization',
    ],
    features: [
      'Technical SEO audits and on-page optimization',
      'Keyword research and localized SEO strategy',
      'Link-building and search authority development',
      'Social media management across LinkedIn, Facebook, Instagram, X, and TikTok',
      'Content calendars, audience engagement, and community building',
      'Pay-per-click and paid social campaign strategy',
      'Ad copywriting, creative design, and conversion tracking',
      'Corporate content strategy and brand storytelling',
    ],
  },
  {
    slug: 'sales-outsourcing',
    title: 'Sales & Marketing Outsourcing',
    shortTitle: 'Sales & Marketing',
    short: 'Dedicated sales teams, B2B lead generation, research, and brand activations.',
    description:
      'Mariz Sales & Marketing Outsourcing extends your commercial reach without adding fixed headcount. We deploy trained sales professionals, run structured B2B outreach, produce market and competitor intelligence, and execute awareness campaigns and on-ground brand activations.',
    icon: 'Target',
    image: '/services/sales-outsourcing.jpg',
    objective: 'Extend commercial reach with dedicated, trained sales capacity',
    targetMetric: 'Qualified leads, meetings booked, revenue growth, market coverage',
    targetAudience: 'B2B firms, product launches, FMCG brands, and teams entering new markets',
    workflow: [
      'Market research and competitor intelligence',
      'Target account and territory mapping',
      'Deployment of trained telesales and field agents',
      'Multi-channel outbound outreach',
      'Product launches, roadshows, and brand activations',
      'Pipeline reporting and sales performance reviews',
    ],
    features: [
      'Market research and competitive intelligence',
      'Consumer behavior, pricing, and target market analysis',
      'Dedicated outsourced telesales agents',
      'B2B lead generation and appointment setting',
      'Business development executives and door-to-door sales teams',
      'Multi-channel awareness and promotional campaigns',
      'Product launch strategies and public relations rollouts',
      'Product sampling, roadshows, and experiential brand activations',
    ],
  },
];

export const PROGRAMS = [
  {
    slug: 'community-skilling',
    title: 'Community Skilling',
    shortTitle: 'Community Skilling',
    short: 'Six weeks of practical digital, creative, and sales training through the Mariz Talent Clinic.',
    description:
      'Community Skilling is delivered through the Mariz Talent Clinic, equipping youth and professionals with practical, market-ready skills. The six-week programme covers digital tools, creative production, and sales, with free training and a registration fee of UGX 100,000. Choose a Digital, Creative, or Sales clinic and contact our team for the next intake and available places.',
    icon: 'Users',
    image: '/services/mariz-talent-clinic.jpeg',
    objective: 'Community empowerment and market-ready workforce skills',
    targetMetric: 'Practical digital, creative, and sales skills',
    targetAudience: 'Youth, job seekers, professionals, and students looking for practical skills during the holidays',
    clinics: [
      {
        title: 'Digital Clinic',
        description:
          'Computer literacy, Microsoft Office and enterprise software suites, front-office management, customer reception, and professional administrative support.',
      },
      {
        title: 'Creative Clinic',
        description:
          'Graphic design fundamentals, Adobe Creative Suite, camera operations, studio lighting, and post-production editing.',
      },
      {
        title: 'Sales Clinic',
        description:
          'Direct selling, high-converting call scripts, lead management, negotiation tactics, and affiliate marketing strategies.',
      },
    ],
    workflow: [
      'Contact the Programs team to confirm the next intake and available places',
      'Choose the Digital, Creative, or Sales clinic',
      'Register for the six-week training programme; registration fee: UGX 100,000',
      'Attend practical training at Level 3 Rm HC3 Honora Plaza, Opposite Be Energy Fuels, Zzana, Kampala',
    ],
    features: [
      'Digital Clinic: computer skills, Microsoft Suite, and front office training',
      'Creative Clinic: graphics, photography, videography, and branding',
      'Sales Clinic: telesales and affiliate marketing',
      'Six-week programme with free training',
      'Registration fee: UGX 100,000',
      'Limited intake; contact us for current availability',
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
      'Mariz transformed our customer support operations. Their 24/7 team handles our entire inbound flow with a 95% first-call resolution rate — we have not looked back.',
    author: 'Director of Operations',
    company: 'Regional Hospitality Group',
  },
  {
    quote:
      'The custom ERP Mariz built replaced three disconnected systems. Our inventory reconciliation that used to take a week now runs in real time.',
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
    category: 'Call Support',
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
    title: 'Call Support Agent — Night Shift',
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
  ...SERVICES.map((service) => service.title),
  ...PROGRAMS.map((program) => program.title),
  'General Inquiry',
];
