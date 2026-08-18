'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Home, Building2, Info, Phone, LogIn, UserPlus, LogOut, User, Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Logo } from '@/shared/components/logo'
import { ThemeToggle } from '@/shared/components/theme-toggle'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { useAuth } from '@/features/auth/hooks/use-auth'

const navLinks = [
  { href: ROUTES.home, labelKey: 'rent', icon: Home },
  { href: ROUTES.landlords, labelKey: 'landlords', icon: Building2 },
  { href: ROUTES.about, labelKey: 'about', icon: Info },
  { href: ROUTES.contact, labelKey: 'contact', icon: Phone },
]

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function switchLocale() {
    const newLocale = locale === 'en' ? 'fr' : 'en'
    router.replace(pathname, { locale: newLocale })
  }

  if (!mounted) {
    return (
      <button
        className={cn(
          glass.button,
          'flex items-center justify-center p-2',
          className
        )}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-white" />
      </button>
    )
  }

  return (
    <Sheet>
      <SheetTrigger
        className={cn(
          glass.button,
          'flex items-center justify-center p-2',
          className
        )}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-white" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-72 border-gray-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-0"
      >
        {/* Highlight line */}
        <div className={glass.highlight} />

        <SheetHeader className="p-6 pb-4 border-b border-gray-200 dark:border-white/10">
          <SheetTitle asChild>
            <Logo size="md" />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {navLinks.map(({ href, labelKey, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3',
                'text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white',
                'hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="font-medium">{t(labelKey)}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 pt-2 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2 mt-2">
          {/* Theme + Language switchers */}
          <div className="flex gap-2">
            <ThemeToggle />
            <button
              onClick={switchLocale}
              aria-label={locale === 'en' ? 'Switch to French' : 'Passer en anglais'}
              className={cn(
                glass.button,
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-gray-700 dark:text-white font-medium'
              )}
            >
              <Languages className="h-4 w-4" />
              {locale === 'en' ? 'Français' : 'English'}
            </button>
          </div>

          {user ? (
            <>
              <div className={cn(glass.base, 'flex items-center gap-2 px-4 py-3')}>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/20 border border-brand-400/40 shrink-0">
                  <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </div>
                <span className={cn('text-sm font-medium truncate', glassColors.text.primary)}>
                  {user.profile?.full_name ?? user.email}
                </span>
              </div>
              <button
                onClick={logout}
                className={cn(
                  glass.button,
                  'flex items-center justify-center gap-2 px-4 py-3 text-gray-700 dark:text-white font-medium w-full'
                )}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className={cn(
                  glass.button,
                  'flex items-center justify-center gap-2 px-4 py-3 text-gray-700 dark:text-white font-medium'
                )}
              >
                <LogIn className="h-4 w-4" />
                {t('signIn')}
              </Link>
              <Link
                href={ROUTES.signup}
                className={cn(
                  glass.buttonPrimary,
                  'flex items-center justify-center gap-2 px-4 py-3 text-gray-800 dark:text-white font-medium'
                )}
              >
                <UserPlus className="h-4 w-4" />
                {t('signUp')}
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
