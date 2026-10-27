export type ClientLogo = {
  name: string;
  logo: string;
  /** Fill sampled from the logo artwork so the mark sits on its own background. */
  cardBg: string;
  darkArtwork?: boolean;
};

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'TUURI', logo: '/clients/tuuri.svg', cardBg: '#ffffff' },
  { name: 'Passito Marketing Agency', logo: '/clients/passito.svg', cardBg: '#ffffff' },
  {
    name: 'Rakentaa Travel & Logistics',
    logo: '/clients/rakentaa-travel.svg',
    cardBg: '#16254b',
    darkArtwork: true,
  },
  { name: 'SCGE', logo: '/clients/scge.svg', cardBg: '#ffffff' },
  {
    name: 'Shop For Me UG',
    logo: '/clients/shop-for-me.svg',
    cardBg: '#16254b',
    darkArtwork: true,
  },
  {
    name: 'Resan General Enterprise',
    logo: '/clients/resan-general-enterprise.webp',
    cardBg: '#ffffff',
  },
  { name: 'Tales of Travel Agency', logo: '/clients/tales-of-travel.webp', cardBg: '#ffffff' },
  { name: 'Zortea', logo: '/clients/zortea.webp', cardBg: '#16244a', darkArtwork: true },
];
