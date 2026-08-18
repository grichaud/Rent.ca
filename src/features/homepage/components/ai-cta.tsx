'use client'

import { Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { useAIStore } from '@/features/ai-assistant/store/ai-store'
import { useTranslations } from 'next-intl'

export function AiCta() {
  const openAI = useAIStore((s) => s.open)
  const t = useTranslations('aiChat')

  return (
    <section aria-labelledby="ai-cta-heading">
      <div className={cn(glass.cardPremium, 'p-10 sm:p-14')}>
        {/* Top highlight */}
        <div className={cn(glass.highlight)} aria-hidden="true" />

        {/* Background glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-500/10 via-transparent to-purple-500/10 pointer-events-none"
        />

        {/* Ambient orb */}
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          {/* Icon badge */}
          <div
            className={cn(
              'h-16 w-16 rounded-2xl flex items-center justify-center',
              'bg-gradient-to-br from-brand-500/30 to-cyan-500/30',
              'border border-gray-300 dark:border-white/20 shadow-xl shadow-brand-500/20',
              'animate-glow'
            )}
          >
            <Sparkles className="h-8 w-8 text-brand-400" aria-hidden="true" />
          </div>

          <div>
            <h2
              id="ai-cta-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3"
            >
              {t('cantFind')}
            </h2>
            <p className={cn('text-base sm:text-lg leading-relaxed', glassColors.text.secondary)}>
              {t('cantFindDesc')}
            </p>
          </div>

          <button
            type="button"
            onClick={openAI}
            className={cn(
              glass.buttonPrimary,
              'group flex items-center gap-3 px-8 py-4 text-base font-semibold text-white'
            )}
            aria-label="Open AI rental assistant chat"
          >
            <Sparkles className="h-5 w-5 text-brand-300 shrink-0" aria-hidden="true" />
            {t('chatButton')}
            <ArrowRight
              className="h-4 w-4 text-white/60 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-white/40">
            <span>{t('freeToUse')}</span>
            <span aria-hidden="true" className="h-px w-4 bg-gray-300 dark:bg-white/20" />
            <span>{t('noSignup')}</span>
            <span aria-hidden="true" className="h-px w-4 bg-gray-300 dark:bg-white/20" />
            <span>{t('available247')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
