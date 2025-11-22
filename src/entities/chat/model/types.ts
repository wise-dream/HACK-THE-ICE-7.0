export interface ChatMessage {
  id?: number
  user: number
  message: string
  response: string
  created_at?: string
}

export interface ChatHistory {
  history: ChatMessage[]
}

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  response: string
  timestamp: string
}
