import type { Metadata } from 'next'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Rent.ca.',
}

const faqs = [
  { q: 'How do I search for rentals?', a: 'Use our search bar on the homepage to search by city or neighbourhood. You can also use our AI assistant to search using natural language - just describe what you\'re looking for.' },
  { q: 'Is Rent.ca free to use for renters?', a: 'Yes! Searching for rentals, saving favorites, setting up alerts, and using our AI assistant are completely free for renters.' },
  { q: 'How do I contact a landlord?', a: 'Each listing has a contact form. Fill in your details and message, and the landlord will receive your inquiry directly.' },
  { q: 'What is the AI assistant?', a: 'Our AI assistant is a smart chatbot that can help you search for properties using natural language, answer questions about renting in Canada, set up alerts, and provide information about neighbourhoods.' },
  { q: 'How do I set up alerts?', a: 'You can create alerts from the search page, your account dashboard, or by asking our AI assistant. You\'ll receive email notifications when new listings match your criteria.' },
  { q: 'Are listings verified?', a: 'We verify landlord accounts and encourage accurate listings. Properties with a verified badge have been confirmed by our team.' },
  { q: 'What cities do you cover?', a: 'We cover all major Canadian cities including Toronto, Vancouver, Montreal, Calgary, Ottawa, Edmonton, and many more. We\'re constantly expanding our coverage.' },
  { q: 'How do I list my property?', a: 'Sign up as a landlord, then use our management portal to create your listing. You can start with a free listing and upgrade to promoted or featured for more visibility.' },
  { q: 'What are my rights as a tenant in Canada?', a: 'Tenant rights vary by province. Generally, tenants have the right to a safe living environment, privacy, and protection from unfair eviction. Our AI assistant can provide more specific information for your province.' },
  { q: 'How do I report a listing?', a: 'If you find a suspicious or inaccurate listing, please contact us through our contact form or use the report button on the listing page.' },
]

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h1>
        <p className={cn('text-lg', glassColors.text.muted)}>Everything you need to know about Rent.ca</p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className={cn(glass.base, 'px-6 border-gray-200 dark:border-white/10')}>
            <AccordionTrigger className="text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 text-left">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className={glassColors.text.muted}>
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
