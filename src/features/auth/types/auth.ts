import type { Profile, LandlordProfile, UserRole } from '@/shared/types/database'

/** Authenticated user with hydrated profile data */
export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
  landlordProfile: LandlordProfile | null
}

/** Credentials for email/password login */
export interface LoginCredentials {
  email: string
  password: string
}

/** Credentials for new account registration */
export interface SignupCredentials {
  email: string
  password: string
  fullName: string
  role: UserRole
}

/** Shape of the auth slice in Zustand */
export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}
