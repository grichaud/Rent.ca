import { create } from 'zustand'
import type { AIContext } from '../types/ai'

interface AIStore {
  isOpen: boolean
  context: AIContext
  toggle: () => void
  open: () => void
  close: () => void
  setContext: (context: Partial<AIContext>) => void
}

export const useAIStore = create<AIStore>((set) => ({
  isOpen: false,
  context: {},

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  setContext: (partialContext) =>
    set((state) => ({
      context: { ...state.context, ...partialContext },
    })),
}))
