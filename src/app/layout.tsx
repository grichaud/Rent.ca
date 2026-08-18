export const metadata = {
  title: {
    template: '%s | Rent.ca',
    default: 'Find Your Next Home in Canada | Rent.ca',
  },
  description: 'Rent.ca - Find apartments, condos, houses and more for rent across Canada.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
