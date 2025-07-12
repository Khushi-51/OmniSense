import type { CartItem, UserPreference, UserMood, Recommendation, BudgetData } from "../types/checkout.types"

export class RecommendationEngine {
  private static mockProducts: Omit<Recommendation, "reason" | "confidence" | "urgency">[] = [
    {
      id: "r1",
      name: "Chamomile Herbal Tea",
      price: 120,
      category: "Beverages",
      image: "/placeholder.svg?height=100&width=100",
      description: "Relaxing herbal tea perfect for evening",
      rating: 4.5,
      discount: 10,
    },
    {
      id: "r2",
      name: "70% Dark Chocolate",
      price: 80,
      category: "Snacks",
      image: "/placeholder.svg?height=100&width=100",
      description: "Rich antioxidant dark chocolate",
      rating: 4.7,
    },
    {
      id: "r3",
      name: "Weighted Comfort Blanket",
      price: 450,
      category: "Home",
      image: "/placeholder.svg?height=100&width=100",
      description: "Ultra-soft weighted blanket for better sleep",
      rating: 4.8,
      discount: 15,
    },
    {
      id: "r4",
      name: "Lavender Essential Oil",
      price: 200,
      category: "Wellness",
      image: "/placeholder.svg?height=100&width=100",
      description: "Pure lavender oil for aromatherapy",
      rating: 4.6,
    },
    {
      id: "r5",
      name: "Plant-Based Protein Bar",
      price: 60,
      category: "Health",
      image: "/placeholder.svg?height=100&width=100",
      description: "Organic protein bar with superfoods",
      rating: 4.3,
    },
    {
      id: "r6",
      name: "Himalayan Salt Candle",
      price: 150,
      category: "Home",
      image: "/placeholder.svg?height=100&width=100",
      description: "Natural salt candle for ambiance",
      rating: 4.4,
      discount: 20,
    },
    {
      id: "r7",
      name: "Green Superfood Smoothie Mix",
      price: 180,
      category: "Health",
      image: "/placeholder.svg?height=100&width=100",
      description: "Nutrient-dense smoothie powder",
      rating: 4.2,
    },
    {
      id: "r8",
      name: "Cozy Reading Socks",
      price: 90,
      category: "Comfort",
      image: "/placeholder.svg?height=100&width=100",
      description: "Ultra-soft bamboo fiber socks",
      rating: 4.5,
    },
  ]

  static generateRecommendations(
    cart: CartItem[],
    preferences: UserPreference,
    mood: UserMood,
    budget: BudgetData,
  ): Recommendation[] {
    const recommendations: Recommendation[] = []
    const cartCategories = new Set(cart.map((item) => item.category))
    const affordableProducts = this.mockProducts.filter((product) => product.price <= budget.remaining)

    // Mood-based recommendations with higher priority
    if (mood.mood.toLowerCase().includes("tired") || mood.energy === "low") {
      const comfortItems = affordableProducts.filter(
        (p) =>
          p.category === "Home" ||
          p.name.toLowerCase().includes("tea") ||
          p.name.toLowerCase().includes("chocolate") ||
          p.category === "Comfort",
      )

      comfortItems.slice(0, 2).forEach((item) => {
        recommendations.push({
          ...item,
          reason: `Perfect for when you're ${mood.mood.toLowerCase()} - designed for comfort and relaxation`,
          confidence: 0.88,
          urgency: "high",
        })
      })
    }

    // Energy-based recommendations
    if (mood.energy === "high") {
      const energyItems = affordableProducts.filter(
        (p) => p.category === "Health" || p.name.toLowerCase().includes("protein"),
      )

      energyItems.slice(0, 1).forEach((item) => {
        recommendations.push({
          ...item,
          reason: "Great for maintaining your high energy levels",
          confidence: 0.75,
          urgency: "medium",
        })
      })
    }

    // Time-based recommendations
    if (mood.timeOfDay === "evening" || mood.timeOfDay === "night") {
      const eveningItems = affordableProducts.filter(
        (p) =>
          p.name.toLowerCase().includes("tea") || p.name.toLowerCase().includes("candle") || p.category === "Wellness",
      )

      eveningItems.slice(0, 1).forEach((item) => {
        if (!recommendations.find((r) => r.id === item.id)) {
          recommendations.push({
            ...item,
            reason: `Perfect for your ${mood.timeOfDay} routine - promotes relaxation`,
            confidence: 0.82,
            urgency: "medium",
          })
        }
      })
    }

    // Preference-based recommendations
    preferences.dietary.forEach((diet) => {
      if (diet.toLowerCase().includes("organic")) {
        const organicItems = affordableProducts.filter(
          (p) => p.description?.toLowerCase().includes("organic") || p.name.toLowerCase().includes("organic"),
        )

        organicItems.slice(0, 1).forEach((item) => {
          if (!recommendations.find((r) => r.id === item.id)) {
            recommendations.push({
              ...item,
              reason: `Matches your ${diet} preference - certified organic`,
              confidence: 0.78,
              urgency: "low",
            })
          }
        })
      }
    })

    // Complementary items based on cart
    if (cartCategories.has("Health")) {
      const healthItems = affordableProducts.filter(
        (p) => p.category === "Health" && !cart.find((c) => c.name === p.name),
      )

      healthItems.slice(0, 1).forEach((item) => {
        if (!recommendations.find((r) => r.id === item.id)) {
          recommendations.push({
            ...item,
            reason: "Complements your healthy choices perfectly",
            confidence: 0.72,
            urgency: "low",
          })
        }
      })
    }

    // Budget-conscious recommendations
    if (budget.remaining > 100 && budget.remaining < 300) {
      const budgetFriendly = affordableProducts.filter((p) => p.price < budget.remaining * 0.4 && p.discount)

      budgetFriendly.slice(0, 1).forEach((item) => {
        if (!recommendations.find((r) => r.id === item.id)) {
          recommendations.push({
            ...item,
            reason: `Great deal! ${item.discount}% off - fits perfectly in your remaining budget`,
            confidence: 0.85,
            urgency: "high",
          })
        }
      })
    }

    // Sort by confidence and urgency
    return recommendations
      .sort((a, b) => {
        const urgencyWeight = { high: 3, medium: 2, low: 1 }
        const aScore = a.confidence * 0.7 + urgencyWeight[a.urgency] * 0.3
        const bScore = b.confidence * 0.7 + urgencyWeight[b.urgency] * 0.3
        return bScore - aScore
      })
      .slice(0, 4)
  }

