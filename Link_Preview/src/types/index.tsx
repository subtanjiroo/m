export interface Message {
  id: number
  content: string
  type: "user" | "bot"
  model?: string
}

export interface UserInfo {
  name: string
  email: string
  phone: string
}

export interface PrivateAPIKey {
  id: number
  name: string
  api_first_3: string
  api_last_3: string
  last_used: string
  active: boolean
}

export interface UserUsage {
  day: string
  tokens: number
}