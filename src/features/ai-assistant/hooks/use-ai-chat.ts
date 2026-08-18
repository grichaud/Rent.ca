'use client'

import { useState, useCallback, useRef } from 'react'
import { useAIStore } from '../store/ai-store'
import type { AIMessage } from '../types/ai'

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

interface UseAIChatReturn {
  messages: AIMessage[]
  input: string
  isLoading: boolean
  error: string | null
  setInput: (value: string) => void
  sendMessage: (content?: string) => Promise<void>
  clearMessages: () => void
}

export function useAIChat(): UseAIChatReturn {
  const { context } = useAIStore()
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Refs to always read latest state inside the async callback (avoids stale closures)
  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const inputRef = useRef(input)
  inputRef.current = input
  const isLoadingRef = useRef(isLoading)
  isLoadingRef.current = isLoading
  const contextRef = useRef(context)
  contextRef.current = context

  const sendMessage = useCallback(
    async (overrideContent?: string) => {
      const content = (overrideContent ?? inputRef.current).trim()
      if (!content || isLoadingRef.current) return

      // Cancel any in-flight request
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setError(null)
      setInput('')

      const userMessage: AIMessage = {
        id: generateId(),
        role: 'user',
        content,
        createdAt: new Date(),
      }

      const assistantId = generateId()
      const assistantMessage: AIMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      }

      // Read the current messages from the ref (avoids stale closure)
      const currentMessages = messagesRef.current

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setIsLoading(true)

      // Build the history array to send (all previous messages + the new user message)
      const historyToSend = [
        ...currentMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content },
      ]

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyToSend, context: contextRef.current }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
          throw new Error((errorData as { error?: string }).error ?? `HTTP ${response.status}`)
        }

        if (!response.body) {
          throw new Error('No response body received')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          accumulated += decoder.decode(value, { stream: true })

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: accumulated } : msg
            )
          )
        }

        // Flush any remaining bytes from the decoder
        const remaining = decoder.decode()
        if (remaining) {
          accumulated += remaining
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: accumulated } : msg
            )
          )
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return

        const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
        setError(errorMessage)

        // Replace the empty assistant placeholder with an error message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: `Sorry, I encountered an error: ${errorMessage}` }
              : msg
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [] // stable callback — reads all mutable state via refs
  )

  const clearMessages = useCallback(() => {
    abortControllerRef.current?.abort()
    setMessages([])
    setInput('')
    setError(null)
  }, [])

  return {
    messages,
    input,
    isLoading,
    error,
    setInput,
    sendMessage,
    clearMessages,
  }
}
