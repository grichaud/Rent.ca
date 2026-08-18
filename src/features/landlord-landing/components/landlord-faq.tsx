'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

interface FaqItem {
  id: string
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'cost',
    question: 'How much does it cost to list?',
    answer:
      'Listing on Rent.ca starts completely free with our Limited plan. You can post your property with up to 5 photos and a contact form at no charge. For more visibility, our Promoted plan starts at $35 per 15 days, and our Featured plan is $199 per 15 days. All prices are in CAD and there are no hidden fees.',
  },
  {
    id: 'get-started',
    question: 'How do I get started?',
    answer:
      'Getting started takes less than 2 minutes. Click "Get Started Free," create your landlord account with your email, then follow the guided listing wizard. You can publish your first listing the same day without any approval delay.',
  },
  {
    id: 'free-tier',
    question: "What's included in the free tier?",
    answer:
      'The free Limited plan includes a full property listing with up to 5 photos, a built-in contact form, and standard placement in Rent.ca search results. Your listing will also be discoverable via our AI assistant when renters search for matching properties.',
  },
  {
    id: 'ai-assistant',
    question: 'How does the AI assistant help landlords?',
    answer:
      'Our AI assistant actively recommends your property to renters who are searching using natural language queries. For example, when a renter asks "Find me a 2-bedroom near downtown Calgary under $2,000," the AI evaluates your listing details and recommends the best matches. Promoted and Featured listings receive priority placement in these recommendations.',
  },
  {
    id: 'multiple-properties',
    question: 'Can I manage multiple properties?',
    answer:
      'Yes. Your landlord dashboard supports unlimited properties under one account. You can switch between listings, manage inquiries per property, and track performance analytics for each unit individually. Property managers handling large portfolios can also request a dedicated account manager by contacting our support team.',
  },
  {
    id: 'upgrade',
    question: 'How do I upgrade my listing?',
    answer:
      'You can upgrade any active listing directly from your dashboard. Navigate to "My Listings," select the listing you want to boost, and choose either the Promoted or Featured plan. Your listing will gain enhanced placement immediately after payment is confirmed.',
  },
  {
    id: 'coverage',
    question: 'What areas do you cover?',
    answer:
      'Rent.ca covers over 200 cities and communities across Canada, from major markets like Toronto, Vancouver, Calgary, and Montreal, to smaller towns and rural areas. If your city is not yet listed, contact us and we will prioritize expanding coverage to your region.',
  },
  {
    id: 'cancel',
    question: 'How do I cancel my subscription?',
    answer:
      'There are no long-term contracts. Promoted and Featured plans run for 15-day periods and do not auto-renew unless you choose to. You can deactivate or remove any listing at any time from your dashboard. Refunds for unused days are available within 48 hours of purchase by contacting support.',
  },
]

export function LandlordFaq() {
  return (
    <section
      className="mx-auto w-full max-w-3xl px-4"
      aria-labelledby="faq-heading"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span className={cn(glass.badge, 'text-brand-400 font-medium mb-4 inline-block')}>
          FAQ
        </span>
        <h2
          id="faq-heading"
          className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Frequently Asked Questions
        </h2>
        <p className={cn('text-lg', glassColors.text.secondary)}>
          Everything you need to know about listing on Rent.ca.
        </p>
      </div>

      {/* Accordion */}
      <Accordion type="single" collapsible className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className={cn(
              glass.base,
              'px-6 border-gray-200 dark:border-white/20 rounded-2xl overflow-hidden',
              'hover:border-gray-300 dark:hover:border-white/30 transition-all duration-200',
              'data-[state=open]:border-brand-500/30 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-white/15'
            )}
          >
            <AccordionTrigger
              className={cn(
                'text-gray-900 dark:text-white font-semibold text-left hover:no-underline',
                'hover:text-brand-600 dark:hover:text-brand-300 transition-colors duration-200',
                '[&[data-state=open]]:text-brand-400'
              )}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent
              className={cn('text-sm leading-relaxed', glassColors.text.secondary)}
            >
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
