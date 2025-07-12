export interface Product {
  id: string
  name: string
  brand: string
  price: number
  category: string
  description: string
  location: {
    aisle: string
    shelf: string
    position: string
  }
  nutritional?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  dietary: string[]
  image: string
  inStock: boolean
  alternatives?: string[]
}

export interface VoiceCommand {
  text: string
  confidence: number
  timestamp: number
}

export interface SearchFilters {
  priceRange?: [number, number]
  category?: string
  dietary?: string[]
  inStock?: boolean
}

export interface AROverlay {
  x: number
  y: number
  width: number
  height: number
  productId: string
  confidence: number
  detectedClass?: string
}
