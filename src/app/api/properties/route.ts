import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getProperties } from '@/features/properties/services/property-service.server'
import type { PropertyType, LeaseTerm } from '@/shared/types/database'
import type { SortOption } from '@/features/search/types/search'

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const PROPERTY_TYPES: [PropertyType, ...PropertyType[]] = [
  'apartment',
  'condo',
  'house',
  'townhouse',
  'basement',
  'studio',
  'loft',
  'duplex',
  'other',
]

const LEASE_TERMS: [LeaseTerm, ...LeaseTerm[]] = [
  'month-to-month',
  '6-months',
  '1-year',
  '2-years',
  'flexible',
]

const SORT_OPTIONS: [SortOption, ...SortOption[]] = [
  'price_asc',
  'price_desc',
  'newest',
  'popular',
]

const querySchema = z.object({
  city: z.string().min(1).optional(),
  type: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined
      return val
        .split(',')
        .map((t) => t.trim())
        .filter((t): t is PropertyType => (PROPERTY_TYPES as string[]).includes(t))
    }),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
  beds: z.coerce.number().int().nonnegative().optional(),
  bedsMax: z.coerce.number().int().nonnegative().optional(),
  baths: z.coerce.number().nonnegative().optional(),
  pets: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  furnished: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  leaseTerm: z.enum(LEASE_TERMS).optional(),
  parking: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : undefined)),
  keyword: z.string().min(1).optional(),
  sort: z.enum(SORT_OPTIONS).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

// ---------------------------------------------------------------------------
// GET /api/properties
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = req.nextUrl

    const rawParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      rawParams[key] = value
    })

    const parsed = querySchema.safeParse(rawParams)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const {
      city,
      type,
      priceMin,
      priceMax,
      beds,
      bedsMax,
      baths,
      pets,
      furnished,
      leaseTerm,
      parking,
      keyword,
      sort,
      page,
      limit,
    } = parsed.data

    const result = await getProperties({
      city,
      propertyType: type && type.length > 0 ? type : undefined,
      priceMin,
      priceMax,
      bedroomsMin: beds,
      bedroomsMax: bedsMax,
      bathroomsMin: baths,
      petsAllowed: pets,
      furnished,
      leaseTerm,
      hasParking: parking,
      keyword,
      sort,
      page,
      limit,
    })

    return NextResponse.json({
      data: {
        items: result.items,
        total: result.total,
        page,
        limit,
        hasMore: page * limit < result.total,
      },
      error: null,
    })
  } catch (err) {
    console.error('[api/properties] GET error:', err)
    return NextResponse.json({ data: null, error: 'Internal Server Error' }, { status: 500 })
  }
}
