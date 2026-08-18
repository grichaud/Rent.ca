import { createClient } from '@/lib/supabase/server'
import type { Property } from '@/shared/types/database'
import type { PropertyCardData, PropertyWithDetails } from '@/features/properties/types/property'
import type { SearchParams } from '@/features/search/types/search'

// ---------------------------------------------------------------------------
// Internal helpers (duplicated from property-service.ts for server context)
// ---------------------------------------------------------------------------

interface RawPropertyRow {
  id: string
  landlord_id: string
  title: string
  slug: string
  description: string | null
  property_type: string
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
  lease_term: string | null
  status: string
  tier: string
  is_verified: boolean
  view_count: number
  lead_count: number
  created_at: string
  updated_at: string
  units: RawUnit[]
  property_images: RawImage[]
  rent_specials: RawSpecial[]
}

interface RawUnit {
  id: string
  property_id: string
  name: string | null
  bedrooms: number
  bathrooms: number
  sqft: number | null
  price: number
  price_max: number | null
  available_units: number
  available_date: string | null
  created_at: string
  updated_at: string
}

interface RawImage {
  id: string
  property_id: string
  url: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
  category: string | null
  created_at: string
}

interface RawSpecial {
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
}

function toCardData(row: RawPropertyRow): PropertyCardData {
  const activeUnits = row.units.filter((u) => u.available_units > 0)
  const prices = row.units.map((u) => u.price)
  const bedrooms = row.units.map((u) => u.bedrooms)
  const bathrooms = row.units.map((u) => u.bathrooms)

  const primaryImage =
    row.property_images.find((img) => img.is_primary) ??
    row.property_images.sort((a, b) => a.display_order - b.display_order)[0] ??
    null

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    city: row.city,
    province: row.province,
    neighbourhood: row.neighbourhood,
    property_type: row.property_type as PropertyCardData['property_type'],
    tier: row.tier as PropertyCardData['tier'],
    is_verified: row.is_verified,
    pets_allowed: row.pets_allowed,
    furnished: row.furnished,
    lat: row.lat,
    lng: row.lng,
    primary_image_url: primaryImage?.url ?? null,
    min_price: prices.length > 0 ? Math.min(...prices) : 0,
    max_price: prices.length > 1 ? Math.max(...prices) : null,
    min_bedrooms: bedrooms.length > 0 ? Math.min(...bedrooms) : 0,
    max_bedrooms: bedrooms.length > 0 ? Math.max(...bedrooms) : 0,
    min_bathrooms: bathrooms.length > 0 ? Math.min(...bathrooms) : 0,
    available_units: activeUnits.length,
    has_special: row.rent_specials.length > 0,
  }
}

// ---------------------------------------------------------------------------
// Public API — Server-only versions (use createServerClient)
// ---------------------------------------------------------------------------

const DEFAULT_LIMIT = 20

