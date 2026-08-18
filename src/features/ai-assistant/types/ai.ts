export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
}

export interface AIContext {
  currentPage?: string
  currentCity?: string
  currentPropertyId?: string
  searchFilters?: Record<string, unknown>
}

export interface AIState {
  isOpen: boolean
  messages: AIMessage[]
  context: AIContext
  isLoading: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
