'use client'

import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { Mail, MessageSquare, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
        <p className={cn('text-lg', glassColors.text.muted)}>Have a question? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Mail, title: 'Email', detail: 'support@rent.ca' },
          { icon: MessageSquare, title: 'Live Chat', detail: 'Ask our AI assistant' },
          { icon: MapPin, title: 'Location', detail: 'Toronto, Canada' },
        ].map((item) => (
          <div key={item.title} className={cn(glass.card, 'p-6 text-center')}>
            <item.icon className="h-6 w-6 text-brand-400 mx-auto mb-3" />
            <h3 className="text-gray-900 dark:text-white font-medium">{item.title}</h3>
            <p className={cn('text-sm mt-1', glassColors.text.muted)}>{item.detail}</p>
          </div>
        ))}
      </div>

      <div className={cn(glass.card, 'p-8')}>
        {submitted ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h2>
            <p className={glassColors.text.muted}>We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Your name" required className={cn(glass.input, 'w-full px-4 py-3')} />
              <input type="email" placeholder="Your email" required className={cn(glass.input, 'w-full px-4 py-3')} />
            </div>
            <input placeholder="Subject" required className={cn(glass.input, 'w-full px-4 py-3')} />
            <textarea placeholder="Your message..." rows={5} required className={cn(glass.input, 'w-full px-4 py-3 resize-none')} />
            <button type="submit" className={cn(glass.buttonPrimary, 'px-8 py-3 text-white font-medium')}>
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
