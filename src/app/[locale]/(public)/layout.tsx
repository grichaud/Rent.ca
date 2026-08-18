import { Header } from '@/shared/components/header'
import { Footer } from '@/shared/components/footer'
import { GlassBackground } from '@/shared/components/glass-background'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlassBackground>
      <Header />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </GlassBackground>
  )
}
