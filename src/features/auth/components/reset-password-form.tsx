'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { updatePassword } from '@/features/auth/services/auth-service'
import { createClient } from '@/lib/supabase/client'

interface FormState {
  password: string
  confirm: string
}

interface FormErrors {
  password?: string
  confirm?: string
  general?: string
}

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!values.password) {
    errors.password = 'Password is required'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }
  if (!values.confirm) {
    errors.confirm = 'Please confirm your password'
  } else if (values.password !== values.confirm) {
    errors.confirm = 'Passwords do not match'
  }
  return errors
}

export function ResetPasswordForm() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [values, setValues] = useState<FormState>({ password: '', confirm: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then((result) => {
      setHasSession(!!result.data.session)
    })
  }, [])

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
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

    const result = await updatePassword(values.password)

    if (result.error) {
      setErrors({ general: result.error })
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push(ROUTES.login), 3000)
  }

  // Loading state while we check for session
  if (hasSession === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 dark:border-white/20 border-t-gray-500 dark:border-t-white/80" />
      </div>
    )
  }

  // No recovery session — link expired or invalid
  if (!hasSession) {
    return (
      <div className="text-center py-4">
        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className={cn('text-2xl font-bold mb-2', glassColors.text.primary)}>
          Link expired
        </h1>
        <p className={cn('text-sm mb-6', glassColors.text.secondary)}>
          This password reset link has expired or is invalid.
          Please request a new one.
        </p>
        <Link
          href={ROUTES.forgotPassword}
          className={cn(
            glass.buttonPrimary,
            'inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white'
          )}
        >
          Request new link
        </Link>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="text-center py-4">
        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>
        <h1 className={cn('text-2xl font-bold mb-2', glassColors.text.primary)}>
          Password updated
        </h1>
        <p className={cn('text-sm mb-6', glassColors.text.secondary)}>
          Your password has been changed successfully.
          Redirecting you to sign in&hellip;
        </p>
        <Link
          href={ROUTES.login}
          className={cn(
            glass.buttonPrimary,
            'inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white'
          )}
        >
          Sign In now
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className={cn('text-2xl font-bold mb-2', glassColors.text.primary)}>
        Choose a new password
      </h1>
      <p className={cn('text-sm mb-6', glassColors.text.secondary)}>
        Enter a new password for your account. Must be at least 8 characters.
      </p>

      {errors.general && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {errors.general}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* New password */}
        <div>
          <label
            htmlFor="password"
            className={cn('block text-sm font-medium mb-1.5', glassColors.text.secondary)}
          >
            New password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/40" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
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

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirm"
            className={cn('block text-sm font-medium mb-1.5', glassColors.text.secondary)}
          >
            Confirm new password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/40" />
            <input
              id="confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={values.confirm}
              onChange={handleChange('confirm')}
              placeholder="••••••••"
              aria-invalid={!!errors.confirm}
              aria-describedby={errors.confirm ? 'confirm-error' : undefined}
              className={cn(glass.input, 'w-full pl-10 pr-12 py-3 text-sm')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm && (
            <p id="confirm-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {errors.confirm}
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
            <Lock className="h-4 w-4" />
          )}
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  )
}
