import { createClient } from '@/lib/supabase/client'
import type { ApiResponse } from '@/shared/types/api'
import type { Alert, PropertyType } from '@/shared/types/database'

export async function getAlerts(userId: string): Promise<ApiResponse<Alert[]>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return { data: null, error: error.message }
  return { data: data as Alert[], error: null }
}

export interface CreateAlertInput {
  user_id: string
  city: string
  property_type: PropertyType | null
  price_min: number | null
  price_max: number | null
  bedrooms_min: number | null
  pets_allowed: boolean | null
  frequency: string
}

export async function createAlert(alert: CreateAlertInput): Promise<ApiResponse<Alert>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('alerts')
    .insert({ ...alert, is_active: true })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Alert, error: null }
}

export async function updateAlert(id: string, updates: Partial<Alert>): Promise<ApiResponse<Alert>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: data as Alert, error: null }
}

export async function deleteAlert(id: string): Promise<ApiResponse<null>> {
  const supabase = createClient()
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id)

  if (error) return { data: null, error: error.message }
  return { data: null, error: null }
}

export async function toggleAlert(id: string, isActive: boolean): Promise<ApiResponse<Alert>> {
  return updateAlert(id, { is_active: isActive })
}
