import type { UserPreference, UserMood } from "../types/checkout.types"

export class PreferenceTracker {
  private static STORAGE_KEY = "checkout-preferences"
  private static MOOD_KEY = "user-mood"
  private static HISTORY_KEY = "shopping-history"

  static savePreferences(preferences: UserPreference): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences))
    }
  }

  static loadPreferences(): UserPreference {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    }

    return {
      dietary: ["Low sugar", "Organic"],
      categories: ["Health", "Snacks", "Beverages"],
      priceRange: { min: 0, max: 500 },
      brands: ["Healthy Choice", "Nature Valley", "Organic India"],
      allergens: [],
    }
  }

  static saveMood(mood: UserMood): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        this.MOOD_KEY,
        JSON.stringify({
          ...mood,
          timestamp: Date.now(),
        }),
      )
    }
  }

  static loadMood(): UserMood {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.MOOD_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (Date.now() - data.timestamp < 3600000) {
          return data
        }
      }
    }

    const currentHour = new Date().getHours()
    let timeOfDay: UserMood["timeOfDay"] = "afternoon"

    if (currentHour < 12) timeOfDay = "morning"
    else if (currentHour < 17) timeOfDay = "afternoon"
    else if (currentHour < 21) timeOfDay = "evening"
    else timeOfDay = "night"

    return {
      mood: "Feeling good",
      energy: "medium",
      timeOfDay,
      shoppingDuration: 5,
      weather: "pleasant",
      occasion: "regular shopping",
    }
  }

  static updateShoppingDuration(startTime: number): void {
    const mood = this.loadMood()
    const duration = Math.floor((Date.now() - startTime) / 60000)
    this.saveMood({ ...mood, shoppingDuration: duration })
  }

  static saveShoppingHistory(cart: any[], totalSpent: number): void {
    if (typeof window !== "undefined") {
      const history = this.getShoppingHistory()
      history.push({
        date: new Date().toISOString(),
        items: cart.length,
        totalSpent,
        categories: [...new Set(cart.map((item) => item.category))],
      })

      // Keep only last 10 shopping sessions
      const recentHistory = history.slice(-10)
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(recentHistory))
    }
  }

  static getShoppingHistory(): any[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    }
    return []
  }
}
