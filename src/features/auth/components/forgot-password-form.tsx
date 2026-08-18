'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Mail, ArrowLeft } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { requestPasswordReset } from '@/features/auth/services/auth-service'

export function ForgotPasswordForm() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')

    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address')
      return
    }

    setIsLoading(true)
    // We always show success regardless of whether the email exists (prevents enumeration)
    await requestPasswordReset(email, locale)
    setIsLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-brand-500/20 flex items-center justify-center">
          <Mail className="h-8 w-8 text-brand-400" />
        </div>
        <h1 className={cn('text-2xl font-bold mb-2', glassColors.text.primary)}>
          Check your email
        </h1>
        <p className={cn('text-sm mb-6', glassColors.text.secondary)}>
          If an account exists for <strong className="text-gray-900 dark:text-white">{email}</strong>, we&apos;ve
          sent a password reset link. Check your inbox and spam folder.
        </p>
        <Link
          href={ROUTES.login}
          className={cn(
            glass.buttonPrimary,
            'inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white'
          )}
        >
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className={cn('text-2xl font-bold mb-2', glassColors.text.primary)}>
        Reset your password
      </h1>
      <p className={cn('text-sm mb-6', glassColors.text.secondary)}>
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className={cn('block text-sm font-medium mb-1.5', glassColors.text.secondary)}
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/40" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
              }}
              placeholder="you@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'email-error' : undefined}
              className={cn(glass.input, 'w-full pl-10 pr-4 py-3 text-sm')}
            />
          </div>
          {emailError && (
            <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {emailError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            glass.buttonPrimary,
            'mt-2 flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-white',
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>

      <p className={cn('mt-6 text-center text-sm', glassColors.text.secondary)}>
        <Link
          href={ROUTES.login}
          className="inline-flex items-center gap-1.5 font-medium text-brand-400 hover:text-brand-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
      </p>
    </form>
  )
}
