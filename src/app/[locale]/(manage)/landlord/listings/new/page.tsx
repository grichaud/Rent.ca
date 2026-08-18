'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { BasicInfoStep, type BasicInfoData } from '@/features/landlord-manage/components/listing-form/basic-info-step'
import { UnitsStep, type UnitData } from '@/features/landlord-manage/components/listing-form/units-step'
import { AmenitiesStep, type AmenityId } from '@/features/landlord-manage/components/listing-form/amenities-step'
import { PhotosStep, type PhotoData } from '@/features/landlord-manage/components/listing-form/photos-step'
import { ReviewStep } from '@/features/landlord-manage/components/listing-form/review-step'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createListing } from '@/features/landlord-manage/services/landlord-service'
import { uploadPhoto, savePropertyPhotos } from '@/features/landlord-manage/services/photo-service'
import { useAuthStore } from '@/features/auth/store/auth-store'

const STEPS = [
  { label: 'Basic Info', shortLabel: '1' },
  { label: 'Units', shortLabel: '2' },
  { label: 'Amenities', shortLabel: '3' },
  { label: 'Photos', shortLabel: '4' },
  { label: 'Review', shortLabel: '5' },
]

const DEFAULT_BASIC_INFO: BasicInfoData = {
  title: '', description: '', propertyType: '', street: '', city: '',
  province: '', postalCode: '', neighbourhood: '', leaseTerm: '',
  isPetFriendly: false, isFurnished: false, parkingType: 'None',
  yearBuilt: '', totalFloors: '',
}

function createDefaultUnit(): UnitData {
  return {
    id: crypto.randomUUID(),
    name: '', bedrooms: '1', bathrooms: '1', squareFeet: '',
    price: '', availableUnits: '1', availableDate: '',
  }
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <nav aria-label="Form steps" className="mb-8">
      <ol className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((step, index) => {
          const state = index < current ? 'done' : index === current ? 'active' : 'upcoming'
          return (
            <li key={step.label} className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex items-center gap-2 shrink-0">
                <div
                  aria-current={state === 'active' ? 'step' : undefined}
                  className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300',
                    state === 'done' && 'bg-brand-500/30 border-brand-500/50 text-brand-400',
                    state === 'active' && 'bg-brand-500/30 border-brand-400 text-gray-900 dark:text-white shadow-md shadow-brand-500/30',
                    state === 'upcoming' && 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/15 text-gray-400 dark:text-white/40'
                  )}
                >
                  {state === 'done' ? '✓' : index + 1}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium hidden sm:block',
                    state === 'active' ? 'text-gray-900 dark:text-white' : state === 'done' ? 'text-gray-500 dark:text-white/60' : glassColors.text.muted
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < total - 1 && (
                <div
                  className={cn(
                    'flex-1 h-px min-w-[12px]',
                    index < current ? 'bg-brand-500/40' : 'bg-gray-200 dark:bg-white/10'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default function NewListingPage() {
  const router = useRouter()
  const locale = useLocale()
  const user = useAuthStore((s) => s.user)
  const [currentStep, setCurrentStep] = useState(0)
  const [basicInfo, setBasicInfo] = useState<BasicInfoData>(DEFAULT_BASIC_INFO)
  const [units, setUnits] = useState<UnitData[]>([createDefaultUnit()])
  const [amenities, setAmenities] = useState<AmenityId[]>([])
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function goNext() {
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  function goPrev() {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  async function submitListing(status: 'active' | 'draft') {
    if (!user?.id) return
    setIsSubmitting(true)
    setSubmitError(null)

    // 1. Create the listing
    const { id, error } = await createListing({
      landlordId: user.id,
      basicInfo,
      units,
      amenityIds: amenities,
      status,
    })
    if (error || !id) {
      setIsSubmitting(false)
      setSubmitError(error ?? 'Failed to create listing')
      return
    }

    // 2. Upload photos to Storage + save records
    if (photos.length > 0) {
      const uploaded = []
      for (const photo of photos) {
        if (photo.file) {
          const res = await uploadPhoto(photo.file, user.id, id)
          if (res.error) {
            setIsSubmitting(false)
            setSubmitError(`Photo upload failed: ${res.error}`)
            return
          }
          uploaded.push({
            storageUrl: res.url,
            category: photo.category.toLowerCase(),
            displayOrder: photo.displayOrder,
            isPrimary: photo.isPrimary,
          })
        }
      }
      if (uploaded.length > 0) {
        const saveRes = await savePropertyPhotos(id, uploaded)
        if (saveRes.error) {
          setIsSubmitting(false)
          setSubmitError(`Photo save failed: ${saveRes.error}`)
          return
        }
      }
    }

    setIsSubmitting(false)
    window.location.href = `/${locale}/landlord/listings`
  }

  async function handlePublish() {
    await submitListing('active')
  }

  async function handleSaveDraft() {
    await submitListing('draft')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Listing</h1>
        <p className={cn('text-sm mt-1', glassColors.text.muted)}>
          Fill in your property details step by step.
        </p>
      </div>

      <StepIndicator current={currentStep} total={STEPS.length} />

      {/* Step content */}
      <div className={cn(glass.card, 'p-6 mb-6')}>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">
          {STEPS[currentStep].label}
        </h2>

        {currentStep === 0 && (
          <BasicInfoStep data={basicInfo} onChange={setBasicInfo} />
        )}
        {currentStep === 1 && (
          <UnitsStep units={units} onChange={setUnits} />
        )}
        {currentStep === 2 && (
          <AmenitiesStep selected={amenities} onChange={setAmenities} />
        )}
        {currentStep === 3 && (
          <PhotosStep photos={photos} onChange={setPhotos} />
        )}
        {currentStep === 4 && (
          <ReviewStep
            basicInfo={basicInfo}
            units={units}
            amenities={amenities}
            photos={photos}
            onEditStep={setCurrentStep}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}
      </div>

      {/* Navigation */}
      {currentStep < STEPS.length - 1 && (
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentStep === 0}
            className={cn(
              glass.button,
              'flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-white/70',
              currentStep === 0 && 'opacity-40 pointer-events-none'
            )}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            className={cn(
              glass.buttonPrimary,
              'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white'
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
