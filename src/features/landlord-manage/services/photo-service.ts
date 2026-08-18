import { createClient } from '@/lib/supabase/client'

const BUCKET = 'property-images'

export interface UploadedPhoto {
  storageUrl: string
  category: string
  displayOrder: number
  isPrimary: boolean
}

/** Upload a single file to Supabase Storage under {userId}/{propertyId}/{filename} */
export async function uploadPhoto(
  file: File,
  userId: string,
  propertyId: string
): Promise<{ url: string; error: string | null }> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const uniqueName = `${crypto.randomUUID()}.${ext}`
  const path = `${userId}/${propertyId}/${uniqueName}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return { url: '', error: error.message }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: urlData.publicUrl, error: null }
}

/** Delete a file from Supabase Storage given its full public URL */
export async function deleteStorageFile(publicUrl: string): Promise<void> {
  const supabase = createClient()
  // Extract path from URL: .../storage/v1/object/public/property-images/userId/propId/file.jpg
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return
  const path = publicUrl.slice(idx + marker.length)
  await supabase.storage.from(BUCKET).remove([path])
}

/** Save photo records to property_images table (replaces all existing) */
export async function savePropertyPhotos(
  propertyId: string,
  photos: UploadedPhoto[]
): Promise<{ error: string | null }> {
  const supabase = createClient()

  // Delete existing records
  await supabase.from('property_images').delete().eq('property_id', propertyId)

  if (photos.length === 0) return { error: null }

  const rows = photos.map((p) => ({
    property_id: propertyId,
    url: p.storageUrl,
    category: p.category.toLowerCase(),
    display_order: p.displayOrder,
    is_primary: p.isPrimary,
    alt_text: null,
  }))

  const { error } = await supabase.from('property_images').insert(rows)
  return { error: error?.message ?? null }
}

/** Load existing photos for a property from the DB */
export async function loadPropertyPhotos(propertyId: string): Promise<{
  id: string
  url: string
  category: string
  displayOrder: number
  isPrimary: boolean
}[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('property_images')
    .select('id, url, category, display_order, is_primary')
    .eq('property_id', propertyId)
    .order('display_order')

  return (data ?? []).map((row) => ({
    id: row.id,
    url: row.url,
    category: row.category ?? 'exterior',
    displayOrder: row.display_order,
    isPrimary: row.is_primary,
  }))
}
