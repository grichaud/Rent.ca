'use client'

import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'

interface Props {
  onSelect: (suggestion: string) => void
}

const SUGGESTIONS = [
  'Find pet-friendly apartments in Toronto',
  "What's the average rent in Vancouver?",
  'Help me set up a listing alert',
  'What are my rights as a tenant in Ontario?',
  'Show me furnished studios under $1,800/mo',
]

export function AISuggestionChips({ onSelect }: Props) {
  return (
    <div className="px-4 pb-3">
      <p className="text-xs text-gray-500 dark:text-white/40 mb-2">Try asking:</p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSelect(suggestion)}
            className={cn(
              glass.badge,
              'text-xs text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/15 transition-colors duration-200 cursor-pointer text-left'
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
