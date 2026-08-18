import { UserPlus, FileText, MessageSquare } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

interface Step {
  number: number
  icon: React.ElementType
  iconColor: string
  glowColor: string
  numberColor: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: 1,
    icon: UserPlus,
    iconColor: 'text-brand-400',
    glowColor: 'bg-brand-500/20',
    numberColor: 'text-brand-400 border-brand-500/40 bg-brand-500/10',
    title: 'Create Account',
    description: 'Sign up as a landlord in 30 seconds. No credit card required.',
  },
  {
    number: 2,
    icon: FileText,
    iconColor: 'text-cyan-400',
    glowColor: 'bg-cyan-500/20',
    numberColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    title: 'Post Your Listing',
    description: 'Add photos, details, and set your price. Our tools make it simple.',
  },
  {
    number: 3,
    icon: MessageSquare,
    iconColor: 'text-purple-400',
    glowColor: 'bg-purple-500/20',
    numberColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    title: 'Get Inquiries',
    description: 'Receive and manage tenant inquiries from your dashboard.',
  },
]

interface StepCardProps {
  step: Step
  isLast: boolean
}

function StepCard({ step, isLast }: StepCardProps) {
  const Icon = step.icon

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 flex-1">
      <article
        className={cn(
          glass.card,
          'w-full p-7 flex flex-col items-center text-center gap-4',
          'hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300'
        )}
      >
        {/* Number */}
        <div
          className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center',
            'border text-sm font-bold',
            step.numberColor
          )}
          aria-hidden="true"
        >
          {step.number}
        </div>

        {/* Icon */}
        <div
          className={cn(
            'h-14 w-14 rounded-2xl flex items-center justify-center',
            step.glowColor,
            'border border-gray-200 dark:border-white/10 shadow-lg'
          )}
        >
          <Icon className={cn('h-7 w-7', step.iconColor)} aria-hidden="true" />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
          <p className={cn('text-sm leading-relaxed', glassColors.text.secondary)}>
            {step.description}
          </p>
        </div>
      </article>

      {/* Connector line between steps */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="hidden md:block h-px w-8 shrink-0 bg-gradient-to-r from-gray-200 dark:from-white/20 to-gray-100 dark:to-white/10 mx-2"
        />
      )}
    </div>
  )
}

export function HowItWorks() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4"
      aria-labelledby="how-it-works-heading"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span className={cn(glass.badge, 'text-brand-400 font-medium mb-4 inline-block')}>
          Simple Process
        </span>
        <h2
          id="how-it-works-heading"
          className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        >
          How It Works
        </h2>
        <p className={cn('text-lg max-w-xl mx-auto', glassColors.text.secondary)}>
          Get your property in front of qualified renters in three easy steps.
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
        {STEPS.map((step, index) => (
          <StepCard
            key={step.number}
            step={step}
            isLast={index === STEPS.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
