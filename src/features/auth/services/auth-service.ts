import { createClient } from '@/lib/supabase/client'
import type { ApiResponse } from '@/shared/types/api'
import type { Profile, LandlordProfile, UserRole } from '@/shared/types/database'
import type { AuthUser, LoginCredentials, SignupCredentials } from '@/features/auth/types/auth'

/** Sign in with email and password */
export async function signIn(
  credentials: LoginCredentials
): Promise<ApiResponse<AuthUser>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      return { data: null, error: error.message }
    }

    if (!data.user) {
      return { data: null, error: 'No user returned after sign in' }
    }

    const profileResult = await getProfile(data.user.id)
    if (profileResult.error) {
      return { data: null, error: profileResult.error }
    }

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email ?? '',
      profile: profileResult.data?.profile ?? null,
      landlordProfile: profileResult.data?.landlordProfile ?? null,
    }

    return { data: authUser, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error during sign in'
    return { data: null, error: message }
  }
}

/** Register a new account with role stored in user metadata */
export async function signUp(
  credentials: SignupCredentials
): Promise<ApiResponse<AuthUser>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
          role: credentials.role,
        },
      },
    })

    if (error) {
      return { data: null, error: error.message }
    }

    if (!data.user) {
      return { data: null, error: 'No user returned after sign up' }
    }

    // Profile is created by the DB trigger from raw_user_meta_data.
    // Return a partial AuthUser — profile will be populated after email confirmation.
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email ?? '',
      profile: null,
      landlordProfile: null,
    }

    return { data: authUser, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error during sign up'
    return { data: null, error: message }
  }
}

/**
 * Sign in with Google OAuth.
 * The role is encoded in the redirectTo URL so the callback can assign it
 * to new users (since the OAuth flow navigates away from our app).
 */
export async function signInWithGoogle(
  role: UserRole = 'renter',
  locale = 'en'
): Promise<ApiResponse<null>> {
  try {
    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/${locale}/callback?role=${role}`,
      },
    })
    if (error) return { data: null, error: error.message }
    return { data: null, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error starting Google sign-in'
    return { data: null, error: message }
  }
}

/** Sign out the current user */
export async function signOut(): Promise<ApiResponse<null>> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: null, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error during sign out'
    return { data: null, error: message }
  }
}

/** Get the current Supabase session */
export async function getSession(): Promise<ApiResponse<AuthUser | null>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return { data: null, error: error.message }
    }

    if (!data.session?.user) {
      return { data: null, error: null }
    }

    const user = data.session.user
    const profileResult = await getProfile(user.id)

    if (profileResult.error) {
      return { data: null, error: profileResult.error }
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email ?? '',
      profile: profileResult.data?.profile ?? null,
      landlordProfile: profileResult.data?.landlordProfile ?? null,
    }

    return { data: authUser, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error fetching session'
    return { data: null, error: message }
  }
}

/** Fetch profile (and landlord_profile if applicable) for a given user id */
export async function getProfile(
  userId: string
): Promise<ApiResponse<{ profile: Profile; landlordProfile: LandlordProfile | null }>> {
  try {
    const supabase = createClient()

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      return { data: null, error: profileError.message }
    }

    if (!profile) {
      return { data: null, error: 'Profile not found' }
    }

    let landlordProfile: LandlordProfile | null = null

    if (profile.role === 'landlord') {
      const { data: lp, error: lpError } = await supabase
        .from('landlord_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (lpError && lpError.code !== 'PGRST116') {
        // PGRST116 = row not found — acceptable if landlord profile not yet created
        return { data: null, error: lpError.message }
      }

      landlordProfile = lp ?? null
    }

    return {
      data: { profile: profile as Profile, landlordProfile },
      error: null,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error fetching profile'
    return { data: null, error: message }
  }
}

/** Send a password reset email via Supabase */
export async function requestPasswordReset(
  email: string,
  locale = 'en'
): Promise<ApiResponse<null>> {
  try {
    const supabase = createClient()
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/${locale}/callback?next=/reset-password`,
    })
    if (error) return { data: null, error: error.message }
    return { data: null, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error sending reset email'
    return { data: null, error: message }
  }
}

/** Update the authenticated user's password (call after recovery session) */
export async function updatePassword(
  newPassword: string
): Promise<ApiResponse<null>> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { data: null, error: error.message }
    return { data: null, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error updating password'
    return { data: null, error: message }
  }
}

/** Update profile fields for a given user */
export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'phone' | 'avatar_url'>>
): Promise<ApiResponse<Profile>> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data as Profile, error: null }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error updating profile'
    return { data: null, error: message }
  }
}
