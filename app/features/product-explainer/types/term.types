export interface Term {
  id: string
  name: string
  explanation: string
  simpleExplanation: string
  category: string
}

export interface ExplanationResponse {
  term: string
  explanation: string
  simpleExplanation: string
  source: "local" | "ai"
  isLoading?: boolean
}

export interface VoiceSettings {
  isListening: boolean
  isSpeaking: boolean
  isSupported: boolean
}

// New empathy assistant types
export interface EmpathyMood {
  mood: "anxious" | "sad" | "tired" | "overwhelmed"
  budget: 500 | 1000 | 1500
}

export interface Product {
  name: string
  description: string
  price: number
}

export interface EmpathyResponse {
  comfortMessage: string
  products: Product[]
  treatYourselfItem?: Product
  bundleName: string
  moodUplift: {
    type: "joke" | "music" | "selfcare"
    content: string
    link?: string
  }
  alternateMood?: string
  totalSpent: number
  remainingBudget: number
}
