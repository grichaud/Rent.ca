'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/shared/lib/utils'
import { glass, meshBackground } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'

const TRUST_STATS = [
  '10,000+ Active Listings',
  '200+ Cities',
  '50,000+ Monthly Visitors',
]

export function LandlordHero() {
  return (
    <section
      className={cn(
        'relative min-h-[80vh] flex flex-col items-center justify-center',
        'overflow-hidden px-4 py-24'
      )}
      aria-label="List your property on Rent.ca"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop&q=80"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/60" />
        <div className={cn('absolute inset-0 opacity-50 dark:opacity-60', meshBackground)} />
      </div>

      {/* Aurora animated gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <div
          className="absolute -top-[10%] -left-[5%] h-[650px] w-[650px] rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-[130px] animate-pulse-slow"
        />
        <div
          className="absolute top-[-5%] right-[-10%] h-[550px] w-[550px] rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-[110px] animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-[0%] left-[25%] h-[500px] w-[500px] rounded-full bg-amber-500/8 dark:bg-amber-500/15 blur-[100px] animate-pulse-slow"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Badge */}
      <div className="relative z-10 mb-6">
        <span className={cn(glass.badge, 'text-brand-600 dark:text-brand-400 font-medium')}>
          For Landlords &amp; Property Managers
        </span>
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mb-8">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          List Your Property{' '}
          <span className="bg-gradient-to-r from-brand-500 via-cyan-500 to-purple-500 dark:from-brand-400 dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
            on Rent.ca
          </span>
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-gray-600 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
          Reach thousands of renters across Canada with AI-powered matching
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mb-12">
        <Link
          href={ROUTES.signup}
          className={cn(
            glass.buttonPrimary,
            'group flex items-center gap-3 px-8 py-4 text-base font-semibold text-white'
          )}
        >
          Get Started Free
          <ArrowRight
            className="h-4 w-4 text-white/70 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
        <a
          href="#pricing"
          className={cn(
            glass.button,
            'px-8 py-4 text-base font-semibold text-gray-700 hover:text-gray-900 dark:text-white/80 dark:hover:text-white'
          )}
        >
          View Pricing
        </a>
      </div>

      {/* Trust stats */}
      <div
        className="relative z-10 flex flex-wrap justify-center items-center gap-3 sm:gap-6"
        aria-label="Platform statistics"
      >
        {TRUST_STATS.map((stat, i) => (
          <span key={stat} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-white/60">{stat}</span>
            {i < TRUST_STATS.length - 1 && (
              <span aria-hidden="true" className="h-px w-4 bg-gray-300 dark:bg-white/20 hidden sm:block" />
            )}
          </span>
        ))}
      </div>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-50 dark:from-slate-950 to-transparent pointer-events-none"
      />
    </section>
  )
}