export async function getProperties(
  params: SearchParams
): Promise<{ items: PropertyCardData[]; total: number }> {
  try {
    const supabase = await createClient()
    const page = Math.max(1, params.page ?? 1)
    const limit = Math.min(100, Math.max(1, params.limit ?? DEFAULT_LIMIT))
    const offset = (page - 1) * limit

    let query = supabase
      .from('properties')
      .select(
        `
        *,
        units(id, property_id, name, bedrooms, bathrooms, sqft, price, price_max, available_units, available_date, created_at, updated_at),
        property_images(id, property_id, url, alt_text, is_primary, display_order, category, created_at),
        rent_specials!left(title, description, start_date, end_date)
        `,
        { count: 'exact' }
      )
      .eq('status', 'active')

    if (params.city) {
      query = query.ilike('city', `%${params.city}%`)
    }

    if (params.propertyType && params.propertyType.length > 0) {
      query = query.in('property_type', params.propertyType)
    }

    if (params.petsAllowed === true) {
      query = query.eq('pets_allowed', true)
    }

    if (params.furnished === true) {
      query = query.eq('furnished', true)
    }

    if (params.hasParking === true) {
      query = query.not('parking_type', 'is', null)
    }

    if (params.keyword) {
      query = query.or(
        `title.ilike.%${params.keyword}%,description.ilike.%${params.keyword}%,street_address.ilike.%${params.keyword}%`
      )
    }

    switch (params.sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'popular':
        query = query.order('view_count', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('[property-service.server] getProperties error:', error.message)
      return { items: [], total: 0 }
    }

    let cards = (data as RawPropertyRow[]).map(toCardData)

    if (params.priceMin !== undefined) {
      cards = cards.filter((c) => c.min_price >= (params.priceMin as number))
    }

    if (params.priceMax !== undefined) {
      cards = cards.filter((c) => c.min_price <= (params.priceMax as number))
    }

    if (params.bedroomsMin !== undefined) {
      cards = cards.filter((c) => c.max_bedrooms >= (params.bedroomsMin as number))
    }

    if (params.bedroomsMax !== undefined) {
      cards = cards.filter((c) => c.min_bedrooms <= (params.bedroomsMax as number))
    }

    if (params.bathroomsMin !== undefined) {
      cards = cards.filter((c) => c.min_bathrooms >= (params.bathroomsMin as number))
    }

    if (params.sort === 'price_asc') {
      cards.sort((a, b) => a.min_price - b.min_price)
    } else if (params.sort === 'price_desc') {
      cards.sort((a, b) => b.min_price - a.min_price)
    }

    return { items: cards, total: count ?? 0 }
  } catch (err) {
    console.error('[property-service.server] getProperties unexpected error:', err)
    return { items: [], total: 0 }
  }
}

export async function getPropertyBySlug(slug: string): Promise<PropertyWithDetails | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select(
        `
        *,
        units(*),
        property_images(*),
        rent_specials(title, description, start_date, end_date)
        `
      )
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      if (error?.code !== 'PGRST116') {
        console.error('[property-service.server] getPropertyBySlug error:', error?.message)
      }
      return null
    }

    return await hydratePropertyWithAmenities(data)
  } catch (err) {
    console.error('[property-service.server] getPropertyBySlug unexpected error:', err)
    return null
  }
}

export async function getSimilarProperties(
  property: Property,
  limit = 6
): Promise<PropertyCardData[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('properties')
      .select(
        `
        *,
        units(id, property_id, name, bedrooms, bathrooms, sqft, price, price_max, available_units, available_date, created_at, updated_at),
        property_images(id, property_id, url, alt_text, is_primary, display_order, category, created_at),
        rent_specials!left(title, description, start_date, end_date)
        `
      )
      .eq('status', 'active')
      .eq('city', property.city)
      .eq('property_type', property.property_type)
      .neq('id', property.id)
      .limit(limit)

    if (error) {
      console.error('[property-service.server] getSimilarProperties error:', error.message)
      return []
    }

    return (data as RawPropertyRow[]).map(toCardData)
  } catch (err) {
    console.error('[property-service.server] getSimilarProperties unexpected error:', err)
    return []
  }
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

async function hydratePropertyWithAmenities(
  raw: Record<string, unknown>
): Promise<PropertyWithDetails> {
  const supabase = await createClient()

  const { data: propertyAmenities } = await supabase
    .from('property_amenities')
    .select('amenities(id, name, category, icon)')
    .eq('property_id', raw.id as string)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const amenities = propertyAmenities?.map((pa: any) => pa.amenities).filter(Boolean) ?? []

  const rentSpecials = raw.rent_specials as {
    title: string
    description: string | null
    start_date: string | null
    end_date: string | null
  }[] | null

  const {
    units,
    property_images,
    rent_specials: _rentSpecials,
    ...baseProperty
  } = raw

  return {
    ...(baseProperty as unknown as Property),
    units: (units as PropertyWithDetails['units']) ?? [],
    images: (property_images as PropertyWithDetails['images']) ?? [],
    amenities: (amenities as PropertyWithDetails['amenities']) ?? [],
    landlord: undefined,
    rent_special:
      rentSpecials && rentSpecials.length > 0
        ? {
            title: rentSpecials[0].title,
            description: rentSpecials[0].description,
            start_date: rentSpecials[0].start_date ? new Date(rentSpecials[0].start_date) : null,
            end_date: rentSpecials[0].end_date ? new Date(rentSpecials[0].end_date) : null,
          }
        : null,
  }
}
