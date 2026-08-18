import { create } from 'zustand'
import type { SearchFilters, SortOption, ViewMode } from '@/features/search/types/search'

interface SearchStore {
  filters: SearchFilters
  sort: SortOption
  viewMode: ViewMode
  page: number
  isLoading: boolean
  hoveredPropertyId: string | null
  selectedPropertyId: string | null

  /** Update a single filter key. Resets page to 1. */
  setFilter: (key: keyof SearchFilters, value: unknown) => void

  /** Merge multiple filter values at once. Resets page to 1. */
  setFilters: (filters: Partial<SearchFilters>) => void

  /** Reset all filters to their initial values and go back to page 1. */
  clearFilters: () => void

  /** Change sort order. Resets page to 1. */
  setSort: (sort: SortOption) => void

  /** Switch the display mode between grid, list and map. */
  setViewMode: (mode: ViewMode) => void

  /** Navigate to a specific page. */
  setPage: (page: number) => void

  /** Toggle the global loading indicator. */
  setLoading: (loading: boolean) => void

  /** Set the hovered property (for map ↔ card sync). */
  setHoveredPropertyId: (id: string | null) => void

  /** Set the selected property (for map popup). */
  setSelectedPropertyId: (id: string | null) => void
}

const INITIAL_FILTERS: SearchFilters = {}

export const useSearchStore = create<SearchStore>((set) => ({
  filters: INITIAL_FILTERS,
  sort: 'newest',
  viewMode: 'grid',
  page: 1,
  isLoading: false,
  hoveredPropertyId: null,
  selectedPropertyId: null,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      page: 1,
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      page: 1,
    })),

  clearFilters: () =>
    set({
      filters: INITIAL_FILTERS,
      page: 1,
    }),

  setSort: (sort) => set({ sort, page: 1 }),

  setViewMode: (viewMode) => set({ viewMode }),

  setPage: (page) => set({ page }),

  setLoading: (isLoading) => set({ isLoading }),

  setHoveredPropertyId: (hoveredPropertyId) => set({ hoveredPropertyId }),

  setSelectedPropertyId: (selectedPropertyId) => set({ selectedPropertyId }),
}))
