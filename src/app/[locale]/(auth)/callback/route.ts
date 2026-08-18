import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/shared/constants/routes'

/**
 * Supabase auth callback handler.
 * Exchanges the one-time `code` for a persistent session, then redirects the
 * user to the appropriate page based on their role.
 *
 * For Google OAuth signups, `role` is encoded in the redirectTo URL by signInWithGoogle().
 * The handler reads it and corrects the profile if the DB trigger defaulted to 'renter'.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? ROUTES.home
  const roleParam = searchParams.get('role')

  if (!code) {
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=missing_code`)
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth/callback] exchange error:', error.message)
      return NextResponse.redirect(`${origin}${ROUTES.login}?error=exchange_failed`)
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(`${origin}${ROUTES.login}?error=no_user`)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // If a role was passed in the OAuth redirect URL (new Google signup),
    // update the profile when the trigger defaulted to 'renter' but user chose 'landlord'.
    if (roleParam === 'landlord' && profile?.role !== 'landlord') {
      await supabase
        .from('profiles')
        .update({ role: 'landlord' })
        .eq('id', user.id)

      // Ensure landlord_profile row exists
      await supabase
        .from('landlord_profiles')
        .upsert({ id: user.id }, { onConflict: 'id' })

      // Treat as landlord for this redirect
      return NextResponse.redirect(`${origin}${ROUTES.dashboard}`)
    }

    // If `next` is explicitly set (e.g. /reset-password from password reset flow), respect it.
    // Otherwise apply role-based routing: landlords → dashboard, renters → home.
    const isExplicitRedirect = next !== ROUTES.home
    const destination = isExplicitRedirect ? next : (profile?.role === 'landlord' ? ROUTES.dashboard : ROUTES.home)
    return NextResponse.redirect(`${origin}${destination}`)
  } catch (err) {
    console.error('[auth/callback] unexpected error:', err)
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=server_error`)
  }
}
