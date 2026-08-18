'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Logo } from '@/shared/components/logo'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'

const quickLinks = [
  { href: ROUTES.about, key: 'about' as const },
  { href: ROUTES.contact, key: 'contact' as const },
  { href: ROUTES.faq, key: 'faq' as const },
  { href: ROUTES.terms, key: 'terms' as const },
  { href: ROUTES.privacy, key: 'privacy' as const },
]

const landlordLinks = [
  { href: ROUTES.landlords, key: 'listProperty' as const },
  { href: ROUTES.landlords, key: 'pricing' as const },
  { href: ROUTES.dashboard, key: 'dashboard' as const },
]

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer
      className={cn(
        glass.base,
        'mx-4 mb-4 rounded-3xl border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/20'
      )}
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Three column grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Column 1 - Brand */}
          <div className="flex flex-col gap-4">
            <Logo size="md" />
            <p className={cn('text-sm leading-relaxed', glassColors.text.secondary)}>
              {t('tagline')}
              <br />
              {t('verified')}
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className={cn('text-sm font-semibold uppercase tracking-wider mb-4', glassColors.text.muted)}>
              {t('quickLinks')}
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {quickLinks.map(({ href, key }) => (
                <li key={`${href}-${key}`}>
                  <Link
                    href={href}
                    className={cn(
                      'text-sm transition-colors duration-200',
                      glassColors.text.secondary,
                      'hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - For Landlords */}
          <div>
            <h3 className={cn('text-sm font-semibold uppercase tracking-wider mb-4', glassColors.text.muted)}>
              {t('forLandlords')}
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {landlordLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={cn(
                      'text-sm transition-colors duration-200',
                      glassColors.text.secondary,
                      'hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={cn('mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3', glassColors.border.subtle)}>
          <p className={cn('text-sm', glassColors.text.muted)}>
            {t('copyright')}
          </p>
          <p className={cn('text-xs', glassColors.text.muted)}>
            {t('builtWith')}
          </p>
        </div>
      </div>
    </footer>
  )
}
