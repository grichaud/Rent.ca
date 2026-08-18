import { createClient } from '@/lib/supabase/client'
import type { ApiResponse } from '@/shared/types/api'

export interface RenterStats {
  totalFavorites: number
  activeAlerts: number
  sentInquiries: number
}

export interface RenterInquiry {
  id: string
  propertyTitle: string
  propertyCity: string
  propertySlug: string
  message: string
  moveInDate: string | null
  createdAt: string
  isRead: boolean
}

export interface RenterProfile {
  fullName: string
  phone: string
}

export async function getRenterStats(userId: string): Promise<RenterStats> {
  const supabase = createClient()

  const [favRes, alertRes, inqRes] = await Promise.all([
    supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('is_active', true),
    supabase.from('contact_inquiries').select('id', { count: 'exact', head: true }).eq('sender_id', userId),
  ])

  return {
    totalFavorites: favRes.count ?? 0,
    activeAlerts: alertRes.count ?? 0,
    sentInquiries: inqRes.count ?? 0,
  }
}

export async function getRenterInquiries(userId: string): Promise<RenterInquiry[]> {
  const supabase = createClient()

  const { data } = await supabase
    .from('contact_inquiries')
    .select('id, message, move_in_date, created_at, is_read, properties(title, city, slug)')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false })

  if (!data) return []

  return data.map((row) => {
    const prop = (row.properties as unknown) as { title: string; city: string; slug: string } | null
    return {
      id: row.id as string,
      propertyTitle: prop?.title ?? 'Unknown property',
      propertyCity: prop?.city ?? '',
      propertySlug: prop?.slug ?? '',
      message: row.message as string,
      moveInDate: row.move_in_date as string | null,
      createdAt: row.created_at as string,
      isRead: row.is_read as boolean,
    }
  })
}

export async function getRenterProfile(userId: string): Promise<RenterProfile> {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', userId)
    .single()

  return {
    fullName: data?.full_name ?? '',
    phone: data?.phone ?? '',
  }
}

export async function saveRenterProfile(
  userId: string,
  profile: RenterProfile
): Promise<ApiResponse<null>> {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: profile.fullName, phone: profile.phone })
    .eq('id', userId)

  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function submitInquiry(params: {
  propertyId: string
  senderId: string | null
  senderName: string
  senderEmail: string
  senderPhone: string | null
  message: string
  moveInDate: string | null
}): Promise<ApiResponse<null>> {
  const supabase = createClient()
  const { error } = await supabase.from('contact_inquiries').insert({
    property_id: params.propertyId,
    sender_id: params.senderId,
    sender_name: params.senderName,
    sender_email: params.senderEmail,
    sender_phone: params.senderPhone || null,
    message: params.message,
    move_in_date: params.moveInDate || null,
  })

  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}
