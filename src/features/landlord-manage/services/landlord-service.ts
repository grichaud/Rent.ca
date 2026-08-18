import { createClient } from '@/lib/supabase/client'
import type { ListingStatus } from '@/shared/types/database'
import type { BasicInfoData } from '@/features/landlord-manage/components/listing-form/basic-info-step'
import type { UnitData } from '@/features/landlord-manage/components/listing-form/units-step'
import type { AmenityId } from '@/features/landlord-manage/components/listing-form/amenities-step'

/** Maps form short IDs → DB amenity UUIDs */
const AMENITY_ID_MAP: Record<string, string> = {
  gym: 'e692bc06-60b5-443d-9185-b578f4d918f7',
  pool: '105600c8-b096-4d36-8da4-ca9e6054b792',
  rooftop: 'a3ff6e7c-55c7-4fdb-b72c-603496f29d73',
  concierge: 'cd82745a-44a4-49d9-bb41-1d26ad63b1a4',
  bike_storage: '4168f12c-5d39-4c78-8a27-f126fa0ad7ba',
  visitor_parking: 'c5e91eb8-12c5-4afb-85f3-a95fd786c24f',
  security: '2b7798b7-4484-49bb-9f1b-7db5edd8621a',
  dishwasher: 'dfa11a33-b30b-4442-9da1-222739ddebc8',
  laundry_unit: 'ad6e10ed-9d70-4343-afbb-13a2402cd712',
  balcony: '04eb621c-1b4e-47ff-a449-6260fe40565f',
  ac: 'f1877790-42c5-4db3-b187-38f39a7dfcbd',
  hardwood: '8c788911-1e19-4931-91ab-4d932a16ca78',
  walk_closet: '6062a1bb-a47c-4a5a-bc13-67f71428ab14',
  transit: '86aa5bc7-cd6b-45de-991e-693513f57c92',
  schools: '21faf0f4-4b95-4169-b452-a669b0b63f52',
  parks: 'd2842baf-e791-480a-a135-e04e0a6f9c3c',
  shopping: '6329dbb6-ad38-46df-a9af-70a1b756ee6f',
  restaurants: 'dae61b2d-8bd4-4f1f-8fef-0db19b12febc',
}

