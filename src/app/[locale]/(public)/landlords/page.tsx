import type { Metadata } from 'next'
import { LandlordHero } from '@/features/landlord-landing/components/landlord-hero'
import { ValueProps } from '@/features/landlord-landing/components/value-props'
import { HowItWorks } from '@/features/landlord-landing/components/how-it-works'
import { PricingTiers } from '@/features/landlord-landing/components/pricing-tiers'
import { Testimonials } from '@/features/landlord-landing/components/testimonials'
import { LandlordFaq } from '@/features/landlord-landing/components/landlord-faq'
import { FinalCta } from '@/features/landlord-landing/components/final-cta'

export const metadata: Metadata = {
  title: 'List Your Property | Rent.ca for Landlords',
  description:
    'List your rental property on Rent.ca and reach thousands of qualified renters across Canada. AI-powered matching, priority placement, and a full management portal.',
}

export default function LandlordsPage() {
  return (
    <div className="flex flex-col">
      <LandlordHero />
      <div className="flex flex-col space-y-24 py-16">
        <ValueProps />
        <HowItWorks />
        <PricingTiers />
        <Testimonials />
        <LandlordFaq />
        <FinalCta />
      </div>
    </div>
  )
}
