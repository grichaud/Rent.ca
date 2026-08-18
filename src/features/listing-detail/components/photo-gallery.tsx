'use client'

import { useState } from 'react'
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { PropertyImage } from '@/shared/types/database'

interface PhotoGalleryProps {
  images: PropertyImage[]
  title: string
}

const GRADIENT_PLACEHOLDERS = [
  'from-brand-900 via-purple-900 to-slate-900',
  'from-cyan-900 via-teal-900 to-slate-900',
  'from-purple-900 via-indigo-900 to-slate-900',
  'from-blue-900 via-brand-900 to-slate-900',
  'from-teal-900 via-cyan-900 to-slate-900',
]

interface GallerySlotProps {
  image: PropertyImage | null
  index: number
  alt: string
  className?: string
  onClick: () => void
}

function GallerySlot({ image, index, alt, className, onClick }: GallerySlotProps) {
  const gradient = GRADIENT_PLACEHOLDERS[index % GRADIENT_PLACEHOLDERS.length]
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('relative overflow-hidden group cursor-pointer w-full h-full border-0 p-0', className)}
      aria-label={`View photo ${index + 1}: ${alt}`}
    >
      {image?.url ? (
        <img
          src={image.url}
          alt={image.alt_text ?? alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className={cn('w-full h-full bg-gradient-to-br', gradient)}>
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 25%, white 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </button>
  )
}

export function PhotoGallery({ images: rawImages, title }: PhotoGalleryProps) {
  const images = rawImages.slice().sort((a, b) => a.display_order - b.display_order)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const totalCount = Math.max(images.length, 5)

  function openAt(index: number) {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  function prev() {
    setCurrentIndex((i) => (i - 1 + totalCount) % totalCount)
  }

  function next() {
    setCurrentIndex((i) => (i + 1) % totalCount)
  }

  const currentImage = images[currentIndex] ?? null

  return (
    <>
      {/* Gallery grid */}
      <div
        className="w-full relative"
        role="region"
        aria-label="Property photo gallery"
      >
        <div className="h-[420px] md:h-[520px] grid grid-cols-4 grid-rows-2 gap-1">
          {/* Main image — spans 2 cols, 2 rows */}
          <div className="col-span-4 md:col-span-2 row-span-2 overflow-hidden md:rounded-l-2xl">
            <GallerySlot
              image={images[0] ?? null}
              index={0}
              alt={`${title} - main photo`}
              onClick={() => openAt(0)}
            />
          </div>

          {/* Thumbnails — 2x2 on desktop */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                'hidden md:block overflow-hidden',
                i === 2 && 'rounded-tr-2xl',
                i === 4 && 'rounded-br-2xl'
              )}
            >
              <GallerySlot
                image={images[i] ?? null}
                index={i}
                alt={`${title} - photo ${i + 1}`}
                onClick={() => openAt(i)}
              />
            </div>
          ))}
        </div>

        {/* View all button overlay */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            type="button"
            onClick={() => openAt(0)}
            className={cn(
              glass.button,
              'flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white'
            )}
            aria-label={`View all ${totalCount} photos`}
          >
            <Maximize2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            View all {totalCount} photos
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-0 overflow-hidden">
          <div className="relative w-full aspect-video">
            {currentImage?.url ? (
              <img
                src={currentImage.url}
                alt={currentImage.alt_text ?? title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div
                className={cn(
                  'w-full h-full bg-gradient-to-br',
                  GRADIENT_PLACEHOLDERS[currentIndex % GRADIENT_PLACEHOLDERS.length]
                )}
              />
            )}

            {/* Prev/Next controls */}
            <button
              type="button"
              onClick={prev}
              className={cn(glass.button, 'absolute left-3 top-1/2 -translate-y-1/2 p-2')}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className={cn(glass.button, 'absolute right-3 top-1/2 -translate-y-1/2 p-2')}
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6 text-white" aria-hidden="true" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className={cn(glass.badge, 'text-white/70 text-xs')}>
                {currentIndex + 1} / {totalCount}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
