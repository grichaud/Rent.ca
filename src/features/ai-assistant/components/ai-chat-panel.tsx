'use client'

import { useEffect, useRef, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { AIMessage } from './ai-message'
import { AISuggestionChips } from './ai-suggestion-chips'
import type { AIMessage as AIMessageType } from '../types/ai'

interface Props {
  messages: AIMessageType[]
  input: string
  isLoading: boolean
  error: string | null
  onInputChange: (value: string) => void
  onSend: (content?: string) => void
}

export function AIChatPanel({ messages, input, isLoading, error, onInputChange, onSend }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isEmpty = messages.length === 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Pass the DOM value directly to avoid stale-state timing issues
      const value = e.currentTarget.value.trim()
      if (value) onSend(value)
    }
  }

  function handleSuggestion(suggestion: string) {
    onSend(suggestion)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 pb-4">
            <div className="h-12 w-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <p className="text-gray-800 dark:text-white/80 text-sm font-medium">How can I help you find your next home?</p>
              <p className="text-gray-500 dark:text-white/40 text-xs mt-1">Ask about listings, rent prices, or tenant rights.</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <AIMessage key={msg.id} message={msg} />
          ))
        )}

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions shown when chat is empty */}
      {isEmpty && (
        <AISuggestionChips onSelect={handleSuggestion} />
      )}

      {/* Input area */}
      <div className={cn(glass.base, 'mx-3 mb-3 flex items-end gap-2 p-2 rounded-2xl')}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about rentals in Canada..."
          rows={1}
          disabled={isLoading}
          className={cn(
            'flex-1 resize-none bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40',
            'outline-none leading-relaxed py-1 px-1 max-h-24 overflow-y-auto',
            'disabled:opacity-50'
          )}
          style={{ minHeight: '24px' }}
        />
        <button
          onClick={() => onSend(input)}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          className={cn(
            'h-8 w-8 rounded-xl flex items-center justify-center shrink-0',
            'bg-brand-500/30 hover:bg-brand-500/50 border border-brand-500/40',
            'transition-all duration-200 hover:scale-105 active:scale-95',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
        >
          <Send className="h-4 w-4 text-brand-300" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
