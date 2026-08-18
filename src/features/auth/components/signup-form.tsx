'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { RoleSelector } from '@/features/auth/components/role-selector'
import { signUp, signInWithGoogle } from '@/features/auth/services/auth-service'
import type { UserRole } from '@/shared/types/database'

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

interface FormState {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required'
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

export function SignupForm() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  const [values, setValues] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'renter',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleChange =
    (field: keyof Omit<FormState, 'role'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const handleRoleChange = (role: UserRole) => {
    setValues((prev) => ({ ...prev, role }))
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    const result = await signInWithGoogle(values.role, locale)
    if (result.error) {
      setErrors({ general: result.error })
      setIsLoading(false)
    }
    // On success the browser navigates to Google — no need to setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    const result = await signUp({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      role: values.role,
    })

    if (result.error) {
      setErrors({ general: result.error })
      setIsLoading(false)
      return
    }

    // If user has a confirmed session, go to dashboard; otherwise show confirmation message
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      router.push(ROUTES.dashboard)
    } else {
      setSignupSuccess(true)
      setIsLoading(false)
    }
  }

  if (signupSuccess) {
    return (
      <div className="text-center py-4">
        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Mail className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className={cn('text-2xl font-bold mb-2', glassColors.text.primary)}>
          Check your email
        </h1>
        <p className={cn('text-sm mb-6', glassColors.text.secondary)}>
          We sent a confirmation link to <strong className="text-gray-900 dark:text-white">{values.email}</strong>.
          Click the link to activate your account.
        </p>
        <Link
          href={ROUTES.login}
          className={cn(
            glass.buttonPrimary,
            'inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white'
          )}
        >
          Go to Sign In
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className={cn('text-2xl font-bold mb-2', glassColors.text.primary)}>
        Create your account
      </h1>
      <p className={cn('text-sm mb-6', glassColors.text.secondary)}>
        Join thousands of Canadians finding their next home
      </p>

      {/* Role selector */}
      <div className="mb-5">
        <p className={cn('text-sm font-medium mb-2', glassColors.text.secondary)}>
          I am...
        </p>
        <RoleSelector value={values.role} onChange={handleRoleChange} />
      </div>

      {/* Google sign-up */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className={cn(
          glass.button,
          'flex w-full items-center justify-center gap-3 py-3 text-sm font-medium text-gray-700 dark:text-white/90',
          'disabled:opacity-60 disabled:cursor-not-allowed'
        )}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-transparent px-3 text-gray-400 dark:text-white/40">or sign up with email</span>
        </div>
      </div>

      {/* General error */}
      {errors.general && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {errors.general}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className={cn('block text-sm font-medium mb-1.5', glassColors.text.secondary)}
          >
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/40" />
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={values.fullName}
              onChange={handleChange('fullName')}
              placeholder="Jane Smith"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={cn(glass.input, 'w-full pl-10 pr-4 py-3 text-sm')}
            />
          </div>
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
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
              value={values.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn(glass.input, 'w-full pl-10 pr-4 py-3 text-sm')}
            />
          </div>
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className={cn('block text-sm font-medium mb-1.5', glassColors.text.secondary)}
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/40" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange('password')}
              placeholder="Min. 8 characters"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={cn(glass.input, 'w-full pl-10 pr-12 py-3 text-sm')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className={cn('block text-sm font-medium mb-1.5', glassColors.text.secondary)}
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/40" />
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="Repeat your password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              className={cn(glass.input, 'w-full pl-10 pr-12 py-3 text-sm')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit */}
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
            <UserPlus className="h-4 w-4" />
          )}
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </div>

      <p className={cn('mt-6 text-center text-sm', glassColors.text.secondary)}>
        Already have an account?{' '}
        <Link
          href={ROUTES.login}
          className="font-medium text-brand-400 hover:text-brand-300 transition-colors underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
