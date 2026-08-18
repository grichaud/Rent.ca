/** Popular Canadian cities for Rent.ca */
export interface City {
  name: string;
  province: string;
  provinceCode: string;
  slug: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}

export const POPULAR_CITIES: City[] = [
  { name: 'Toronto', province: 'Ontario', provinceCode: 'ON', slug: 'toronto', lat: 43.6532, lng: -79.3832, imageUrl: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=300&h=300&fit=crop' },
  { name: 'Vancouver', province: 'British Columbia', provinceCode: 'BC', slug: 'vancouver', lat: 49.2827, lng: -123.1207, imageUrl: 'https://images.unsplash.com/photo-1609825488888-3a766db05542?w=300&h=300&fit=crop' },
  { name: 'Montreal', province: 'Quebec', provinceCode: 'QC', slug: 'montreal', lat: 45.5017, lng: -73.5673, imageUrl: 'https://images.unsplash.com/photo-1519178614-68673b201f36?w=300&h=300&fit=crop' },
  { name: 'Calgary', province: 'Alberta', provinceCode: 'AB', slug: 'calgary', lat: 51.0447, lng: -114.0719, imageUrl: 'https://images.unsplash.com/photo-1680488736383-6e890a804b50?w=300&h=300&fit=crop' },
  { name: 'Edmonton', province: 'Alberta', provinceCode: 'AB', slug: 'edmonton', lat: 53.5461, lng: -113.4938, imageUrl: 'https://images.unsplash.com/photo-1641186539288-9c3f26725b12?w=300&h=300&fit=crop' },
  { name: 'Ottawa', province: 'Ontario', provinceCode: 'ON', slug: 'ottawa', lat: 45.4215, lng: -75.6972, imageUrl: 'https://images.unsplash.com/photo-1720050238968-0f591061438d?w=300&h=300&fit=crop' },
  { name: 'Winnipeg', province: 'Manitoba', provinceCode: 'MB', slug: 'winnipeg', lat: 49.8951, lng: -97.1384, imageUrl: 'https://images.unsplash.com/photo-1579454554937-235af69990bf?w=300&h=300&fit=crop' },
  { name: 'Quebec City', province: 'Quebec', provinceCode: 'QC', slug: 'quebec-city', lat: 46.8139, lng: -71.2080, imageUrl: 'https://images.unsplash.com/photo-1764911866769-bc27bb312c6f?w=300&h=300&fit=crop' },
  { name: 'Hamilton', province: 'Ontario', provinceCode: 'ON', slug: 'hamilton', lat: 43.2557, lng: -79.8711, imageUrl: 'https://images.unsplash.com/photo-1598473801496-5b0e74340936?w=300&h=300&fit=crop' },
  { name: 'Saskatoon', province: 'Saskatchewan', provinceCode: 'SK', slug: 'saskatoon', lat: 52.1332, lng: -106.6700, imageUrl: 'https://images.unsplash.com/photo-1484949909760-d37c642ad869?w=300&h=300&fit=crop' },
  { name: 'London', province: 'Ontario', provinceCode: 'ON', slug: 'london', lat: 42.9849, lng: -81.2453, imageUrl: 'https://images.unsplash.com/photo-1615288283030-0e966c5688c2?w=300&h=300&fit=crop' },
  { name: 'Halifax', province: 'Nova Scotia', provinceCode: 'NS', slug: 'halifax', lat: 44.6488, lng: -63.5752, imageUrl: 'https://images.unsplash.com/photo-1570902128092-950ebe50a3da?w=300&h=300&fit=crop' },
];

/** All Canadian provinces */
export const PROVINCES = [
  { name: 'Alberta', code: 'AB' },
  { name: 'British Columbia', code: 'BC' },
  { name: 'Manitoba', code: 'MB' },
  { name: 'New Brunswick', code: 'NB' },
  { name: 'Newfoundland and Labrador', code: 'NL' },
  { name: 'Nova Scotia', code: 'NS' },
  { name: 'Ontario', code: 'ON' },
  { name: 'Prince Edward Island', code: 'PE' },
  { name: 'Quebec', code: 'QC' },
  { name: 'Saskatchewan', code: 'SK' },
] as const;
