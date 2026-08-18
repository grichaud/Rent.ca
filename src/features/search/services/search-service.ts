import { createClient } from '@/lib/supabase/client'
import { getProperties } from '@/features/properties/services/property-service'
import type { PropertyCardData } from '@/features/properties/types/property'
import type { SearchParams } from '@/features/search/types/search'
import type { City } from '@/shared/types/database'

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/**
 * Search properties with the given params.
 * Thin wrapper so UI code only imports from the search feature.
 */
export async function searchProperties(
  params: SearchParams
): Promise<{ items: PropertyCardData[]; total: number }> {
  return getProperties(params)
}

// ---------------------------------------------------------------------------
// City suggestions
// ---------------------------------------------------------------------------

/**
 * Return cities whose name contains the given query string (case-insensitive).
 * Results are ordered alphabetically and capped at 10.
 */
export async function getCitySuggestions(query: string): Promise<City[]> {
  if (!query.trim()) {
    return []
  }

  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .ilike('name', `%${query.trim()}%`)
      .order('name', { ascending: true })
      .limit(10)

    if (error) {
      console.error('[search-service] getCitySuggestions error:', error.message)
      return []
    }

    return (data ?? []) as City[]
  } catch (err) {
    console.error('[search-service] getCitySuggestions unexpected error:', err)
    return []
  }
}

// ---------------------------------------------------------------------------
// Popular cities
// ---------------------------------------------------------------------------

/**
 * Return cities flagged as featured/popular, ordered by listing count descending.
 */
export async function getPopularCities(): Promise<City[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_featured', true)
      .order('listing_count', { ascending: false })

    if (error) {
      console.error('[search-service] getPopularCities error:', error.message)
      return []
    }

    return (data ?? []) as City[]
  } catch (err) {
    console.error('[search-service] getPopularCities unexpected error:', err)
    return []
  }
}
