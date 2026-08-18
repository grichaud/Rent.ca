/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/** Paginated response for list endpoints */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Common pagination params */
export interface PaginationParams {
  page?: number;
  limit?: number;
}
