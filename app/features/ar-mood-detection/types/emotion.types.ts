export interface EmotionData {
  emotions: {
    [key: string]: number
  }
  dominant: string
  confidence: number
  timestamp: number
}

export interface ProductSuggestion {
  name: string
  description: string
  price: number
  category: string
  rating: number
  emoji: string
}

export interface MoodSuggestions {
  message: string
  products: ProductSuggestion[]
}

export type EmotionType =
  | "happy"
  | "sad"
  | "angry"
  | "surprised"
  | "fearful"
  | "disgusted"
  | "neutral"
  | "focused"
  | "tired"
  | "bored"
