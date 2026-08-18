import { streamText, generateText, tool, stepCountIs } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt } from '@/features/ai-assistant/services/ai-service'
import type { AIContext } from '@/features/ai-assistant/types/ai'

// ---------------------------------------------------------------------------
// OpenRouter provider (uses the @ai-sdk/openai adapter with custom base URL)
// ---------------------------------------------------------------------------

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY ?? '',
})

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          'OPENROUTER_API_KEY is not configured. Please add it to your environment variables.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = (await req.json()) as {
      messages: { role: string; content: string }[]
      context?: AIContext
    }
    const { messages, context = {} } = body

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages must be an array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabase = await createClient()

    // -----------------------------------------------------------------------
    // Shared row types for Supabase queries
    // -----------------------------------------------------------------------

    type UnitRow = {
      price: number
      price_max: number | null
      bedrooms: number
      bathrooms: number
      sqft: number | null
      available_units: number
    }

    type PropertyRow = {
      id: string
      title: string
      slug: string
      city: string
      province: string
      property_type: string
      pets_allowed: boolean
      furnished: boolean
      units: UnitRow[] | null
    }

    // -----------------------------------------------------------------------
    // Define tools
    // -----------------------------------------------------------------------

    const searchPropertiesTool = tool({
      description:
        'Search for rental properties based on user criteria. Use this whenever the user asks to find, search, or browse listings.',
      inputSchema: z.object({
        city: z.string().optional().describe('City to search in, e.g. "Toronto"'),
        property_type: z
          .enum(['apartment', 'condo', 'house', 'townhouse', 'basement', 'studio'])
          .optional()
          .describe('Type of property'),
        price_min: z.number().optional().describe('Minimum monthly rent in CAD'),
        price_max: z.number().optional().describe('Maximum monthly rent in CAD'),
        bedrooms: z.number().optional().describe('Exact number of bedrooms'),
        pets_allowed: z
          .boolean()
          .optional()
          .describe('Whether the property must allow pets'),
      }),
      execute: async (params) => {
        try {
          let query = supabase
            .from('properties')
            .select(
              'id, title, slug, city, province, property_type, pets_allowed, furnished, units(price, bedrooms, bathrooms)'
            )
            .eq('status', 'active')
            .limit(5)

          if (params.city) query = query.ilike('city', `%${params.city}%`)
          if (params.property_type) query = query.eq('property_type', params.property_type)
          if (params.pets_allowed) query = query.eq('pets_allowed', true)

          const { data, error } = await query

          if (error) {
            console.error('[chat/search_properties] Supabase error:', error.message)
            return { error: 'Failed to search properties', results: [] }
          }

          let rows = (data ?? []) as PropertyRow[]

          // Post-fetch price + bedroom filtering (prices in DB are cents, params are dollars)
          if (params.price_min !== undefined) {
            const minCents = (params.price_min as number) * 100
            rows = rows.filter((p) =>
              (p.units ?? []).some((u) => u.price >= minCents)
            )
          }
          if (params.price_max !== undefined) {
            const maxCents = (params.price_max as number) * 100
            rows = rows.filter((p) =>
              (p.units ?? []).some((u) => u.price <= maxCents)
            )
          }
          if (params.bedrooms !== undefined) {
            rows = rows.filter((p) =>
              (p.units ?? []).some((u) => u.bedrooms === params.bedrooms)
            )
          }

          const results = rows.slice(0, 5).map((p) => {
            const firstUnit = (p.units ?? [])[0]
            return {
              id: p.id,
              title: p.title,
              city: p.city,
              province: p.province,
              type: p.property_type,
              pets_allowed: p.pets_allowed,
              furnished: p.furnished,
              url: `/listings/${p.slug}`,
              price: firstUnit ? `$${(firstUnit.price / 100).toLocaleString('en-CA')}/mo` : 'Contact for pricing',
              bedrooms: firstUnit?.bedrooms ?? 'N/A',
            }
          })

          return { results, total: results.length }
        } catch (err) {
          console.error('[chat/search_properties] Unexpected error:', err)
          return { error: 'Search failed', results: [] }
        }
      },
    })

    const createAlertTool = tool({
      description:
        'Create an email alert so the user is notified when new listings match their criteria. Use this when the user explicitly asks to be notified or set up an alert.',
      inputSchema: z.object({
        city: z.string().describe('City to monitor for new listings'),
        property_type: z
          .enum(['apartment', 'condo', 'house', 'townhouse', 'basement', 'studio'])
          .optional(),
        price_max: z.number().optional().describe('Maximum monthly rent in CAD'),
        bedrooms_min: z.number().optional().describe('Minimum number of bedrooms'),
        pets_allowed: z.boolean().optional(),
        email: z
          .string()
          .email()
          .optional()
          .describe('User email address if they are not logged in'),
      }),
      execute: async (params) => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user) {
            const { error } = await supabase.from('alerts').insert({
              user_id: user.id,
              name: `${params.city} alert`,
              city: params.city,
              max_price: params.price_max ?? null,
              min_bedrooms: params.bedrooms_min ?? null,
              property_types: params.property_type ? [params.property_type] : null,
              is_active: true,
              email_notifications: true,
            })

            if (error) {
              console.error('[chat/create_alert] DB error:', error.message)
            }
          }

          const criteria = [
            params.city,
            params.property_type ? `${params.property_type}s` : null,
            params.price_max ? `under $${params.price_max}/mo` : null,
            params.bedrooms_min ? `${params.bedrooms_min}+ bedrooms` : null,
            params.pets_allowed ? 'pet-friendly' : null,
          ]
            .filter(Boolean)
            .join(', ')

          return {
            success: true,
            message: `Alert created for ${criteria}. ${user ? "You'll be notified at your account email." : 'Sign in to your account to receive notifications.'}`,
            authenticated: !!user,
          }
        } catch (err) {
          console.error('[chat/create_alert] Unexpected error:', err)
          return { success: false, message: 'Failed to create alert. Please try again.' }
        }
      },
    })

    const getCityInfoTool = tool({
      description:
        'Get rental market information about a Canadian city, including total listing count.',
      inputSchema: z.object({
        city: z.string().describe('The name of the Canadian city'),
      }),
      execute: async (params) => {
        try {
          const { data, error } = await supabase
            .from('cities')
            .select('name, province, listing_count')
            .ilike('name', `%${params.city}%`)
            .limit(1)
            .single()

          if (error || !data) {
            return {
              error: `No data found for "${params.city}". Try a major Canadian city name.`,
            }
          }

          return {
            name: data.name,
            province: data.province,
            listings: data.listing_count,
          }
        } catch (err) {
          console.error('[chat/get_city_info] Unexpected error:', err)
          return { error: 'Failed to retrieve city information.' }
        }
      },
    })

    const getPropertyDetailsTool = tool({
      description:
        'Get full details about a specific property by its ID. Use this when a user asks about a property they are currently viewing.',
      inputSchema: z.object({
        property_id: z.string().describe('The UUID of the property'),
      }),
      execute: async (params) => {
        try {
          const { data, error } = await supabase
            .from('properties')
            .select(
              'title, property_type, street_address, city, province, pets_allowed, furnished, parking_type, description, units(bedrooms, bathrooms, price, sqft, available_units)'
            )
            .eq('id', params.property_id)
            .single()

          if (error || !data) {
            return { error: 'Property not found.' }
          }

          return {
            title: data.title,
            type: data.property_type,
            address: `${data.street_address}, ${data.city}, ${data.province}`,
            pets: data.pets_allowed ? 'Yes' : 'No',
            furnished: data.furnished ? 'Yes' : 'No',
            parking: data.parking_type ?? 'None',
            description: data.description ?? 'No description available.',
            units: ((data.units as UnitRow[]) ?? []).map((u) => ({
              bedrooms: u.bedrooms,
              bathrooms: u.bathrooms,
              price: `$${u.price}/mo`,
              sqft: u.sqft ?? 'N/A',
              available: u.available_units > 0,
            })),
          }
        } catch (err) {
          console.error('[chat/get_property_details] Unexpected error:', err)
          return { error: 'Failed to retrieve property details.' }
        }
      },
    })

    // -----------------------------------------------------------------------
    // Stream the response
    // -----------------------------------------------------------------------

    const toolDefs = {
      search_properties: searchPropertiesTool,
      create_alert: createAlertTool,
      get_city_info: getCityInfoTool,
      get_property_details: getPropertyDetailsTool,
    }

    // Use generateText for full tool-calling loop, then stream the final text.
    // This avoids the issue where streamText's textStream is empty for tool-calling steps.
    const { text } = await generateText({
      model: openrouter.chat('anthropic/claude-sonnet-4-5'),
      system: buildSystemPrompt(context),
      messages: messages as { role: 'user' | 'assistant'; content: string }[],
      stopWhen: stepCountIs(5),
      tools: toolDefs,
    })

    // Stream the text in chunks for a smooth typing effect
    const encoder = new TextEncoder()
    const CHUNK_SIZE = 12
    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < text.length; i += CHUNK_SIZE) {
          controller.enqueue(encoder.encode(text.slice(i, i + CHUNK_SIZE)))
          // Small delay for streaming feel
          await new Promise((r) => setTimeout(r, 15))
        }
        controller.close()
      },
    })
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    const errMsg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    console.error('[api/chat] POST error:', errMsg)
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
