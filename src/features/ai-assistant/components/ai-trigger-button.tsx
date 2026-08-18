'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface Props {
  onClick: () => void
  unreadCount?: number
}

export function AITriggerButton({ onClick, unreadCount }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Open AI Assistant"
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'h-14 w-14 rounded-full',
        'bg-gradient-to-br from-brand-500/80 to-cyan-500/80',
        'backdrop-blur-xl border border-white/20',
        'shadow-xl shadow-brand-500/30',
        'hover:shadow-2xl hover:shadow-brand-500/50',
        'hover:scale-110 active:scale-95',
        'transition-all duration-300',
        'flex items-center justify-center',
        'animate-glow'
      )}
    >
      <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
      {unreadCount !== undefined && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-slate-950 text-xs font-bold text-white flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}
