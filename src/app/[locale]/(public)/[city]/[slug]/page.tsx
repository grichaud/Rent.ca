import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PhotoGallery } from '@/features/listing-detail/components/photo-gallery'
import { ListingHeader } from '@/features/listing-detail/components/listing-header'
import { RentSpecialBanner } from '@/features/listing-detail/components/rent-special-banner'
import { ListingTabs } from '@/features/listing-detail/components/listing-tabs'
import { ListingSidebar } from '@/features/listing-detail/components/listing-sidebar'
import { SimilarRentals } from '@/features/listing-detail/components/similar-rentals'
import { getPropertyBySlug, getSimilarProperties } from '@/features/properties/services/property-service.server'

interface ListingPageProps {
  params: Promise<{ city: string; slug: string }>
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { city, slug } = await params
  const property = await getPropertyBySlug(slug)
  const cityFormatted = city.charAt(0).toUpperCase() + city.slice(1)

  if (!property) {
    return { title: `Listing Not Found - ${cityFormatted} | Rent.ca` }
  }

  return {
    title: `${property.title} - ${cityFormatted} | Rent.ca`,
    description: property.description?.slice(0, 155) ?? `Rental listing in ${cityFormatted}`,
    openGraph: {
      title: `${property.title} | Rent.ca`,
      description: `Rental listing in ${cityFormatted}, ${property.province}`,
      type: 'website',
    },
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { city, slug } = await params
  const property = await getPropertyBySlug(slug)
  if (!property) notFound()

  const similarProperties = await getSimilarProperties(property, 4)

  return (
    <article aria-label={`Listing: ${property.title}`}>
      {/* Full-width photo gallery */}
      <PhotoGallery images={property.images} title={property.title} />

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <ListingHeader property={property} />

          {/* Rent special banner */}
          {property.rent_special && (
            <RentSpecialBanner
              title={property.rent_special.title}
              description={property.rent_special.description}
            />
          )}

          {/* Two-column layout: main content + sidebar */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Main content */}
            <main className="flex-1 min-w-0">
              <ListingTabs property={property} />
            </main>

            {/* Sticky sidebar */}
            <div className="w-full lg:w-96 shrink-0">
              <ListingSidebar
                propertyId={property.id}
                propertyTitle={property.title}
                city={property.city}
                landlordPhone={null}
                landlord={property.landlord}
              />
            </div>
          </div>

          {/* Similar rentals carousel */}
          <SimilarRentals cards={similarProperties} />
        </div>
      </div>
    </article>
  )
}
