'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, Phone, Lock, Eye, EyeOff, Save } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { useAuthStore } from '@/features/auth/store/auth-store'
import {
  getRenterProfile,
  saveRenterProfile,
  type RenterProfile,
} from '@/features/renter-portal/services/renter-service'
import { changePassword } from '@/features/landlord-manage/services/landlord-service'

export default function RenterAccountPage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<RenterProfile>({ fullName: '', phone: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPw, setShowNewPw] = useState(false)
  const [isSavingPw, setIsSavingPw] = useState(false)
  const [pwMessage, setPwMessage] = useState('')

  const load = useCallback(async () => {
    if (!user?.id) return
    const data = await getRenterProfile(user.id)
    setProfile(data)
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.id) return
    setIsSaving(true)
    const result = await saveRenterProfile(user.id, profile)
    setSaveMessage(result.error ?? 'Profile saved successfully')
    setIsSaving(false)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPwMessage('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setPwMessage('Password must be at least 8 characters')
      return
    }
    setIsSavingPw(true)
    const result = await changePassword(newPassword)
    setPwMessage(result.error ?? 'Password updated successfully')
    setIsSavingPw(false)
    if (!result.error) {
      setNewPassword('')
      setConfirmPassword('')
    }
    setTimeout(() => setPwMessage(''), 4000)
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-lg">
        <div className="h-7 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        <div className={cn(glass.card, 'p-6 space-y-4')}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const isPasswordSection = true // show for all; Google users will get a graceful error from Supabase

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Account</h1>
        <p className={cn('mt-1 text-sm', glassColors.text.secondary)}>
          Manage your profile and settings
        </p>
      </div>

      {/* Email (read-only) */}
      <div className={cn(glass.card, 'p-5')}>
        <p className={cn('text-xs font-medium mb-1', glassColors.text.muted)}>Email address</p>
        <p className="text-gray-900 dark:text-white text-sm">{user?.email}</p>
        <p className={cn('text-xs mt-1', glassColors.text.muted)}>Email cannot be changed</p>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSaveProfile} className={cn(glass.card, 'p-6 space-y-4')}>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400 dark:text-white/50" /> Personal Info
        </h2>

        <div>
          <label className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
            Full Name
          </label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Your full name"
            className={cn(glass.input, 'w-full px-4 py-3 text-sm')}
          />
        </div>

        <div>
          <label className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
            <Phone className="inline h-3 w-3 mr-1" />
            Phone <span className="text-gray-400 dark:text-white/30">(optional)</span>
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            placeholder="(416) 555-0100"
            className={cn(glass.input, 'w-full px-4 py-3 text-sm')}
          />
        </div>

        {saveMessage && (
          <p className={cn('text-sm', saveMessage.includes('error') || saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400')}>
            {saveMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            glass.buttonPrimary,
            'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {isSaving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Password section (only for non-OAuth accounts) */}
      {isPasswordSection && (
        <form onSubmit={handleChangePassword} className={cn(glass.card, 'p-6 space-y-4')}>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-400 dark:text-white/50" /> Change Password
          </h2>

          <div>
            <label className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className={cn(glass.input, 'w-full px-4 py-3 pr-12 text-sm')}
              />
              <button
                type="button"
                onClick={() => setShowNewPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70"
              >
                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className={cn(glass.input, 'w-full px-4 py-3 text-sm')}
            />
          </div>

          {pwMessage && (
            <p className={cn('text-sm', pwMessage.includes('error') || pwMessage.includes('match') ? 'text-red-400' : 'text-green-400')}>
              {pwMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSavingPw || !newPassword || !confirmPassword}
            className={cn(
              glass.buttonPrimary,
              'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
          >
            {isSavingPw ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {isSavingPw ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  )
}
