export type RecordStatus = 'sample' | 'verified';

export type Artwork = {
  slug: string;
  title: string;
  artistSlug: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  category?: string;
  image: string;
  status: RecordStatus;
  price?: { amount: number; status: RecordStatus };
  availability?: string;
  edition?: string;
};

export type Artist = {
  slug: string;
  name: string;
  status: RecordStatus;
  artistApprovedBiography?: string;
  artistApprovedStatement?: string;
};

export const artists: Artist[] = [
  { slug: 'mara-ellison', name: 'Mara Ellison', status: 'sample' },
  { slug: 'noor-bennett', name: 'Noor Bennett', status: 'sample' },
  { slug: 'elias-rowan', name: 'Elias Rowan', status: 'sample' },
  { slug: 'inez-calder', name: 'Inez Calder', status: 'sample' },
];

export const artworks: Artwork[] = [
  {
    slug: 'quiet-weather',
    title: 'A Kind of Weather',
    artistSlug: 'mara-ellison',
    year: '2024',
    medium: 'Oil and graphite on linen',
    dimensions: '76 × 102 cm',
    category: 'Painting',
    image: '/artwork/quiet-weather.jpg',
    status: 'sample',
    price: { amount: 1850, status: 'sample' },
  },
  {
    slug: 'soft-terrain',
    title: 'Soft Terrain',
    artistSlug: 'noor-bennett',
    year: '2023',
    medium: 'Pigment and paper collage',
    dimensions: '64 × 84 cm',
    category: 'Mixed media',
    image: '/artwork/soft-terrain.jpg',
    status: 'sample',
    price: { amount: 1250, status: 'sample' },
  },
  {
    slug: 'blue-hour',
    title: 'Blue, Before Evening',
    artistSlug: 'elias-rowan',
    year: '2024',
    medium: 'Oil on canvas',
    dimensions: '81 × 100 cm',
    category: 'Painting',
    image: '/artwork/blue-hour.jpg',
    status: 'sample',
    price: { amount: 2100, status: 'sample' },
  },
  {
    slug: 'held-light',
    title: 'The Light We Keep',
    artistSlug: 'inez-calder',
    year: '2022',
    medium: 'Oil and wax on canvas',
    dimensions: '70 × 92 cm',
    category: 'Painting',
    image: '/artwork/held-light.jpg',
    status: 'sample',
    price: { amount: 1750, status: 'sample' },
  },
];

export function getArtistBySlug(slug: string) {
  return artists.find((artist) => artist.slug === slug);
}

export function getArtworkBySlug(slug: string) {
  return artworks.find((artwork) => artwork.slug === slug);
}

export function getArtworksByArtist(slug: string) {
  return artworks.filter((artwork) => artwork.artistSlug === slug);
}

export function getArtistName(slug: string) {
  return getArtistBySlug(slug)?.name ?? 'Artist details not supplied';
}
