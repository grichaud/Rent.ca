import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const LOCALES = ['en', 'fr']

// Routes that require authentication
const LANDLORD_ROUTES = ['/landlord']
const RENTER_ROUTES = ['/renter']

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = intlMiddleware(request)

  const pathname = request.nextUrl.pathname
  const segments = pathname.split('/')
  const locale = segments[1]

  if (!LOCALES.includes(locale)) {
    return response
  }

  const pagePath = '/' + segments.slice(2).join('/')

  const isLandlordRoute = LANDLORD_ROUTES.some((r) => pagePath === r || pagePath.startsWith(r + '/'))
  const isRenterRoute = RENTER_ROUTES.some((r) => pagePath === r || pagePath.startsWith(r + '/'))

  if (!isLandlordRoute && !isRenterRoute) {
    return response
  }

  // Lightweight cookie check — no Supabase client, no network calls.
  // Full auth + role validation happens in the (manage) and (renter) layouts client-side.
  // Supabase stores auth in cookies like: sb-{ref}-auth-token or chunked as sb-{ref}-auth-token.0
  const hasAuthCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.includes('-auth-token')
  )

  if (!hasAuthCookie) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
