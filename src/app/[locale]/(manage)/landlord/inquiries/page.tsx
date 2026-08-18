import type { Metadata } from 'next'
import { InquiriesList } from '@/features/landlord-manage/components/inquiries-list'

export const metadata: Metadata = {
  title: 'Inquiries',
}

export default function InquiriesPage() {
  return <InquiriesList />
}
