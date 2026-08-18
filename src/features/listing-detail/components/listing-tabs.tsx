'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutGrid, Sparkles as AmenitiesIcon, Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { FloorPlansSection } from './floor-plans-section'
import { AmenitiesSection } from './amenities-section'
import { AboutSection } from './about-section'
import type { PropertyWithDetails } from '@/features/properties/types/property'

interface ListingTabsProps {
  property: PropertyWithDetails
}

export function ListingTabs({ property }: ListingTabsProps) {
  return (
    <Tabs defaultValue="floor-plans" className="w-full">
      {/* Tab triggers */}
      <TabsList className={cn(glass.base, 'w-full h-auto p-1.5 gap-1 grid grid-cols-3 mb-6')}>
        <TabsTrigger
          value="floor-plans"
          className={cn(
            'flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium text-gray-500 dark:text-white/60',
            'data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-white/15 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-lg',
            'transition-all duration-200 hover:text-gray-700 dark:hover:text-white/80'
          )}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Floor Plans</span>
        </TabsTrigger>
        <TabsTrigger
          value="amenities"
          className={cn(
            'flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium text-gray-500 dark:text-white/60',
            'data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-white/15 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-lg',
            'transition-all duration-200 hover:text-gray-700 dark:hover:text-white/80'
          )}
        >
          <AmenitiesIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Amenities</span>
        </TabsTrigger>
        <TabsTrigger
          value="about"
          className={cn(
            'flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium text-gray-500 dark:text-white/60',
            'data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-white/15 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white data-[state=active]:shadow-lg',
            'transition-all duration-200 hover:text-gray-700 dark:hover:text-white/80'
          )}
        >
          <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>About</span>
        </TabsTrigger>
      </TabsList>

      {/* Tab content */}
      <TabsContent value="floor-plans" tabIndex={-1}>
        <FloorPlansSection units={property.units} />
      </TabsContent>

      <TabsContent value="amenities" tabIndex={-1}>
        <AmenitiesSection amenities={property.amenities} />
      </TabsContent>

      <TabsContent value="about" tabIndex={-1}>
        <AboutSection property={property} />
      </TabsContent>
    </Tabs>
  )
}
