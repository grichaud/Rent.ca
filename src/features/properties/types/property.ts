import type {
  Property,
  Unit,
  PropertyImage,
  Amenity,
  RentSpecial,
  PropertyType,
  ListingTier,
} from '@/shared/types/database'

// Re-export so consuming components can import these types from a single place
export type { PropertyType, ListingTier }

/** Full property with all relations loaded — used on detail pages */
export interface PropertyWithDetails extends Property {
  units: Unit[]
  images: PropertyImage[]
  amenities: Amenity[]
  // is_verified is inherited from Property directly
  landlord?: {
    full_name: string | null
    avatar_url: string | null
    company_name?: string | null
    is_verified?: boolean
  }
  rent_special?: Pick<RentSpecial, 'title' | 'description' | 'start_date' | 'end_date'> | null
}

/** Lightweight property card shape — used in search result lists */
export interface PropertyCardData {
  id: string
  title: string
  slug: string
  city: string
  province: string
  neighbourhood: string | null
  property_type: PropertyType
  tier: ListingTier
  is_verified: boolean
  pets_allowed: boolean
  furnished: boolean
  lat: number | null
  lng: number | null
  primary_image_url: string | null
  min_price: number
  max_price: number | null
  min_bedrooms: number
  max_bedrooms: number
  min_bathrooms: number
  available_units: number
  has_special: boolean
}
