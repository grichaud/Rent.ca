'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps'
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import type { Cluster } from '@googlemaps/markerclusterer'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { MapPin, Bed, Bath, Home, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { useSearchStore } from '@/features/search/store/search-store'
import type { MapMarker } from '@/features/map/types/map'
import { DARK_MAP_STYLES, LIGHT_MAP_STYLES } from '@/features/map/lib/map-styles'

interface ListingsMapProps {
  className?: string
  markers: MapMarker[]
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? ''

/** Default center: Toronto */
const DEFAULT_CENTER = { lat: 43.6532, lng: -79.3832 }
const DEFAULT_ZOOM = 12

function formatPrice(cents: number): string {
  const dollars = cents / 100
  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(dollars % 1000 === 0 ? 0 : 1)}k`
  }
  return `$${dollars.toLocaleString('en-CA')}`
}

/* ── SVG Pin Marker ──────────────────────────────────── */

function PinSvg({ active, dark }: { active: boolean; dark: boolean }) {
  const fill = active
    ? '#3b82f6' // brand-500
    : dark
      ? '#60a5fa' // brand-400 — visible on dark map
      : '#1e40af' // brand-800 — high contrast on light map
  const stroke = active ? '#1d4ed8' : dark ? '#93c5fd' : '#1e3a5f'

  return (
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Drop shadow */}
      <ellipse cx="16" cy="40" rx="6" ry="2" fill="rgba(0,0,0,0.25)" />
      {/* Pin body */}
      <path
        d="M16 1C8.268 1 2 7.268 2 15c0 10.5 14 25 14 25s14-14.5 14-25C30 7.268 23.732 1 16 1z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* Inner circle */}
      <circle cx="16" cy="14.5" r="5.5" fill="white" />
      {/* House icon inside circle */}
      <path
        d="M16 10.5l-4 3.5v4h2.5v-2.5h3v2.5H20v-4l-4-3.5z"
        fill={fill}
      />
    </svg>
  )
}

/* ── Single Pin Marker (with ref for clustering) ───── */

function LocationPin({
  marker,
  isHovered,
  isSelected,
  isDark,
  onHover,
  onClick,
  onMarkerMount,
}: {
  marker: MapMarker
  isHovered: boolean
  isSelected: boolean
  isDark: boolean
  onHover: (id: string | null) => void
  onClick: (id: string) => void
  onMarkerMount: (id: string, el: google.maps.marker.AdvancedMarkerElement | null) => void
}) {
  const [markerRef, markerElement] = useAdvancedMarkerRef()
  const active = isHovered || isSelected

  useEffect(() => {
    onMarkerMount(marker.id, markerElement)
    return () => { onMarkerMount(marker.id, null) }
  }, [markerElement, marker.id, onMarkerMount])

  return (
    <AdvancedMarker
      position={{ lat: marker.lat, lng: marker.lng }}
      onClick={() => onClick(marker.id)}
      ref={markerRef}
    >
      <div
        onMouseEnter={() => onHover(marker.id)}
        onMouseLeave={() => onHover(null)}
        className="cursor-pointer transition-transform duration-200"
        style={{ transform: active ? 'scale(1.25)' : undefined }}
      >
        <PinSvg active={active} dark={isDark} />
      </div>
    </AdvancedMarker>
  )
}

/* ── Popup Card (single marker) ──────────────────────── */

function PopupCard({
  marker,
  onClose,
}: {
  marker: MapMarker
  onClose: () => void
}) {
  return (
    <InfoWindow
      position={{ lat: marker.lat, lng: marker.lng }}
      onCloseClick={onClose}
      pixelOffset={[0, -10]}
    >
      <a
        href={ROUTES.listing(marker.city, marker.slug)}
        className="block w-64 no-underline text-inherit"
      >
        <div className="relative h-36 w-full bg-gray-100 rounded-t-lg overflow-hidden">
          {marker.imageUrl ? (
            <Image
              src={marker.imageUrl}
              alt={marker.title}
              fill
              className="object-cover"
              sizes="256px"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Home className="h-8 w-8 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-bold text-brand-600">
            {formatPrice(marker.price)}/mo
          </p>
          <p className="text-sm font-medium text-gray-900 truncate mt-0.5">
            {marker.title}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Bed className="h-3 w-3" /> {marker.bedrooms} bd
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3" /> {marker.bathrooms} ba
            </span>
            <span className="capitalize">{marker.propertyType}</span>
          </div>
        </div>
      </a>
    </InfoWindow>
  )
}

/* ── Cluster Popup (list of properties) ──────────────── */

interface ClusterPopupData {
  position: { lat: number; lng: number }
  items: MapMarker[]
}

function ClusterPopup({
  data,
  onClose,
  onSelectMarker,
}: {
  data: ClusterPopupData
  onClose: () => void
  onSelectMarker: (id: string) => void
}) {
  return (
    <InfoWindow
      position={data.position}
      onCloseClick={onClose}
      pixelOffset={[0, -10]}
    >
      <div className="w-72">
        <div className="px-3 pt-2 pb-1.5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {data.items.length} Listings in this area
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
          {data.items.map((item) => (
            <a
              key={item.id}
              href={ROUTES.listing(item.city, item.slug)}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors no-underline text-inherit"
              onMouseEnter={() => onSelectMarker(item.id)}
            >
              {/* Thumbnail */}
              <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Home className="h-4 w-4 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-600 leading-tight">
                  {formatPrice(item.price)}/mo
                </p>
                <p className="text-xs text-gray-900 font-medium truncate mt-0.5">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                  <span>{item.bedrooms} bd</span>
                  <span>·</span>
                  <span>{item.bathrooms} ba</span>
                  <span>·</span>
                  <span className="capitalize">{item.propertyType}</span>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </InfoWindow>
  )
}

/* ── Cluster Markers (with proper ref tracking) ───── */

function ClusterMarkers({
  markers,
  hoveredId,
  selectedId,
  isDark,
  onHover,
  onClick,
  onClusterClick,
}: {
  markers: MapMarker[]
  hoveredId: string | null
  selectedId: string | null
  isDark: boolean
  onHover: (id: string | null) => void
  onClick: (id: string) => void
  onClusterClick: (data: ClusterPopupData | null, cluster: Cluster) => void
}) {
  const map = useMap()
  const clustererRef = useRef<MarkerClusterer | null>(null)
  const markerElements = useRef<globalThis.Map<string, google.maps.marker.AdvancedMarkerElement>>(
    new globalThis.Map()
  )
  // Reverse map: AdvancedMarkerElement → marker ID
  const elementToId = useRef<globalThis.Map<google.maps.marker.AdvancedMarkerElement, string>>(
    new globalThis.Map()
  )
  // Keep markers data in a ref so the onClusterClick callback can access latest data
  const markersDataRef = useRef<MapMarker[]>(markers)
  markersDataRef.current = markers

  // Single vs double click detection
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stable callback refs for cluster click
  const onClusterClickRef = useRef(onClusterClick)
  onClusterClickRef.current = onClusterClick

  // Initialize clusterer once
  useEffect(() => {
    if (!map) return

    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map,
        algorithm: new SuperClusterAlgorithm({ radius: 80, maxZoom: 15 }),
        onClusterClick: (_event, cluster, clusterMap) => {
          // Double-click detection: if timer is pending, this is a double click → zoom
          if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current)
            clickTimerRef.current = null

            // Zoom into cluster bounds
            const bounds = cluster.bounds
            if (bounds) {
              clusterMap.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 })
            }
            return
          }

          // Single click: set timer, if no second click → show popup
          clickTimerRef.current = setTimeout(() => {
            clickTimerRef.current = null

            // Resolve which MapMarker items are in this cluster
            const clusterMarkerEls = cluster.markers ?? []
            const markersData = markersDataRef.current
            const idLookup = elementToId.current
            const items: MapMarker[] = []

            for (const el of clusterMarkerEls) {
              const id = idLookup.get(el as google.maps.marker.AdvancedMarkerElement)
              if (id) {
                const found = markersData.find((m) => m.id === id)
                if (found) items.push(found)
              }
            }

            const pos = cluster.position
            if (items.length > 0 && pos) {
              onClusterClickRef.current(
                { position: { lat: pos.lat(), lng: pos.lng() }, items },
                cluster
              )
            }
          }, 280)
        },
        renderer: {
          render({ count, position }) {
            const el = document.createElement('div')
            el.style.cssText = `
              display:flex; align-items:center; justify-content:center;
              border-radius:50%; background:#3b82f6; color:white;
              font-size:13px; font-weight:700; box-shadow:0 2px 8px rgba(0,0,0,0.3);
              border:2.5px solid white; cursor:pointer;
            `
            const size = count > 50 ? 48 : count > 20 ? 40 : 34
            el.style.width = `${size}px`
            el.style.height = `${size}px`
            el.textContent = String(count)
            return new google.maps.marker.AdvancedMarkerElement({
              position,
              content: el,
              zIndex: 1000 + count,
            })
          },
        },
      })
    }

    return () => {
      clustererRef.current?.clearMarkers()
    }
  }, [map])

  // Handle marker mount/unmount — register with clusterer
  const handleMarkerMount = useCallback(
    (id: string, el: google.maps.marker.AdvancedMarkerElement | null) => {
      if (el) {
        markerElements.current.set(id, el)
        elementToId.current.set(el, id)
      } else {
        const existing = markerElements.current.get(id)
        if (existing) elementToId.current.delete(existing)
        markerElements.current.delete(id)
      }

      // Sync all markers with clusterer
      if (clustererRef.current) {
        clustererRef.current.clearMarkers()
        clustererRef.current.addMarkers(
          Array.from(markerElements.current.values())
        )
      }
    },
    []
  )

  return (
    <>
      {markers.map((m) => (
        <LocationPin
          key={m.id}
          marker={m}
          isHovered={hoveredId === m.id}
          isSelected={selectedId === m.id}
          isDark={isDark}
          onHover={onHover}
          onClick={onClick}
          onMarkerMount={handleMarkerMount}
        />
      ))}
    </>
  )
}

/* ── Fit Bounds Helper ─────────────────────────────── */

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap()

  useEffect(() => {
    if (!map || markers.length === 0) return
    const bounds = new google.maps.LatLngBounds()
    markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }))
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 })
  }, [map, markers])

  return null
}

/* ── No API Key Placeholder ────────────────────────── */

function MapPlaceholder({ className, count }: { className?: string; count: number }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        'bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl',
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className={cn(glass.card, 'p-6 text-center z-10')}>
        <MapPin className="h-8 w-8 text-brand-500 dark:text-brand-400 mx-auto mb-3" />
        <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Map View</h3>
        <p className="text-gray-500 dark:text-white/50 text-sm">
          {count > 0
            ? `${count} properties to display`
            : 'Configure Google Maps API key to enable map view'}
        </p>
      </div>
    </div>
  )
}

/* ── Main ListingsMap ──────────────────────────────── */

export function ListingsMap({ className, markers }: ListingsMapProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const hoveredId = useSearchStore((s) => s.hoveredPropertyId)
  const selectedId = useSearchStore((s) => s.selectedPropertyId)
  const setHovered = useSearchStore((s) => s.setHoveredPropertyId)
  const setSelected = useSearchStore((s) => s.setSelectedPropertyId)

  const [clusterPopup, setClusterPopup] = useState<ClusterPopupData | null>(null)

  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedId) ?? null,
    [markers, selectedId]
  )

  const center = useMemo(() => {
    if (markers.length === 0) return DEFAULT_CENTER
    const sumLat = markers.reduce((s, m) => s + m.lat, 0)
    const sumLng = markers.reduce((s, m) => s + m.lng, 0)
    return { lat: sumLat / markers.length, lng: sumLng / markers.length }
  }, [markers])

  const mapStyles = isDark ? DARK_MAP_STYLES : LIGHT_MAP_STYLES

  const handleClusterClick = useCallback((data: ClusterPopupData | null) => {
    // Close any open single-marker popup
    setSelected(null)
    setClusterPopup(data)
  }, [setSelected])

  const handleMarkerClick = useCallback((id: string) => {
    // Close cluster popup when clicking a single marker
    setClusterPopup(null)
    setSelected(id)
  }, [setSelected])

  if (!API_KEY) {
    return <MapPlaceholder className={className} count={markers.length} />
  }

  return (
    <div className={cn('rounded-2xl overflow-hidden', className)}>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={center}
          defaultZoom={DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          zoomControl
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          zoomControlOptions={{ position: 7 } as any /* RIGHT_TOP — avoids overlap with AI button */}
          mapId={MAP_ID || undefined}
          styles={!MAP_ID ? mapStyles : undefined}
          className="w-full h-full"
        >
          <FitBounds markers={markers} />
          <ClusterMarkers
            markers={markers}
            hoveredId={hoveredId}
            selectedId={selectedId}
            isDark={isDark}
            onHover={setHovered}
            onClick={handleMarkerClick}
            onClusterClick={handleClusterClick}
          />
          {selectedMarker && !clusterPopup && (
            <PopupCard
              marker={selectedMarker}
              onClose={() => setSelected(null)}
            />
          )}
          {clusterPopup && (
            <ClusterPopup
              data={clusterPopup}
              onClose={() => setClusterPopup(null)}
              onSelectMarker={setHovered}
            />
          )}
        </Map>
      </APIProvider>
    </div>
  )
}