function generateSlug(title: string, city: string): string {
  const base = `${title}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return `${base}-${Math.random().toString(36).slice(2, 7)}`
}

export interface CreateListingInput {
  landlordId: string
  basicInfo: BasicInfoData
  units: UnitData[]
  amenityIds: string[]
  status: ListingStatus
}

/** Create a new property listing with units and amenities */
export async function createListing(
  input: CreateListingInput
): Promise<{ id: string | null; error: string | null }> {
  const supabase = createClient()
  const { landlordId, basicInfo, units, amenityIds, status } = input

  const propertyTypeMap: Record<string, string> = {
    apartment: 'apartment', condo: 'condo', house: 'house',
    townhouse: 'townhouse', basement: 'basement', studio: 'studio',
    loft: 'loft', duplex: 'duplex', other: 'other',
  }
  const leaseTermMap: Record<string, string> = {
    'month-to-month': 'month-to-month', '6-months': '6-months',
    '1-year': '1-year', '2-years': '2-years', flexible: 'flexible',
  }

  const { data: property, error: propError } = await supabase
    .from('properties')
    .insert({
      landlord_id: landlordId,
      title: basicInfo.title,
      description: basicInfo.description || null,
      property_type: propertyTypeMap[basicInfo.propertyType] ?? 'other',
      status,
      tier: 'limited',
      street_address: basicInfo.street,
      city: basicInfo.city,
      province: basicInfo.province || 'ON',
      postal_code: basicInfo.postalCode || '',
      neighbourhood: basicInfo.neighbourhood || null,
      parking_type: basicInfo.parkingType === 'None' ? null : basicInfo.parkingType,
      pets_allowed: basicInfo.isPetFriendly,
      furnished: basicInfo.isFurnished,
      lease_term: leaseTermMap[basicInfo.leaseTerm] ?? null,
      year_built: basicInfo.yearBuilt ? Number(basicInfo.yearBuilt) : null,
      total_floors: basicInfo.totalFloors ? Number(basicInfo.totalFloors) : null,
      slug: generateSlug(basicInfo.title, basicInfo.city),
      is_verified: false,
      view_count: 0,
      lead_count: 0,
    })
    .select('id')
    .single()

  if (propError || !property) {
    return { id: null, error: propError?.message ?? 'Failed to create property' }
  }

  // Insert units (price in cents)
  if (units.length > 0) {
    const unitRows = units.map((u) => ({
      property_id: property.id,
      name: u.name || null,
      bedrooms: Number(u.bedrooms) || 0,
      bathrooms: Number(u.bathrooms) || 1,
      sqft: u.squareFeet ? Number(u.squareFeet) : null,
      price: Math.round((Number(u.price) || 0) * 100),
      available_units: Number(u.availableUnits) || 1,
      available_date: u.availableDate || null,
    }))
    const { error: unitError } = await supabase.from('units').insert(unitRows)
    if (unitError) return { id: null, error: unitError.message }
  }

  // Insert amenities
  const validAmenityDbIds = amenityIds
    .map((id) => AMENITY_ID_MAP[id])
    .filter(Boolean)
  if (validAmenityDbIds.length > 0) {
    const amenityRows = validAmenityDbIds.map((amenityId) => ({
      property_id: property.id,
      amenity_id: amenityId,
    }))
    await supabase.from('property_amenities').insert(amenityRows)
  }

  return { id: property.id, error: null }
}

/** Reverse lookup: DB UUID → form short ID */
const AMENITY_UUID_TO_SHORT: Record<string, AmenityId> = Object.fromEntries(
  Object.entries(AMENITY_ID_MAP).map(([short, uuid]) => [uuid, short])
)

/** Fetch a listing with all relations and transform into form-ready shapes */
export async function getListingForEdit(propertyId: string): Promise<{
  basicInfo: BasicInfoData
  units: UnitData[]
  amenityIds: AmenityId[]
  status: ListingStatus
} | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('properties')
    .select(`*, units(*), property_amenities(amenity_id)`)
    .eq('id', propertyId)
    .single()

  if (error || !data) return null

  const basicInfo: BasicInfoData = {
    title: data.title ?? '',
    description: data.description ?? '',
    propertyType: data.property_type ?? '',
    street: data.street_address ?? '',
    city: data.city ?? '',
    province: data.province ?? '',
    postalCode: data.postal_code ?? '',
    neighbourhood: data.neighbourhood ?? '',
    leaseTerm: data.lease_term ?? '',
    isPetFriendly: data.pets_allowed ?? false,
    isFurnished: data.furnished ?? false,
    parkingType: data.parking_type ?? 'None',
    yearBuilt: data.year_built ? String(data.year_built) : '',
    totalFloors: data.total_floors ? String(data.total_floors) : '',
  }

  const rawUnits = (data.units ?? []) as {
    id: string; name: string | null; bedrooms: number; bathrooms: number;
    sqft: number | null; price: number; available_units: number; available_date: string | null
  }[]

  const units: UnitData[] = rawUnits.map((u) => ({
    id: u.id,
    name: u.name ?? '',
    bedrooms: String(u.bedrooms),
    bathrooms: String(u.bathrooms),
    squareFeet: u.sqft ? String(u.sqft) : '',
    price: String(u.price / 100),
    availableUnits: String(u.available_units),
    availableDate: u.available_date ?? '',
  }))

  const rawAmenities = (data.property_amenities ?? []) as { amenity_id: string }[]
  const amenityIds: AmenityId[] = rawAmenities
    .map((pa) => AMENITY_UUID_TO_SHORT[pa.amenity_id])
    .filter(Boolean)

  return { basicInfo, units, amenityIds, status: data.status as ListingStatus }
}

export interface UpdateListingInput {
  propertyId: string
  basicInfo: BasicInfoData
  units: UnitData[]
  amenityIds: string[]
  status: ListingStatus
}

/** Update an existing listing: property fields, replace units, replace amenities */
export async function updateListing(
  input: UpdateListingInput
): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { propertyId, basicInfo, units, amenityIds, status } = input

  const propertyTypeMap: Record<string, string> = {
    apartment: 'apartment', condo: 'condo', house: 'house',
    townhouse: 'townhouse', basement: 'basement', studio: 'studio',
    loft: 'loft', duplex: 'duplex', other: 'other',
  }
  const leaseTermMap: Record<string, string> = {
    'month-to-month': 'month-to-month', '6-months': '6-months',
    '1-year': '1-year', '2-years': '2-years', flexible: 'flexible',
  }

  // Update property fields
  const { error: propError } = await supabase
    .from('properties')
    .update({
      title: basicInfo.title,
      description: basicInfo.description || null,
      property_type: propertyTypeMap[basicInfo.propertyType] ?? 'other',
      status,
      street_address: basicInfo.street,
      city: basicInfo.city,
      province: basicInfo.province || 'ON',
      postal_code: basicInfo.postalCode || '',
      neighbourhood: basicInfo.neighbourhood || null,
      parking_type: basicInfo.parkingType === 'None' ? null : basicInfo.parkingType,
      pets_allowed: basicInfo.isPetFriendly,
      furnished: basicInfo.isFurnished,
      lease_term: leaseTermMap[basicInfo.leaseTerm] ?? null,
      year_built: basicInfo.yearBuilt ? Number(basicInfo.yearBuilt) : null,
      total_floors: basicInfo.totalFloors ? Number(basicInfo.totalFloors) : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId)

  if (propError) return { error: propError.message }

  // Replace units: delete existing, insert new
  await supabase.from('units').delete().eq('property_id', propertyId)
  if (units.length > 0) {
    const unitRows = units.map((u) => ({
      property_id: propertyId,
      name: u.name || null,
      bedrooms: Number(u.bedrooms) || 0,
      bathrooms: Number(u.bathrooms) || 1,
      sqft: u.squareFeet ? Number(u.squareFeet) : null,
      price: Math.round((Number(u.price) || 0) * 100),
      available_units: Number(u.availableUnits) || 1,
      available_date: u.availableDate || null,
    }))
    const { error: unitError } = await supabase.from('units').insert(unitRows)
    if (unitError) return { error: unitError.message }
  }

  // Replace amenities: delete existing, insert new
  await supabase.from('property_amenities').delete().eq('property_id', propertyId)
  const validAmenityDbIds = amenityIds
    .map((id) => AMENITY_ID_MAP[id])
    .filter(Boolean)
  if (validAmenityDbIds.length > 0) {
    const amenityRows = validAmenityDbIds.map((amenityId) => ({
      property_id: propertyId,
      amenity_id: amenityId,
    }))
    await supabase.from('property_amenities').insert(amenityRows)
  }

  return { error: null }
}

export interface LandlordStats {
  totalListings: number
  totalViews: number
  totalInquiries: number
  unreadInquiries: number
}

export interface LandlordListing {
  id: string
  title: string
  city: string
  slug: string
  status: ListingStatus
  tier: string
  minPrice: number
  maxPrice: number
  views: number
  inquiries: number
  imageUrl: string | null
}

export interface LandlordInquiry {
  id: string
  senderName: string
  senderEmail: string
  senderPhone: string | null
  propertyTitle: string
  message: string
  moveInDate: string | null
  createdAt: string
  isRead: boolean
}

export interface LandlordProfile {
  fullName: string
  phone: string
  companyName: string
  website: string
  description: string
}

/** Get dashboard stats for a landlord */
export async function getLandlordStats(landlordId: string): Promise<LandlordStats> {
  const supabase = createClient()

  // Properties summary
  const { data: props } = await supabase
    .from('properties')
    .select('id, view_count')
    .eq('landlord_id', landlordId)

  const propertyIds = (props ?? []).map((p) => p.id)
  const totalListings = propertyIds.length
  const totalViews = (props ?? []).reduce((sum, p) => sum + (p.view_count ?? 0), 0)

  if (propertyIds.length === 0) {
    return { totalListings: 0, totalViews: 0, totalInquiries: 0, unreadInquiries: 0 }
  }

  const { data: inquiries } = await supabase
    .from('contact_inquiries')
    .select('id, is_read')
    .in('property_id', propertyIds)

  const totalInquiries = (inquiries ?? []).length
  const unreadInquiries = (inquiries ?? []).filter((i) => !i.is_read).length

  return { totalListings, totalViews, totalInquiries, unreadInquiries }
}

/** Get all listings for a landlord with price range and inquiry count */
export async function getLandlordListings(landlordId: string): Promise<LandlordListing[]> {
  const supabase = createClient()

  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id, title, city, slug, status, tier, view_count,
      units(price),
      property_images(url, is_primary)
    `)
    .eq('landlord_id', landlordId)
    .order('created_at', { ascending: false })

  if (error || !properties) return []

  // Get inquiry counts for all these properties
  const propertyIds = properties.map((p) => p.id)
  const { data: inquiryRows } = await supabase
    .from('contact_inquiries')
    .select('property_id')
    .in('property_id', propertyIds)

  const inquiryCounts: Record<string, number> = {}
  for (const row of inquiryRows ?? []) {
    inquiryCounts[row.property_id] = (inquiryCounts[row.property_id] ?? 0) + 1
  }

  return properties.map((p) => {
    const prices = (p.units as { price: number }[] ?? []).map((u) => u.price)
    const minPrice = prices.length ? Math.min(...prices) : 0
    const maxPrice = prices.length ? Math.max(...prices) : 0
    const primaryImage = (p.property_images as { url: string; is_primary: boolean }[] ?? [])
      .find((img) => img.is_primary)
    const imageUrl = primaryImage?.url ?? null

    return {
      id: p.id,
      title: p.title,
      city: p.city,
      slug: p.slug,
      status: p.status as ListingStatus,
      tier: p.tier,
      minPrice,
      maxPrice,
      views: p.view_count ?? 0,
      inquiries: inquiryCounts[p.id] ?? 0,
      imageUrl,
    }
  })
}

