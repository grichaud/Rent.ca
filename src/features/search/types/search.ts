import type { PropertyType, LeaseTerm } from '@/shared/types/database'
import type { SortDirection } from '@/shared/types/api'

export type { SortDirection }

export interface SearchFilters {
  city?: string
  propertyType?: PropertyType[]
  priceMin?: number
  priceMax?: number
  bedroomsMin?: number
  bedroomsMax?: number
  bathroomsMin?: number
  petsAllowed?: boolean
  furnished?: boolean
  leaseTerm?: LeaseTerm
  hasParking?: boolean
  keyword?: string
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'popular'

export interface SearchParams extends SearchFilters {
  sort?: SortOption
  page?: number
  limit?: number
}

export type ViewMode = 'grid' | 'list' | 'map'
