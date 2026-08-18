'use client'

import { X, Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { useAIStore } from '../store/ai-store'
import { useAIChat } from '../hooks/use-ai-chat'
import { AITriggerButton } from './ai-trigger-button'
import { AIChatPanel } from './ai-chat-panel'

export function AIChatWidget() {
  const { isOpen, open, close } = useAIStore()
  const { messages, input, isLoading, error, setInput, sendMessage, clearMessages } = useAIChat()

  function handleClose() {
    close()
  }

  function handleClear() {
    clearMessages()
  }

  return (
    <>
      {/* Floating trigger button — hidden when panel is open */}
      {!isOpen && <AITriggerButton onClick={open} />}

      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
          glass.modal,
          'flex flex-col overflow-hidden',
          'transition-all duration-300 origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        )}
        aria-hidden={!isOpen}
      >
        {/* Top highlight line */}
        <div className={glass.highlight} />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-brand-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">Rent.ca Assistant</p>
              <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
                {isLoading ? 'Thinking...' : 'Online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleClose}
              aria-label="Close AI Assistant"
              className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500 dark:text-white/60" />
            </button>
          </div>
        </div>

        {/* Chat content */}
        <div className="flex-1 min-h-0">
          <AIChatPanel
            messages={messages}
            input={input}
            isLoading={isLoading}
            error={error}
            onInputChange={setInput}
            onSend={sendMessage}
          />
        </div>
      </div>
    </>
  )
}
