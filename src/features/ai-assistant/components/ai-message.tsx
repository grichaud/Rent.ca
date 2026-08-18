'use client'

import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { AIMessage as AIMessageType } from '../types/ai'

interface Props {
  message: AIMessageType
}

/** Renders bold (**text**) and inline code (`code`) from simple markdown. */
function renderMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g)

  return parts
    .filter((part): part is string => part != null && part !== '')
    .map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-white/10 rounded px-1 py-0.5 text-xs font-mono text-brand-300">
          {part.slice(1, -1)}
        </code>
      )
    }
    // Render line breaks
    return part.split('\n').map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < part.split('\n').length - 1 && <br />}
      </span>
    ))
  })
}

export function AIMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? cn(glass.base, 'bg-brand-500/20 border-brand-500/30 text-gray-900 dark:text-white')
            : cn(glass.base, 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/90')
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="whitespace-pre-wrap break-words">
            {message.content ? (
              renderMarkdown(message.content)
            ) : (
              <TypingIndicator />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-white/50 animate-bounce [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-white/50 animate-bounce [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-white/50 animate-bounce [animation-delay:300ms]" />
    </span>
  )
}
