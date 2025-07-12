export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  tags: string[]
  image?: string
  description?: string
  rating?: number
  inStock: boolean
}

export interface UserPreference {
  dietary: string[]
  categories: string[]
  priceRange: {
    min: number
    max: number
  }
  brands: string[]
  allergens: string[]
}

export interface UserMood {
  mood: string
  energy: "low" | "medium" | "high"
  timeOfDay: "morning" | "afternoon" | "evening" | "night"
  shoppingDuration: number
  weather?: string
  occasion?: string
}

export interface Recommendation {
  id: string
  name: string
  price: number
  reason: string
  category: string
  confidence: number
  image?: string
  description?: string
  rating?: number
  discount?: number
  urgency: "low" | "medium" | "high"
}

export interface BudgetData {
  limit: number
  spent: number
  remaining: number
  percentage: number
  savings: number
  projectedTotal: number
}

export interface CheckoutState {
  cart: CartItem[]
  budget: BudgetData
  preferences: UserPreference
  mood: UserMood
  recommendations: Recommendation[]
  personalizedMessage: string
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: "success" | "warning" | "error" | "info"
  message: string
  timestamp: number
  dismissed?: boolean
}
