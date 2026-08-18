'use client'

import { useState } from 'react'
import { Check, X, Star } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingTier {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: PricingFeature[]
  ctaLabel: string
  ctaHref: string
  badge?: string
  highlighted?: boolean
  premium?: boolean
}

const TIERS: PricingTier[] = [
  {
    id: 'limited',
    name: 'Limited',
    price: '$0',
    period: 'per listing',
    description: 'Get started with a basic listing at no cost.',
    ctaLabel: 'Start Free',
    ctaHref: ROUTES.signup,
    features: [
      { text: 'Basic listing', included: true },
      { text: 'Up to 5 photos', included: true },
      { text: 'Standard search placement', included: true },
      { text: 'Contact form', included: true },
      { text: 'Priority placement', included: false },
      { text: 'Performance analytics', included: false },
      { text: 'AI priority recommendation', included: false },
      { text: 'Dedicated support', included: false },
    ],
  },
  {
    id: 'promoted',
    name: 'Promoted',
    price: '$35',
    period: 'per 15 days',
    description: 'Stand out with priority placement and more visibility.',
    ctaLabel: 'Get Promoted',
    ctaHref: ROUTES.signup,
    badge: 'Popular',
    highlighted: true,
    features: [
      { text: 'Everything in Limited', included: true },
      { text: 'Priority placement', included: true },
      { text: 'Up to 20 photos', included: true },
      { text: 'Promoted badge', included: true },
      { text: 'Performance analytics', included: true },
      { text: 'Social media promotion', included: false },
      { text: 'AI priority recommendation', included: false },
      { text: 'Dedicated support', included: false },
    ],
  },
  {
    id: 'featured',
    name: 'Featured',
    price: '$199',
    period: 'per 15 days',
    description: 'Maximum exposure with top placement and AI boost.',
    ctaLabel: 'Go Featured',
    ctaHref: ROUTES.signup,
    premium: true,
    features: [
      { text: 'Everything in Promoted', included: true },
      { text: 'Top placement', included: true },
      { text: 'Featured badge with gold glow', included: true },
      { text: 'Social media promotion', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'AI priority recommendation', included: true },
      { text: 'Performance analytics', included: true },
      { text: 'Up to 40 photos', included: true },
    ],
  },
]

interface TierCardProps {
  tier: PricingTier
}

function TierCard({ tier }: TierCardProps) {
  const [hovered, setHovered] = useState(false)

  const cardClass = cn(
    tier.highlighted || tier.premium ? glass.cardPremium : glass.card,
    'p-8 flex flex-col gap-6 transition-all duration-500 cursor-default',
    tier.highlighted && 'scale-[1.04] border-brand-500/40 shadow-brand-500/20 shadow-2xl',
    tier.premium && 'border-amber-500/30 shadow-amber-500/10 shadow-2xl'
  )

  return (
    <article
      className={cardClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${tier.name} pricing plan`}
    >
      {/* Top highlight */}
      {(tier.highlighted || tier.premium) && (
        <div className={cn(glass.highlight)} aria-hidden="true" />
      )}

      {/* Holographic overlay on hover */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500',
          hovered ? 'opacity-100' : 'opacity-0',
          tier.premium
            ? 'bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-cyan-500/10'
            : tier.highlighted
              ? 'bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-cyan-500/10'
              : 'bg-gradient-to-br from-white/5 via-brand-500/5 to-purple-500/5'
        )}
      />

      {/* Holographic border shimmer */}
      {hovered && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 rounded-3xl pointer-events-none',
            'bg-gradient-to-r from-transparent via-white/10 to-transparent',
            'animate-pulse'
          )}
        />
      )}

      {/* Highlighted glow orb */}
      {tier.highlighted && (
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl pointer-events-none"
        />
      )}
      {tier.premium && (
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl pointer-events-none"
        />
      )}

      {/* Badge + Name */}
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
        {tier.badge && (
          <span
            className={cn(
              glass.badge,
              'text-xs font-semibold',
              tier.highlighted && 'text-brand-400 border-brand-500/30 bg-brand-500/10',
              tier.premium && 'text-amber-400 border-amber-500/30 bg-amber-500/10'
            )}
          >
            {tier.premium && <Star className="inline h-3 w-3 mr-1 fill-amber-400" aria-hidden="true" />}
            {tier.badge}
          </span>
        )}
        {tier.premium && !tier.badge && (
          <span className={cn(glass.badge, 'text-xs font-semibold text-amber-400 border-amber-500/30 bg-amber-500/10')}>
            <Star className="inline h-3 w-3 mr-1 fill-amber-400" aria-hidden="true" />
            Premium
          </span>
        )}
      </div>

      {/* Price */}
      <div className="relative z-10">
        <div className="flex items-end gap-2">
          <span
            className={cn(
              'text-5xl font-bold',
              tier.premium ? 'text-amber-400' : tier.highlighted ? 'text-brand-400' : 'text-gray-900 dark:text-white'
            )}
          >
            {tier.price}
          </span>
          <span className="text-gray-500 dark:text-white/50 text-sm pb-1.5">{tier.period}</span>
        </div>
        <p className="mt-2 text-sm text-gray-500 dark:text-white/50">{tier.description}</p>
      </div>

      {/* Features */}
      <ul className="relative z-10 flex flex-col gap-3 flex-1" aria-label={`${tier.name} features`}>
        {tier.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-3">
            {feature.included ? (
              <Check
                className={cn(
                  'h-4 w-4 mt-0.5 shrink-0',
                  tier.premium ? 'text-amber-400' : tier.highlighted ? 'text-brand-400' : 'text-gray-500 dark:text-white/60'
                )}
                aria-hidden="true"
              />
            ) : (
              <X className="h-4 w-4 mt-0.5 shrink-0 text-gray-300 dark:text-white/20" aria-hidden="true" />
            )}
            <span
              className={cn(
                'text-sm',
                feature.included ? 'text-gray-700 dark:text-white/80' : 'text-gray-400 dark:text-white/30'
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="relative z-10">
        <Link
          href={tier.ctaHref}
          className={cn(
            'block w-full text-center py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300',
            tier.highlighted &&
              'bg-gradient-to-r from-brand-500 to-cyan-500 text-white hover:from-brand-400 hover:to-cyan-400 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02]',
            tier.premium &&
              'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02]',
            !tier.highlighted && !tier.premium &&
              cn(glass.button, 'text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white')
          )}
        >
          {tier.ctaLabel}
        </Link>
      </div>
    </article>
  )
}

export function PricingTiers() {
  return (
    <section
      id="pricing"
      className="mx-auto w-full max-w-7xl px-4"
      aria-labelledby="pricing-heading"
    >
      {/* Header */}
      <div className="text-center mb-14">
        <span className={cn(glass.badge, 'text-brand-400 font-medium mb-4 inline-block')}>
          Transparent Pricing
        </span>
        <h2
          id="pricing-heading"
          className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Choose Your Plan
        </h2>
        <p className={cn('text-lg max-w-xl mx-auto', glassColors.text.secondary)}>
          Start free and upgrade when you need more exposure and tools.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-center mt-8 text-sm text-gray-400 dark:text-white/40">
        No contracts. Cancel anytime. All prices in CAD.
      </p>
    </section>
  )
}
