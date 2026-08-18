'use client'

import Link from 'next/link'
import { LogIn, UserPlus, User, Languages, LogOut } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Logo } from '@/shared/components/logo'
import { MobileNav } from '@/shared/components/mobile-nav'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useAuthStore } from '@/features/auth/store/auth-store'

interface HeaderProps {
  /** Optional element rendered before the logo on mobile (e.g. portal sidebar trigger) */
  sidebarTrigger?: React.ReactNode
}

const navLinks = [
  { href: ROUTES.home, labelKey: 'rent' },
  { href: ROUTES.landlords, labelKey: 'landlords' },
  { href: ROUTES.about, labelKey: 'about' },
]

function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale() {
    const newLocale = locale === 'en' ? 'fr' : 'en'
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <button
      onClick={switchLocale}
      aria-label={locale === 'en' ? 'Switch to French' : 'Passer en anglais'}
      className={cn(
        glass.button,
        'flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'
      )}
    >
      <Languages className="h-3.5 w-3.5" />
      {locale === 'en' ? 'FR' : 'EN'}
    </button>
  )
}

export function Header({ sidebarTrigger }: HeaderProps) {
  const t = useTranslations('common')
  const { user } = useAuth()

  return (
    <header
      className={cn(
        glass.navbar,
        'fixed top-0 inset-x-0 z-50 h-16'
      )}
      role="banner"
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left - optional sidebar trigger (mobile) + Logo */}
        <div className="flex items-center gap-2">
          {sidebarTrigger && (
            <div className="md:hidden">{sidebarTrigger}</div>
          )}
          <Logo size="md" />
        </div>

        {/* Center - Nav links (desktop) */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white',
                'hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200'
              )}
            >
              {t(labelKey)}
            </Link>
          ))}
        </nav>

        {/* Right - Theme toggle + Language switcher + Auth */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className={cn(
                  glass.button,
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white'
                )}
              >
                <LogIn className="h-4 w-4" />
                {t('signIn')}
              </Link>
              <Link
                href={ROUTES.signup}
                className={cn(
                  glass.buttonPrimary,
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 dark:text-white'
                )}
              >
                <UserPlus className="h-4 w-4" />
                {t('signUp')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger (public site nav) */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

function UserMenu({ user }: { user: NonNullable<ReturnType<typeof useAuth>['user']> }) {
  const logout = useAuthStore((s) => s.logout)
  const displayName = user.profile?.full_name ?? user.email ?? 'User'
  const dashboardHref = user.profile?.role === 'landlord' ? ROUTES.dashboard : ROUTES.renterDashboard

  return (
    <div className="flex items-center gap-2">
      <Link
        href={dashboardHref}
        className={cn(
          glass.button,
          'flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-white cursor-pointer'
        )}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 border border-brand-400/40">
          <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        </div>
        <span className="max-w-[120px] truncate text-gray-700 dark:text-white/80">
          {displayName}
        </span>
      </Link>
      <button
        onClick={logout}
        className={cn(
          glass.button,
          'flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
        )}
        aria-label="Sign out"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden lg:inline">Sign Out</span>
      </button>
    </div>
  )
}
