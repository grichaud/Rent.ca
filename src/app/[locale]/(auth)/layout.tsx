import { GlassBackground } from '@/shared/components/glass-background'
import { Logo } from '@/shared/components/logo'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlassBackground>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Logo above card */}
        <div className="mb-8">
          <Logo size="lg" />
        </div>

        {/* Glass card container */}
        <div
          className={cn(
            glass.modal,
            'relative w-full max-w-md p-8'
          )}
        >
          {/* Top highlight */}
          <div className={glass.highlight} />
          {children}
        </div>
      </div>
    </GlassBackground>
  )
}
