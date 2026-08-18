import { ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'

export function FinalCta() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4"
      aria-labelledby="final-cta-heading"
    >
      <div className={cn(glass.cardPremium, 'p-12 sm:p-16 text-center')}>
        {/* Top highlight */}
        <div className={cn(glass.highlight)} aria-hidden="true" />

        {/* Background gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/10 via-transparent to-purple-500/10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <h2
            id="final-cta-heading"
            className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            Ready to Find Your{' '}
            <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
              Next Tenant?
            </span>
          </h2>

          <p className={cn('text-lg leading-relaxed', glassColors.text.secondary)}>
            Join thousands of landlords and property managers across Canada who trust
            Rent.ca to fill vacancies fast.
          </p>

          {/* CTA Button */}
          <Link
            href={ROUTES.signup}
            className={cn(
              glass.buttonPrimary,
              'group flex items-center gap-3 px-10 py-4 text-base font-semibold text-white mt-2'
            )}
          >
            Get Started Free
            <ArrowRight
              className="h-4 w-4 text-gray-500 dark:text-white/70 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          {/* Trust note */}
          <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-white/40">
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span>No credit card required &middot; Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
