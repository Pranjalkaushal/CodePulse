import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Alert } from '../../../components/ui/Alert'
import { cn } from '../../../utils/cn'
import { getErrorMessage } from '../../../utils/apiError'
import { sendChatMessage } from '../services/chatApi'
import type { ChatMessage } from '../services/chatApi'

const GREETING: ChatMessage = {
  role: 'assistant',
  text: "Hi! I'm your CodePulse study coach. I can see your LeetCode stats, so ask me what to practice next.",
}

const SUGGESTIONS = [
  'What should I practice next?',
  'How is my consistency?',
  'Make me a 7-day study plan',
]

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  // Keep the newest message in view.
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const send = async (raw: string) => {
    const text = raw.trim()
    if (!text || loading) return

    const history = messages // everything said before this new message
    setMessages([...history, { role: 'user', text }])
    setInput('')
    setError('')
    setLoading(true)
    try {
      const reply = await sendChatMessage(text, history)
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">AI Study Coach</h2>
        <p className="text-sm text-slate-600">Personalized tips based on your real LeetCode stats.</p>
      </div>

      <div ref={listRef} className="h-80 space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-3">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm leading-relaxed',
                m.role === 'user' ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-800',
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="flex justify-start">
            <div className="animate-pulse rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
              Thinking…
            </div>
          </div>
        ) : null}
      </div>

      {messages.length === 1 ? (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Button key={s} type="button" variant="secondary" className="text-xs" onClick={() => send(s)} disabled={loading}>
              {s}
            </Button>
          ))}
        </div>
      ) : null}

      {error ? <Alert title="Couldn't get a reply" description={error} /> : null}

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={500}
          placeholder="Ask about your progress or what to study next…"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          Send
        </Button>
      </form>
    </Card>
  )
}
