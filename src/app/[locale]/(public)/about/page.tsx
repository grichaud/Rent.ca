import type { Metadata } from 'next'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { Building2, Users, Sparkles, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Rent.ca - Canada\'s AI-powered rental marketplace.',
}

const values = [
  { icon: Building2, title: 'Comprehensive Listings', description: 'Thousands of verified rental properties across Canada, from apartments to houses.', color: 'text-brand-400' },
  { icon: Sparkles, title: 'AI-Powered Search', description: 'Our intelligent assistant helps you find the perfect home using natural language.', color: 'text-cyan-400' },
  { icon: MapPin, title: 'Coast to Coast', description: 'Coverage across all major Canadian cities and growing to serve every community.', color: 'text-purple-400' },
  { icon: Users, title: 'Trusted Community', description: 'Verified landlords, transparent listings, and a commitment to fair housing.', color: 'text-green-400' },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About <span className="text-brand-400">Rent.ca</span></h1>
        <p className={cn('text-lg max-w-2xl mx-auto', glassColors.text.secondary)}>
          We&apos;re building Canada&apos;s most intelligent rental marketplace, combining comprehensive
          listings with AI-powered search to make finding your next home effortless.
        </p>
      </div>

      <div className={cn(glass.card, 'p-8 space-y-4')}>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
        <p className={cn('leading-relaxed', glassColors.text.secondary)}>
          Finding a rental home in Canada shouldn&apos;t be stressful. We created Rent.ca to
          bring together the most comprehensive listing database with cutting-edge AI technology.
          Whether you&apos;re a renter searching for the perfect apartment or a landlord looking
          to fill vacancies quickly, Rent.ca is designed to make the process simple, transparent,
          and efficient.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {values.map((v) => (
          <div key={v.title} className={cn(glass.card, 'p-6 space-y-3')}>
            <div className={cn('h-12 w-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center')}>
              <v.icon className={cn('h-6 w-6', v.color)} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{v.title}</h3>
            <p className={cn('text-sm', glassColors.text.muted)}>{v.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
