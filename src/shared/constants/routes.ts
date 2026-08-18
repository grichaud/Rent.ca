/** All application routes */
export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // Public
  city: (city: string) => `/${city}` as const,
  listing: (city: string, slug: string) => `/${city}/${slug}` as const,
  landlords: '/landlords',
  rentReport: '/national-rent-report',
  blog: '/blog',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  terms: '/terms',
  privacy: '/privacy',

  // Landlord Management
  dashboard: '/landlord',
  listings: '/landlord/listings',
  newListing: '/landlord/listings/new',
  editListing: (id: string) => `/landlord/listings/${id}/edit` as const,
  landlordFavorites: '/landlord/favorites',
  inquiries: '/landlord/inquiries',
  account: '/landlord/account',

  // Renter Portal
  renterDashboard: '/renter',
  renterFavorites: '/renter/favorites',
  renterAlerts: '/renter/alerts',
  renterInquiries: '/renter/inquiries',
  renterAccount: '/renter/account',
} as const;
