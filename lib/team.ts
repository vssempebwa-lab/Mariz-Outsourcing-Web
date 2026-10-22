export type TeamDepartment = 'Leadership' | 'Human Resource' | 'Finance & Accounts';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: TeamDepartment;
  photo: string;
  socials?: {
    linkedin?: string;
    website?: string;
    email?: string;
  };
};

const linkedinUrl = 'https://www.linkedin.com/in/marvin-paul-muwereza-0332b4382/';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'ssempebwa-viccent',
    name: 'Ssempebwa Vicent',
    role: 'Managing Director',
    department: 'Leadership',
    photo: '/team/ssempebwa-viccent.jpg',
    socials: { linkedin: 'https://www.linkedin.com/in/ssempebwa-vicent-b06094262/' },
  },
  {
    id: 'ssekyanzi-joel',
    name: 'Ssekyanzi Joel',
    role: 'Human Resource / Software Developer',
    department: 'Human Resource',
    photo: '/team/ssekyanzi-joel.jpg',
    socials: { linkedin: 'https://www.linkedin.com/in/joel-ssekyanzi-b23184240/' },
  },
  {
    id: 'muwerza-marvin-paul',
    name: 'Muwerza Marvin Paul',
    role: 'Finance / Account Executive / Website Developer',
    department: 'Finance & Accounts',
    photo: '/team/muwerza-marvin-paul.jpg',
    socials: { linkedin: linkedinUrl },
  },
];
