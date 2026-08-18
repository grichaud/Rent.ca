import { createClient } from '@/lib/supabase/client'
import type { ApiResponse } from '@/shared/types/api'
import type { Favorite } from '@/shared/types/database'

export async function getFavorites(userId: string): Promise<ApiResponse<Favorite[]>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('favorites')
    .select('*, properties(id, title, slug, city, province, property_type, status, units(price, bedrooms, bathrooms), property_images(url, is_primary))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as Favorite[], error: null }
}

export async function addFavorite(userId: string, propertyId: string): Promise<ApiResponse<Favorite>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, property_id: propertyId })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Favorite, error: null }
}

export async function removeFavorite(userId: string, propertyId: string): Promise<ApiResponse<null>> {
  const supabase = createClient()
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId)

  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function isFavorited(userId: string, propertyId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .maybeSingle()

  return !!data
}
