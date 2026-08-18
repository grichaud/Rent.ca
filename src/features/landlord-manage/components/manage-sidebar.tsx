'use client'

import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  LayoutDashboard,
  Building2,
  Heart,
  MessageSquare,
  User,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Listings', href: ROUTES.listings, icon: Building2 },
  { label: 'Favorites', href: ROUTES.landlordFavorites, icon: Heart },
  { label: 'Inquiries', href: ROUTES.inquiries, icon: MessageSquare },
  { label: 'Account', href: ROUTES.account, icon: User },
]

interface ManageSidebarProps {
  onNavClick?: () => void
}

export function ManageSidebar({ onNavClick }: ManageSidebarProps) {
  const pathname = usePathname()
  const locale = useLocale()
  // Strip locale prefix for comparison (e.g. /en/landlord → /landlord)
  const pagePath = '/' + pathname.split('/').slice(2).join('/')

  function isActive(href: string) {
    if (href === ROUTES.dashboard) return pagePath === href
    return pagePath.startsWith(href)
  }

  return (
    <nav className="flex flex-col h-full" aria-label="Manage navigation">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-200 dark:border-white/10">
        <a href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-400 transition-colors">
            Rent.ca
          </span>
          <span className={cn('text-xs ml-1 mt-0.5', glassColors.text.muted)}>Manage</span>
        </a>
      </div>

      {/* Navigation — uses <a> tags to force full page navigation (avoids Next.js 16 RSC hang in client layouts) */}
      <ul className="flex flex-col gap-1 p-3 flex-1" role="list">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href)
          return (
            <li key={href}>
              <a
                href={`/${locale}${href}`}
                onClick={onNavClick}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-brand-500/20 text-brand-400 shadow-sm shadow-brand-500/10'
                    : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white/90'
                )}
              >
                <Icon
                  className={cn('h-4 w-4 shrink-0', active ? 'text-brand-400' : 'text-gray-400 dark:text-white/40')}
                  aria-hidden="true"
                />
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                )}
              </a>
            </li>
          )
        })}
      </ul>

      {/* Bottom actions */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10 flex flex-col gap-1">
        <a
          href={`/${locale}`}
          onClick={onNavClick}
          className={cn(
            glass.button,
            'flex items-center gap-2 px-4 py-2.5 text-sm w-full',
            glassColors.text.muted,
            'hover:text-gray-700 dark:hover:text-white/80'
          )}
        >
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
          Back to site
        </a>
      </div>
    </nav>
  )
}
