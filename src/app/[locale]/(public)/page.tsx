import type { Metadata } from 'next'
import { HeroSection } from '@/features/homepage/components/hero-section'
import { PopularCitiesGrid } from '@/features/homepage/components/popular-cities-grid'
import { NewListingsCarousel } from '@/features/homepage/components/new-listings-carousel'
import { StatsBanner } from '@/features/homepage/components/stats-banner'
import { AiCta } from '@/features/homepage/components/ai-cta'
import { getProperties } from '@/features/properties/services/property-service.server'

export const metadata: Metadata = {
  title: 'Find Your Next Home in Canada',
  description:
    'Discover thousands of apartments, condos, and houses for rent across Canada. AI-powered search, interactive maps, and verified listings.',
}

export default async function HomePage() {
  const { items: recentListings } = await getProperties({ sort: 'newest', limit: 6 })

  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="mx-auto w-full max-w-7xl px-4 space-y-24 py-16">
        <PopularCitiesGrid />
        <NewListingsCarousel listings={recentListings} />
        <StatsBanner />
        <AiCta />
      </div>
    </div>
  )
}
