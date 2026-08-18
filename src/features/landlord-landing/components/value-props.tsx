import { Eye, Sparkles, LayoutDashboard } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

interface ValueProp {
  icon: React.ElementType
  iconColor: string
  glowColor: string
  title: string
  description: string
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: Eye,
    iconColor: 'text-brand-400',
    glowColor: 'bg-brand-500/20',
    title: 'Maximum Exposure',
    description:
      'Your listing appears in search, maps, and our AI assistant recommends your property to matching renters.',
  },
  {
    icon: Sparkles,
    iconColor: 'text-cyan-400',
    glowColor: 'bg-cyan-500/20',
    title: 'AI-Powered Matching',
    description:
      'Our AI assistant actively recommends your properties to renters searching with natural language.',
  },
  {
    icon: LayoutDashboard,
    iconColor: 'text-purple-400',
    glowColor: 'bg-purple-500/20',
    title: 'Easy Management',
    description:
      'Full management portal to handle inquiries, update listings, and track performance.',
  },
]

interface ValueCardProps {
  prop: ValueProp
}

function ValueCard({ prop }: ValueCardProps) {
  const Icon = prop.icon

  return (
    <article className={cn(glass.cardPremium, 'p-8 flex flex-col gap-5')}>
      {/* Top highlight */}
      <div className={cn(glass.highlight)} aria-hidden="true" />

      {/* Background ambient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
      />

      {/* Icon circle */}
      <div className="relative z-10">
        <div
          className={cn(
            'h-14 w-14 rounded-2xl flex items-center justify-center',
            prop.glowColor,
            'border border-gray-200 dark:border-white/10 shadow-lg'
          )}
        >
          <Icon className={cn('h-7 w-7', prop.iconColor)} aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{prop.title}</h3>
        <p className={cn('text-sm leading-relaxed', glassColors.text.secondary)}>
          {prop.description}
        </p>
      </div>
    </article>
  )
}

export function ValueProps() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4"
      aria-labelledby="value-props-heading"
    >
      <h2 id="value-props-heading" className="sr-only">
        Why list on Rent.ca
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VALUE_PROPS.map((prop) => (
          <ValueCard key={prop.title} prop={prop} />
        ))}
      </div>
    </section>
  )
}
