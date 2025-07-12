export interface EmotionData {
  emotions: {
    happy: number
    sad: number
    angry: number
    surprised: number
    fearful: number
    disgusted: number
    neutral: number
  }
  dominant: string
  confidence: number
  timestamp: number
  age?: number
  gender?: string
  genderProbability?: number
}

export interface AnalysisResult {
  finalMood: string
  confidence: number
  emotionBreakdown: { [key: string]: number }
  analysisTime: number
  samplesCollected: number
  dominantEmotions: string[]
  moodStability: number
  moodTrend?: "improving" | "declining" | "stable"
  emotionalRange?: number
  consistencyScore?: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  moodMatch: number
  tags: string[]
  rating: number
  reviews: number
}

export interface MoodProductMapping {
  [mood: string]: {
    primaryProducts: Product[]
    secondaryProducts: Product[]
    description: string
    benefits: string[]
  }
}
