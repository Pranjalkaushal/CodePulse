import { http } from '../../../services/http'

export type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
}

// Sends the new message plus the conversation so far.
// The AI does not remember anything between requests, so we resend the history every time.
export async function sendChatMessage(message: string, history: ChatMessage[]) {
  const res = await http.post<{ reply: string }>('/api/chat', { message, history })
  return res.data.reply
}