/** Get recent inquiries for a landlord (join through properties) */
export async function getLandlordInquiries(landlordId: string): Promise<LandlordInquiry[]> {
  const supabase = createClient()

  // Get property IDs first
  const { data: props } = await supabase
    .from('properties')
    .select('id, title')
    .eq('landlord_id', landlordId)

  if (!props || props.length === 0) return []

  const propertyIds = props.map((p) => p.id)
  const propertyTitleMap: Record<string, string> = {}
  for (const p of props) propertyTitleMap[p.id] = p.title

  const { data: inquiries, error } = await supabase
    .from('contact_inquiries')
    .select('id, property_id, sender_name, sender_email, sender_phone, message, move_in_date, is_read, created_at')
    .in('property_id', propertyIds)
    .order('created_at', { ascending: false })

  if (error || !inquiries) return []

  return inquiries.map((inq) => ({
    id: inq.id,
    senderName: inq.sender_name,
    senderEmail: inq.sender_email,
    senderPhone: inq.sender_phone ?? null,
    propertyTitle: propertyTitleMap[inq.property_id] ?? 'Unknown property',
    message: inq.message,
    moveInDate: inq.move_in_date
      ? new Date(inq.move_in_date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
      : null,
    createdAt: inq.created_at,
    isRead: inq.is_read,
  }))
}

/** Mark a single inquiry as read */
export async function markInquiryRead(id: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('contact_inquiries').update({ is_read: true }).eq('id', id)
}

/** Mark all inquiries for a landlord as read */
export async function markAllInquiriesRead(landlordId: string): Promise<void> {
  const supabase = createClient()
  const { data: props } = await supabase
    .from('properties')
    .select('id')
    .eq('landlord_id', landlordId)

  if (!props || props.length === 0) return
  const propertyIds = props.map((p) => p.id)

  await supabase
    .from('contact_inquiries')
    .update({ is_read: true })
    .in('property_id', propertyIds)
    .eq('is_read', false)
}

/** Toggle a listing between active/inactive */
export async function updateListingStatus(id: string, status: ListingStatus): Promise<void> {
  const supabase = createClient()
  await supabase.from('properties').update({ status }).eq('id', id)
}

/** Delete a listing (RLS ensures only owner can delete) */
export async function deleteListing(id: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.from('properties').delete().eq('id', id)
  return { error: error?.message ?? null }
}

/** Get the combined profile for a landlord */
export async function getLandlordProfile(userId: string): Promise<LandlordProfile> {
  const supabase = createClient()

  const [profileRes, landlordRes] = await Promise.all([
    supabase.from('profiles').select('full_name, phone').eq('id', userId).single(),
    supabase.from('landlord_profiles').select('company_name, website, description').eq('id', userId).single(),
  ])

  return {
    fullName: profileRes.data?.full_name ?? '',
    phone: (profileRes.data as { full_name?: string; phone?: string } | null)?.phone ?? '',
    companyName: landlordRes.data?.company_name ?? '',
    website: landlordRes.data?.website ?? '',
    description: landlordRes.data?.description ?? '',
  }
}

/** Save profile changes to profiles + landlord_profiles */
export async function saveLandlordProfile(
  userId: string,
  data: LandlordProfile
): Promise<{ error: string | null }> {
  const supabase = createClient()

  const [profileRes, landlordRes] = await Promise.all([
    supabase
      .from('profiles')
      .update({ full_name: data.fullName, updated_at: new Date().toISOString() })
      .eq('id', userId),
    supabase
      .from('landlord_profiles')
      .upsert({
        id: userId,
        company_name: data.companyName || null,
        website: data.website || null,
        description: data.description || null,
      }, { onConflict: 'id' }),
  ])

  const error = profileRes.error?.message ?? landlordRes.error?.message ?? null
  return { error }
}

/** Change password via Supabase Auth */
export async function changePassword(newPassword: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error: error?.message ?? null }
}

/** Format a relative time from an ISO date string */
export function formatRelativeTime(isoDate: string): string {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(diff / 86400000)
  return `${days}d ago`
}