  static generatePersonalizedMessage(
    cart: CartItem[],
    preferences: UserPreference,
    mood: UserMood,
    budget: BudgetData,
    recommendations: Recommendation[],
  ): string {
    const hasHealthyItems = cart.some(
      (item) =>
        item.tags.includes("healthy") ||
        item.category === "Health" ||
        preferences.dietary.some((diet) => item.tags.includes(diet.toLowerCase())),
    )

    const isUnderBudget = budget.remaining > 0
    const budgetStatus = budget.percentage <= 70 ? "well under" : budget.percentage <= 90 ? "close to" : "over"

    const moodAdjective = this.getMoodAdjective(mood)
    const timeGreeting = this.getTimeGreeting(mood.timeOfDay)

    if (hasHealthyItems && isUnderBudget && recommendations.length > 0) {
      return `${timeGreeting}! You're making healthy choices and staying ${budgetStatus} budget. Want to add ${recommendations.length} ${moodAdjective} items that match your vibe?`
    } else if (isUnderBudget && recommendations.length > 0) {
      return `${timeGreeting}! You're ${budgetStatus} budget with ₹${budget.remaining.toFixed(2)} left. Perfect for these ${moodAdjective} additions!`
    } else if (hasHealthyItems) {
      return `Love your healthy choices! You're ${budgetStatus} budget. Consider these wellness items for next time.`
    } else if (budget.percentage > 100) {
      return `You're slightly over budget. Remove ₹${Math.abs(budget.remaining).toFixed(2)} worth of items, or check out these budget-friendly alternatives.`
    } else {
      return `${timeGreeting}! Your cart looks great. Here are some personalized suggestions based on your ${mood.mood.toLowerCase()} mood.`
    }
  }

  private static getMoodAdjective(mood: UserMood): string {
    if (mood.mood.toLowerCase().includes("tired")) return "cozy"
    if (mood.mood.toLowerCase().includes("stressed")) return "calming"
    if (mood.mood.toLowerCase().includes("happy")) return "delightful"
    if (mood.energy === "high") return "energizing"
    if (mood.timeOfDay === "evening") return "relaxing"
    return "perfect"
  }

  private static getTimeGreeting(timeOfDay: UserMood["timeOfDay"]): string {
    switch (timeOfDay) {
      case "morning":
        return "Good morning"
      case "afternoon":
        return "Good afternoon"
      case "evening":
        return "Good evening"
      case "night":
        return "Late night shopping"
      default:
        return "Hello"
    }
  }
}
