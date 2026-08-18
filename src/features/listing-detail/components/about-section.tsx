import { Building2, Layers, Home, Car, Clock, FileText } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import type { PropertyWithDetails } from '@/features/properties/types/property'

interface AboutSectionProps {
  property: PropertyWithDetails
}

const LEASE_TERM_LABELS: Record<string, string> = {
  'month-to-month': 'Month-to-Month',
  '6-months': '6 Months',
  '1-year': '1 Year',
  '2-years': '2 Years',
  'flexible': 'Flexible',
}

interface InfoCardProps {
  icon: React.ElementType
  label: string
  value: string
}

function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className={cn(glass.base, 'p-4 flex items-start gap-3')}>
      <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-brand-400" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className={cn('text-xs', glassColors.text.muted)}>{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export function AboutSection({ property }: AboutSectionProps) {
  const leaseLabel = property.lease_term
    ? (LEASE_TERM_LABELS[property.lease_term] ?? property.lease_term)
    : 'Contact for details'

  const parkingLabel = property.parking_type ?? 'No parking'

  return (
    <div className="space-y-6">
      {/* Key info grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3" aria-label="Property details">
        <InfoCard icon={Building2} label="Property Type" value={property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)} />
        <InfoCard icon={Layers} label="Total Units" value={property.units.length > 0 ? `${property.units.length} unit${property.units.length !== 1 ? 's' : ''}` : 'N/A'} />
        <InfoCard icon={Home} label="Province" value={property.province} />
        <InfoCard icon={Car} label="Parking" value={parkingLabel} />
        <InfoCard icon={Clock} label="Lease Term" value={leaseLabel} />
        <InfoCard icon={FileText} label="Status" value={property.status.charAt(0).toUpperCase() + property.status.slice(1)} />
      </div>

      {/* Description */}
      {property.description && (
        <div className={cn(glass.card, 'p-6')}>
          <div className={glass.highlight} aria-hidden="true" />
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-brand-400" aria-hidden="true" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">About this Property</h3>
          </div>
          <p className={cn('text-sm leading-relaxed whitespace-pre-wrap', glassColors.text.secondary)}>
            {property.description}
          </p>
        </div>
      )}

      {/* Address details */}
      <div className={cn(glass.base, 'p-4')}>
        <h3 className={cn('text-xs font-medium mb-3', glassColors.text.muted)}>Location</h3>
        <div className="space-y-1">
          <p className="text-sm text-gray-900 dark:text-white">{property.street_address}</p>
          <p className={cn('text-sm', glassColors.text.secondary)}>
            {property.city}, {property.province} {property.postal_code}
          </p>
        </div>
      </div>
    </div>
  )
}
