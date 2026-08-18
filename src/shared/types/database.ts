/** Database enums */
export type PropertyType =
  | 'apartment'
  | 'condo'
  | 'house'
  | 'townhouse'
  | 'basement'
  | 'studio'
  | 'loft'
  | 'duplex'
  | 'other'

export type ListingStatus = 'draft' | 'active' | 'inactive' | 'archived'

export type ListingTier = 'limited' | 'promoted' | 'featured'

export type UserRole = 'renter' | 'landlord' | 'admin'

export type LeaseTerm =
  | 'month-to-month'
  | '6-months'
  | '1-year'
  | '2-years'
  | 'flexible'

/** profiles table — synced from auth.users via trigger */
export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: Date
  updated_at: Date
}

/** landlord_profiles table */
export interface LandlordProfile {
  id: string
  company_name: string | null
  logo_url: string | null
  website: string | null
  description: string | null
  is_verified: boolean
  tier: ListingTier
  total_listings: number
}

/** properties table */
export interface Property {
  id: string
  landlord_id: string
  title: string
  description: string | null
  property_type: PropertyType
  status: ListingStatus
  tier: ListingTier
  street_address: string
  city: string
  province: string
  postal_code: string
  neighbourhood: string | null
  lat: number | null
  lng: number | null
  year_built: number | null
  total_floors: number | null
  total_units: number | null
  parking_type: string | null
  pets_allowed: boolean
  furnished: boolean
  lease_term: LeaseTerm | null
  slug: string
  is_verified: boolean
  view_count: number
  lead_count: number
  created_at: Date
  updated_at: Date
}

/** units table */
export interface Unit {
  id: string
  property_id: string
  name: string | null
  bedrooms: number
  bathrooms: number
  sqft: number | null
  price: number
  price_max: number | null
  available_units: number
  available_date: Date | null
  created_at: Date
  updated_at: Date
}

/** property_images table */
export interface PropertyImage {
  id: string
  property_id: string
  url: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
  category: string | null
  created_at: Date
}

/** amenities table (linked via property_amenities junction) */
export interface Amenity {
  id: string
  name: string
  category: string | null
  icon: string | null
}

/** favorites table */
export interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at: Date
}

/** alerts table */
export interface Alert {
  id: string
  user_id: string
  name: string | null
  city: string | null
  property_type: PropertyType | null
  price_min: number | null
  price_max: number | null
  bedrooms_min: number | null
  bathrooms_min: number | null
  pets_allowed: boolean | null
  frequency: string
  is_active: boolean
  last_sent_at: string | null
  created_at: string
  updated_at: string
}

/** contact_inquiries table */
export interface ContactInquiry {
  id: string
  property_id: string
  sender_id: string | null
  sender_name: string
  sender_email: string
  sender_phone: string | null
  message: string
  move_in_date: string | null
  is_read: boolean
  created_at: string
}

/** rent_specials table */
export interface RentSpecial {
  id: string
  property_id: string
  title: string
  description: string | null
  start_date: Date | null
  end_date: Date | null
  is_active: boolean
  created_at: Date
}

/** cities table */
export interface City {
  id: string
  name: string
  province: string
  slug: string
  image_url: string | null
  listing_count: number
  is_featured: boolean
  latitude: number | null
  longitude: number | null
}

/** popular_searches table */
export interface PopularSearch {
  id: string
  query: string
  city: string | null
  search_count: number
  updated_at: Date
}

/** ai_conversations table */
export interface AIConversation {
  id: string
  user_id: string | null
  session_id: string
  messages: AIMessage[]
  city: string | null
  filters_applied: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
}

/** Embedded message shape inside AIConversation.messages */
export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}
