'use client'

import { useState } from 'react'
import { Mail, Phone, Calendar, Send, CheckCircle2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { submitInquiry } from '@/features/renter-portal/services/renter-service'
import { createClient } from '@/lib/supabase/client'

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
  landlordPhone?: string | null
}

interface FormState {
  name: string
  email: string
  phone: string
  moveInDate: string
  message: string
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  moveInDate: '',
  message: '',
}

export function ContactForm({ propertyId, propertyTitle, landlordPhone }: ContactFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const result = await submitInquiry({
      propertyId,
      senderId: user?.id ?? null,
      senderName: form.name,
      senderEmail: form.email,
      senderPhone: form.phone || null,
      message: form.message,
      moveInDate: form.moveInDate || null,
    })

    setIsSubmitting(false)

    if (result.error) {
      setError('Failed to send message. Please try again.')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={cn(glass.card, 'p-6 flex flex-col items-center text-center gap-4')}>
        <div className={glass.highlight} aria-hidden="true" />
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-emerald-400" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Message Sent!</h3>
          <p className={cn('text-sm', glassColors.text.secondary)}>
            Your inquiry about <span className="text-gray-900 dark:text-white">{propertyTitle}</span> has been sent. The landlord will contact you shortly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setForm(INITIAL_FORM) }}
          className={cn(glass.button, 'px-4 py-2 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white')}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className={cn(glass.card, 'p-6')}>
      <div className={glass.highlight} aria-hidden="true" />

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Contact Landlord</h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        {error && (
          <p role="alert" className="text-sm text-red-400">{error}</p>
        )}
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Your name"
            required
            className={cn(glass.input, 'w-full px-3 py-2.5 text-sm')}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
            <Mail className="inline h-3 w-3 mr-1" aria-hidden="true" />
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="your@email.com"
            required
            className={cn(glass.input, 'w-full px-3 py-2.5 text-sm')}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="contact-phone" className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
            <Phone className="inline h-3 w-3 mr-1" aria-hidden="true" />
            Phone <span className="text-gray-400 dark:text-white/30">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            placeholder="(416) 555-0100"
            className={cn(glass.input, 'w-full px-3 py-2.5 text-sm')}
          />
        </div>

        {/* Move-in date */}
        <div>
          <label htmlFor="contact-date" className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
            <Calendar className="inline h-3 w-3 mr-1" aria-hidden="true" />
            Desired Move-in Date
          </label>
          <input
            id="contact-date"
            type="date"
            value={form.moveInDate}
            onChange={handleChange('moveInDate')}
            className={cn(glass.input, 'w-full px-3 py-2.5 text-sm')}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className={cn('block text-xs font-medium mb-1.5', glassColors.text.secondary)}>
            Message *
          </label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={handleChange('message')}
            placeholder={`Hi, I'm interested in ${propertyTitle}. Is it still available?`}
            rows={4}
            required
            className={cn(glass.input, 'w-full px-3 py-2.5 text-sm resize-none')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !form.name || !form.email || !form.message}
          className={cn(
            glass.buttonPrimary,
            'w-full py-3 text-sm font-semibold text-white',
            'flex items-center justify-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'mt-1'
          )}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Phone fallback */}
      {landlordPhone && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 text-center">
          <a
            href={`tel:${landlordPhone}`}
            className={cn('flex items-center justify-center gap-2 text-sm', glassColors.text.secondary, 'hover:text-gray-900 dark:hover:text-white transition-colors')}
          >
            <Phone className="h-4 w-4 text-brand-400" aria-hidden="true" />
            Or call: {landlordPhone}
          </a>
        </div>
      )}
    </div>
  )
}
