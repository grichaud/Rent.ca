'use client'

import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  LayoutDashboard,
  Heart,
  Bell,
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
  { label: 'Dashboard', href: ROUTES.renterDashboard, icon: LayoutDashboard },
  { label: 'Favorites', href: ROUTES.renterFavorites, icon: Heart },
  { label: 'Alerts', href: ROUTES.renterAlerts, icon: Bell },
  { label: 'My Inquiries', href: ROUTES.renterInquiries, icon: MessageSquare },
  { label: 'Account', href: ROUTES.renterAccount, icon: User },
]

interface RenterSidebarProps {
  onNavClick?: () => void
}

export function RenterSidebar({ onNavClick }: RenterSidebarProps) {
  const pathname = usePathname()
  const locale = useLocale()
  // Strip locale prefix for comparison
  const pagePath = '/' + pathname.split('/').slice(2).join('/')

  function isActive(href: string) {
    if (href === ROUTES.renterDashboard) return pagePath === href
    return pagePath.startsWith(href)
  }

  return (
    <nav className="flex flex-col h-full" aria-label="Renter navigation">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-200 dark:border-white/10">
        <a href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            Rent.ca
          </span>
          <span className={cn('text-xs ml-1 mt-0.5', glassColors.text.muted)}>My Portal</span>
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
                    ? 'bg-pink-500/20 text-pink-400 shadow-sm shadow-pink-500/10'
                    : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white/90'
                )}
              >
                <Icon
                  className={cn('h-4 w-4 shrink-0', active ? 'text-pink-400' : 'text-gray-400 dark:text-white/40')}
                  aria-hidden="true"
                />
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden="true" />
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
          Browse listings
        </a>
      </div>
    </nav>
  )
}
