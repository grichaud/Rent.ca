import { Pencil, MapPin, BedDouble, ImageIcon, Sparkles, Save } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import type { BasicInfoData } from './basic-info-step'
import type { UnitData } from './units-step'
import type { AmenityId } from './amenities-step'
import type { PhotoData } from './photos-step'

interface ReviewStepProps {
  basicInfo: BasicInfoData
  units: UnitData[]
  amenities: AmenityId[]
  photos: PhotoData[]
  onEditStep: (step: number) => void
  onPublish: () => void
  onSaveDraft: () => void
  isSubmitting?: boolean
  submitError?: string | null
  /** 'new' = creating listing, 'edit' = editing existing. Controls button labels. */
  mode?: 'new' | 'edit'
  /** Current listing status — only relevant in edit mode */
  currentStatus?: string
}

function SectionHeader({ title, step, onEdit }: { title: string; step: number; onEdit: (s: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className={cn('flex items-center gap-1.5 text-xs', glassColors.text.accent, 'hover:text-brand-300 transition-colors')}
      >
        <Pencil className="h-3 w-3" /> Edit
      </button>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <span className={cn('text-xs shrink-0 w-28', glassColors.text.muted)}>{label}</span>
      <span className="text-xs text-gray-700 dark:text-white/80">{value}</span>
    </div>
  )
}

export function ReviewStep({
  basicInfo, units, amenities, photos, onEditStep,
  onPublish, onSaveDraft, isSubmitting, submitError,
  mode = 'new', currentStatus,
}: ReviewStepProps) {
  const primaryPhoto = photos.find((p) => p.isPrimary)
  const isEdit = mode === 'edit'
  const isAlreadyActive = currentStatus === 'active'

  return (
    <div className="flex flex-col gap-5">
      <p className={cn('text-sm', glassColors.text.secondary)}>
        {isEdit
          ? 'Review your changes before saving.'
          : 'Review your listing details before publishing. Make sure everything looks correct.'}
      </p>

      {/* Basic Info */}
      <div className={cn(glass.card, 'p-5')}>
        <SectionHeader title="Basic Information" step={0} onEdit={onEditStep} />
        <div className="flex flex-col gap-2">
          {basicInfo.title && (
            <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">{basicInfo.title}</p>
          )}
          <InfoRow label="Property Type" value={basicInfo.propertyType} />
          <InfoRow label="Lease Term" value={basicInfo.leaseTerm} />
          {(basicInfo.street || basicInfo.city) && (
            <div className="flex gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-white/30 shrink-0 mt-0.5" />
              <span className="text-xs text-gray-600 dark:text-white/70">
                {[basicInfo.street, basicInfo.neighbourhood, basicInfo.city, basicInfo.province, basicInfo.postalCode].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          <InfoRow label="Parking" value={basicInfo.parkingType} />
          {basicInfo.isPetFriendly && <InfoRow label="Pets" value="Allowed" />}
          {basicInfo.isFurnished && <InfoRow label="Furnished" value="Yes" />}
          {basicInfo.description && (
            <p className={cn('text-xs mt-2 line-clamp-3', glassColors.text.secondary)}>{basicInfo.description}</p>
          )}
        </div>
      </div>

      {/* Units */}
      <div className={cn(glass.card, 'p-5')}>
        <SectionHeader title="Units / Floor Plans" step={1} onEdit={onEditStep} />
        {units.length === 0 ? (
          <p className={cn('text-sm', glassColors.text.muted)}>No units added</p>
        ) : (
          <div className="flex flex-col gap-2">
            {units.map((unit, i) => (
              <div key={unit.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <BedDouble className="h-3.5 w-3.5 text-gray-400 dark:text-white/30" />
                  <span className="text-gray-700 dark:text-white/80">{unit.name || `Unit Type ${i + 1}`}</span>
                  <span className={glassColors.text.muted}>
                    {unit.bedrooms}bd / {unit.bathrooms}ba
                    {unit.squareFeet ? ` / ${unit.squareFeet} sqft` : ''}
                  </span>
                </div>
                {unit.price && (
                  <span className="text-gray-900 dark:text-white font-medium">${unit.price}/mo</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Amenities */}
      <div className={cn(glass.card, 'p-5')}>
        <SectionHeader title="Amenities" step={2} onEdit={onEditStep} />
        {amenities.length === 0 ? (
          <p className={cn('text-sm', glassColors.text.muted)}>No amenities selected</p>
        ) : (
          <p className="text-sm text-gray-600 dark:text-white/70">{amenities.length} amenities selected</p>
        )}
      </div>

      {/* Photos */}
      <div className={cn(glass.card, 'p-5')}>
        <SectionHeader title="Photos" step={3} onEdit={onEditStep} />
        {photos.length === 0 ? (
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-gray-400 dark:text-white/30" />
            <p className={cn('text-sm', glassColors.text.muted)}>No photos uploaded</p>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {primaryPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={primaryPhoto.previewUrl} alt="Primary" className="h-16 w-24 object-cover rounded-xl border border-yellow-500/40" />
            )}
            <div className={cn('flex items-center px-3', glassColors.text.muted, 'text-sm')}>
              +{photos.length} photo{photos.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {submitError && (
        <p className="text-sm text-red-400 text-center px-2">{submitError}</p>
      )}
      <div className={cn(glass.base, 'p-5 flex flex-col sm:flex-row gap-3')}>
        {isEdit ? (
          <>
            {/* Edit mode: primary = Save Changes, secondary = Publish (only if not already active) */}
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className={cn(
                glass.buttonPrimary,
                'flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white',
                isSubmitting && 'opacity-60 pointer-events-none'
              )}
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? 'Saving\u2026' : 'Save Changes'}
            </button>
            {!isAlreadyActive && (
              <button
                type="button"
                onClick={onPublish}
                disabled={isSubmitting}
                className={cn(
                  glass.button,
                  'flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-gray-600 dark:text-white/70',
                  isSubmitting && 'opacity-60 pointer-events-none'
                )}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {isSubmitting ? 'Publishing\u2026' : 'Save & Publish'}
              </button>
            )}
          </>
        ) : (
          <>
            {/* New listing mode: Publish + Save as Draft */}
            <button
              type="button"
              onClick={onPublish}
              disabled={isSubmitting}
              className={cn(
                glass.buttonPrimary,
                'flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white',
                isSubmitting && 'opacity-60 pointer-events-none'
              )}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? 'Publishing\u2026' : 'Publish Listing'}
            </button>
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className={cn(
                glass.button,
                'flex-1 flex items-center justify-center px-5 py-3 text-sm font-medium text-gray-600 dark:text-white/70',
                isSubmitting && 'opacity-60 pointer-events-none'
              )}
            >
              {isSubmitting ? 'Saving\u2026' : 'Save as Draft'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
