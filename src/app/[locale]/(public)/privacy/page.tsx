import type { Metadata } from 'next'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

const sections = [
  { title: '1. Information We Collect', content: 'We collect information you provide directly: name, email, phone number when you create an account. We also collect usage data such as search queries, pages visited, and interactions with our AI assistant to improve our services.' },
  { title: '2. How We Use Information', content: 'We use your information to: provide and improve our services, personalize your experience, send alerts and notifications you\'ve requested, enable communication between renters and landlords, and improve our AI assistant\'s responses.' },
  { title: '3. AI Assistant Data', content: 'Conversations with our AI assistant may be stored to improve service quality. These conversations are associated with your account if logged in, or stored anonymously. You can delete your conversation history at any time.' },
  { title: '4. Information Sharing', content: 'We do not sell your personal information. We share information only: with landlords when you submit an inquiry, with service providers who help us operate our platform, and when required by law.' },
  { title: '5. Data Security', content: 'We implement industry-standard security measures to protect your data, including encryption in transit and at rest. However, no method of electronic transmission is 100% secure.' },
  { title: '6. Cookies', content: 'We use cookies and similar technologies to maintain your session, remember preferences, and analyze usage patterns. You can control cookie settings in your browser.' },
  { title: '7. Your Rights', content: 'Under Canadian privacy law (PIPEDA), you have the right to: access your personal information, request corrections, withdraw consent, and request deletion of your data. Contact us to exercise these rights.' },
  { title: '8. Data Retention', content: 'We retain your account data while your account is active. After account deletion, we may retain anonymized data for analytics purposes. Conversation history is retained for 90 days unless manually deleted.' },
  { title: '9. Changes to Policy', content: 'We may update this privacy policy periodically. We will notify you of significant changes via email or platform notification.' },
  { title: '10. Contact', content: 'For privacy inquiries, contact our Privacy Officer at privacy@rent.ca.' },
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
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
