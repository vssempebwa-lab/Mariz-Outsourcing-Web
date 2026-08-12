export type TeamDepartment =
  | 'Leadership'
  | 'Revenue Operations'
  | 'Talent Acquisition'
  | 'Call Center Operations'
  | 'Software Development'
  | 'Branding & Media';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: TeamDepartment;
  photo: string;
  bio: string;
  socials?: {
    linkedin?: string;
    website?: string;
    email?: string;
  };
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'mariz-nakato',
    name: 'Mariz Nakato',
    role: 'Managing Director',
    department: 'Leadership',
    photo:
      'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&h=650&w=650',
    bio: 'Leads agency strategy, client partnerships, and cross-division delivery standards for enterprise outsourcing engagements.',
    socials: {
      linkedin: 'https://www.linkedin.com/',
    },
  },
  {
    id: 'daniel-kato',
    name: 'Daniel Kato',
    role: 'Head of Revenue Operations',
    department: 'Revenue Operations',
    photo:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&h=650&w=650',
    bio: 'Designs sales pipelines, CRM workflows, dealmaker deployment models, and revenue reporting systems for growth clients.',
    socials: {
      linkedin: 'https://www.linkedin.com/',
    },
  },
  {
    id: 'aisha-mugisha',
    name: 'Aisha Mugisha',
    role: 'Talent Acquisition Lead',
    department: 'Talent Acquisition',
    photo:
      'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&h=650&w=650',
    bio: 'Manages executive search, candidate assessment frameworks, ATS pipelines, and structured onboarding programs.',
    socials: {
      linkedin: 'https://www.linkedin.com/',
    },
  },
  {
    id: 'isaac-omara',
    name: 'Isaac Omara',
    role: 'Call Center Operations Manager',
    department: 'Call Center Operations',
    photo:
      'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg?auto=compress&cs=tinysrgb&h=650&w=650',
    bio: 'Oversees omnichannel support programs, QA calibration, outbound campaigns, and SLA performance across agent teams.',
  },
  {
    id: 'grace-atim',
    name: 'Grace Atim',
    role: 'Software Delivery Lead',
    department: 'Software Development',
    photo:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&h=650&w=650',
    bio: 'Coordinates custom web platforms, business automation systems, integrations, and cloud-ready operational dashboards.',
    socials: {
      website: 'https://www.moa.co.ug',
    },
  },
  {
    id: 'kevin-sserwadda',
    name: 'Kevin Sserwadda',
    role: 'Brand & Media Producer',
    department: 'Branding & Media',
    photo:
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&h=650&w=650',
    bio: 'Leads brand identity systems, corporate collateral, production planning, post-production, and campaign-ready visual assets.',
  },
];
