'use client'

import { useState, useEffect } from 'react'
import { User, Building2, Globe, Phone, Lock, Save } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { useAuthStore } from '@/features/auth/store/auth-store'
import {
  getLandlordProfile,
  saveLandlordProfile,
  changePassword,
  type LandlordProfile,
} from '@/features/landlord-manage/services/landlord-service'

interface PasswordForm {
  newPassword: string
  confirmPassword: string
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className={cn(glass.card, 'p-6')}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8 w-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-brand-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={cn('block text-sm font-medium mb-1.5', glassColors.text.secondary)}>
      {children}
    </label>
  )
}

const EMPTY_PROFILE: LandlordProfile = {
  fullName: '',
  phone: '',
  companyName: '',
  website: '',
  description: '',
}

export default function AccountPage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<LandlordProfile>(EMPTY_PROFILE)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileStatus, setProfileStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [profileError, setProfileError] = useState('')

  const [passwords, setPasswords] = useState<PasswordForm>({ newPassword: '', confirmPassword: '' })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (!user?.id) return
    getLandlordProfile(user.id).then((data) => {
      setProfile(data)
      setIsLoadingProfile(false)
    })
  }, [user?.id])

  const inputCls = cn(glass.input, 'w-full px-4 py-2.5 text-sm')

  async function handleProfileSave() {
    if (!user?.id) return
    setProfileSaving(true)
    setProfileStatus('idle')
    const { error } = await saveLandlordProfile(user.id, profile)
    setProfileSaving(false)
    if (error) {
      setProfileError(error)
      setProfileStatus('error')
    } else {
      setProfileStatus('saved')
      setTimeout(() => setProfileStatus('idle'), 2500)
    }
  }

  async function handlePasswordSave() {
    setPasswordError('')
    setPasswordStatus('idle')
    if (passwords.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      setPasswordStatus('error')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Passwords do not match')
      setPasswordStatus('error')
      return
    }
    setPasswordSaving(true)
    const { error } = await changePassword(passwords.newPassword)
    setPasswordSaving(false)
    if (error) {
      setPasswordError(error)
      setPasswordStatus('error')
    } else {
      setPasswordStatus('saved')
      setPasswords({ newPassword: '', confirmPassword: '' })
      setTimeout(() => setPasswordStatus('idle'), 2500)
    }
  }

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className={cn('text-sm mt-1', glassColors.text.muted)}>
          Manage your profile and security settings.
        </p>
      </div>

      {/* Profile */}
      <SectionCard title="Profile" icon={User}>
        {isLoadingProfile ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {profileStatus === 'error' && (
              <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {profileError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/30" />
                  <input
                    id="fullName" type="text" value={profile.fullName}
                    onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                    className={cn(inputCls, 'pl-10')}
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/30" />
                  <input
                    id="phone" type="tel" value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className={cn(inputCls, 'pl-10')}
                  />
                </div>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="companyName">Company / Business Name</FieldLabel>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/30" />
                <input
                  id="companyName" type="text" value={profile.companyName}
                  onChange={(e) => setProfile((p) => ({ ...p, companyName: e.target.value }))}
                  className={cn(inputCls, 'pl-10')}
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/30" />
                <input
                  id="website" type="url" placeholder="https://yourwebsite.com"
                  value={profile.website}
                  onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                  className={cn(inputCls, 'pl-10')}
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="description">About / Bio</FieldLabel>
              <textarea
                id="description" rows={3}
                placeholder="Tell renters about yourself or your company..."
                value={profile.description}
                onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                className={cn(inputCls, 'resize-none')}
              />
            </div>

            <button
              type="button"
              onClick={handleProfileSave}
              disabled={profileSaving}
              className={cn(
                glass.buttonPrimary,
                'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white self-start',
                'disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {profileSaving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {profileSaving ? 'Saving...' : profileStatus === 'saved' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        )}
      </SectionCard>

      {/* Password */}
      <SectionCard title="Change Password" icon={Lock}>
        <div className="flex flex-col gap-4">
          {passwordStatus === 'error' && (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {passwordError}
            </div>
          )}
          {passwordStatus === 'saved' && (
            <div role="status" className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              Password updated successfully.
            </div>
          )}

          <div>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/30" />
              <input
                id="newPassword" type="password" placeholder="Min. 8 characters"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                className={cn(inputCls, 'pl-10')}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-white/30" />
              <input
                id="confirmPassword" type="password" placeholder="Repeat your password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                className={cn(inputCls, 'pl-10')}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handlePasswordSave}
            disabled={passwordSaving}
            className={cn(
              glass.button,
              'flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-white/80 self-start',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
          >
            {passwordSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
