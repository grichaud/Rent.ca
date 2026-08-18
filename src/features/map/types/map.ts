export interface MapMarker {
  id: string
  lat: number
  lng: number
  price: number
  title: string
  slug: string
  city: string
  imageUrl: string | null
  bedrooms: number
  bathrooms: number
  propertyType: string
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}
