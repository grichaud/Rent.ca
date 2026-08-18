'use client'

import { useState, useRef } from 'react'
import { Upload, X, Star, StarOff, ImageIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

export interface PhotoData {
  id: string
  /** blob: URL for new uploads, or https:// URL for existing DB images */
  previewUrl: string
  fileName: string
  isPrimary: boolean
  category: string
  displayOrder: number
  /** The File object for new uploads — undefined for existing DB images */
  file?: File
  /** The storage URL for images already saved in DB */
  storageUrl?: string
}

interface PhotosStepProps {
  photos: PhotoData[]
  onChange: (photos: PhotoData[]) => void
}

const PHOTO_CATEGORIES = ['Exterior', 'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Other']

/** Capitalize first letter of each word for display */
function displayCategory(cat: string): string {
  return cat.replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Find matching category from PHOTO_CATEGORIES (case-insensitive) */
function normalizeCategory(cat: string): string {
  const found = PHOTO_CATEGORIES.find((c) => c.toLowerCase() === cat.toLowerCase())
  return found ?? 'Other'
}

export function PhotosStep({ photos, onChange }: PhotosStepProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    const newPhotos: PhotoData[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file, i) => ({
        id: crypto.randomUUID(),
        previewUrl: URL.createObjectURL(file),
        fileName: file.name,
        isPrimary: photos.length === 0 && i === 0,
        category: 'Exterior',
        displayOrder: photos.length + i + 1,
        file,
      }))
    onChange([...photos, ...newPhotos])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function removePhoto(id: string) {
    const updated = photos.filter((p) => p.id !== id)
    if (updated.length > 0 && !updated.some((p) => p.isPrimary)) {
      updated[0].isPrimary = true
    }
    onChange(updated)
  }

  function setPrimary(id: string) {
    onChange(photos.map((p) => ({ ...p, isPrimary: p.id === id })))
  }

  function updateCategory(id: string, category: string) {
    onChange(photos.map((p) => (p.id === id ? { ...p, category } : p)))
  }

  function updateOrder(id: string, order: string) {
    const num = parseInt(order, 10)
    if (!isNaN(num)) {
      onChange(photos.map((p) => (p.id === id ? { ...p, displayOrder: num } : p)))
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <p className={cn('text-sm', glassColors.text.secondary)}>
        Upload photos of your property. The primary image will be shown as the cover photo.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload photos by clicking or dragging"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-brand-400 bg-brand-500/10'
            : 'border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/40 hover:bg-gray-100 dark:hover:bg-white/10'
        )}
      >
        <Upload className={cn('h-8 w-8 mx-auto mb-3', isDragging ? 'text-brand-400' : 'text-gray-300 dark:text-white/30')} />
        <p className="text-sm font-medium text-gray-600 dark:text-white/70">
          {isDragging ? 'Drop photos here' : 'Click or drag photos to upload'}
        </p>
        <p className={cn('text-xs mt-1', glassColors.text.muted)}>PNG, JPG, WEBP up to 10MB each</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-hidden="true"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {photos
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((photo) => (
              <div key={photo.id} className={cn(glass.card, 'overflow-hidden')}>
                {/* Preview */}
                <div className="relative aspect-video bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt={photo.fileName}
                    className="w-full h-full object-cover"
                  />
                  {photo.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-500/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" /> Primary
                    </div>
                  )}
                  {/* Existing image badge */}
                  {photo.storageUrl && (
                    <div className="absolute bottom-2 left-2 bg-green-500/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-white font-medium">
                      Saved
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    aria-label="Remove photo"
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-red-500/80 backdrop-blur-sm border border-white/20 transition-colors"
                  >
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>

                {/* Controls */}
                <div className="p-3 flex flex-col gap-2">
                  <p className={cn('text-xs truncate', glassColors.text.muted)}>{photo.fileName}</p>
                  <div className="flex gap-2">
                    <select
                      value={normalizeCategory(photo.category)}
                      onChange={(e) => updateCategory(photo.id, e.target.value)}
                      aria-label="Photo category"
                      className={cn(glass.input, 'flex-1 text-xs px-2 py-1.5 appearance-none [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-white')}
                    >
                      {PHOTO_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{displayCategory(cat)}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={photo.displayOrder}
                      onChange={(e) => updateOrder(photo.id, e.target.value)}
                      aria-label="Display order"
                      title="Display order"
                      className={cn(glass.input, 'w-14 text-xs px-2 py-1.5 text-center')}
                    />
                    <button
                      type="button"
                      onClick={() => setPrimary(photo.id)}
                      aria-label={photo.isPrimary ? 'Primary photo' : 'Set as primary'}
                      title={photo.isPrimary ? 'Primary photo' : 'Set as primary'}
                      className={cn(
                        'p-1.5 rounded-lg border transition-colors',
                        photo.isPrimary
                          ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                          : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/15 text-gray-400 dark:text-white/40 hover:text-yellow-400'
                      )}
                    >
                      {photo.isPrimary ? <Star className="h-3.5 w-3.5 fill-current" /> : <StarOff className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className={cn(glass.base, 'p-8 text-center')}>
          <ImageIcon className="h-10 w-10 text-gray-300 dark:text-white/20 mx-auto mb-2" />
          <p className={cn('text-sm', glassColors.text.muted)}>No photos uploaded yet</p>
        </div>
      )}
    </div>
  )
}
