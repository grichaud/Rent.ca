import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

interface Testimonial {
  quote: string
  name: string
  company: string
  rating: number
  location: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Rent.ca filled my vacancy in under a week. The AI matching feature is incredible — I only got inquiries from qualified renters who were genuinely interested.",
    name: 'James Kowalski',
    company: 'Kowalski Properties',
    rating: 5,
    location: 'Toronto, ON',
  },
  {
    quote:
      "I manage 12 units across Vancouver and the management portal makes everything seamless. The featured listing drove 3x more inquiries than my previous platform.",
    name: 'Priya Sharma',
    company: 'Westside Rentals Inc.',
    rating: 5,
    location: 'Vancouver, BC',
  },
  {
    quote:
      "I was skeptical about the AI assistant, but renters who contacted me through it were the most serious. It genuinely screens for intent. Worth every penny.",
    name: 'Michel Tremblay',
    company: 'Tremblay Immobilier',
    rating: 5,
    location: 'Montreal, QC',
  },
]

interface StarRatingProps {
  rating: number
}

function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-white/20'
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

interface TestimonialCardProps {
  testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article
      className={cn(glass.cardPremium, 'p-8 flex flex-col gap-5')}
      aria-label={`Testimonial from ${testimonial.name}`}
    >
      {/* Top highlight */}
      <div className={cn(glass.highlight)} aria-hidden="true" />

      {/* Background ambient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-white/[0.02] pointer-events-none"
      />

      {/* Rating */}
      <div className="relative z-10">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote */}
      <blockquote className="relative z-10">
        <p className={cn('text-base italic leading-relaxed', glassColors.text.secondary)}>
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      <div className="relative z-10 flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-white/10">
        {/* Avatar placeholder */}
        <div
          aria-hidden="true"
          className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500/40 to-purple-500/40 border border-gray-200 dark:border-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0"
        >
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
          <p className="text-xs text-gray-500 dark:text-white/50">
            {testimonial.company} &middot; {testimonial.location}
          </p>
        </div>
      </div>
    </article>
  )
}

export function Testimonials() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4"
      aria-labelledby="testimonials-heading"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span className={cn(glass.badge, 'text-brand-400 font-medium mb-4 inline-block')}>
          Landlord Reviews
        </span>
        <h2
          id="testimonials-heading"
          className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Trusted by Landlords Across Canada
        </h2>
        <p className={cn('text-lg max-w-xl mx-auto', glassColors.text.secondary)}>
          Real results from property owners who chose Rent.ca.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </section>
  )
}
