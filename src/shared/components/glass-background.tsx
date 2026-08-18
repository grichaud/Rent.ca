import { cn } from '@/shared/lib/utils'
import { meshBackground } from '@/shared/lib/glass'

interface GlassBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function GlassBackground({ children, className }: GlassBackgroundProps) {
  return (
    <div className={cn(meshBackground, 'relative min-h-screen overflow-hidden', className)}>
      {/* Animated blob - brand blue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-500/10 blur-3xl animate-pulse-slow"
        style={{ animationDelay: '0s' }}
      />

      {/* Animated blob - purple */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-32 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow"
        style={{ animationDelay: '2s' }}
      />

      {/* Animated blob - cyan */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow"
        style={{ animationDelay: '4s' }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
