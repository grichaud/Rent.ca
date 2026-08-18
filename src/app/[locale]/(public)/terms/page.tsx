import type { Metadata } from 'next'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing and using Rent.ca, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.' },
  { title: '2. Use of Service', content: 'Rent.ca provides an online platform connecting renters with landlords across Canada. You may use our services to search for rental properties, list properties, communicate with other users, and use our AI assistant. You must be at least 18 years of age to use our services.' },
  { title: '3. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating an account. You are responsible for all activities under your account.' },
  { title: '4. Listings', content: 'Landlords are responsible for the accuracy of their listing information. Rent.ca does not guarantee the accuracy, completeness, or availability of any listing. We reserve the right to remove listings that violate our policies.' },
  { title: '5. AI Assistant', content: 'Our AI assistant provides general information and search assistance. It does not constitute legal, financial, or professional advice. While we strive for accuracy, AI-generated responses may contain errors.' },
  { title: '6. Privacy', content: 'Your use of Rent.ca is also governed by our Privacy Policy. By using our services, you consent to the collection and use of information as described in our Privacy Policy.' },
  { title: '7. Prohibited Conduct', content: 'You may not: post false or misleading listings, harass other users, attempt to circumvent our systems, scrape our data, or use our platform for any illegal purpose.' },
  { title: '8. Limitation of Liability', content: 'Rent.ca is not a party to any rental agreement between users. We are not liable for any disputes, damages, or losses arising from transactions between users of our platform.' },
  { title: '9. Changes to Terms', content: 'We may update these terms from time to time. Continued use of Rent.ca after changes constitutes acceptance of the new terms.' },
  { title: '10. Contact', content: 'For questions about these terms, please contact us at legal@rent.ca.' },
]

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
        <p className={glassColors.text.muted}>Last updated: March 2026</p>
      </div>

      <div className={cn(glass.card, 'p-8 space-y-8')}>
        {sections.map((s) => (
          <div key={s.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h2>
            <p className={cn('text-sm leading-relaxed', glassColors.text.secondary)}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
