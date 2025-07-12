import type { CartItem, BudgetData } from "../types/checkout.types"

export class BudgetAnalyzer {
  private static DEFAULT_BUDGET_LIMIT = 1000 // Default ₹1000 limit

  static calculateBudget(cart: CartItem[], customLimit?: number): BudgetData {
    const budgetLimit = customLimit || this.DEFAULT_BUDGET_LIMIT
    const spent = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const remaining = Math.max(0, budgetLimit - spent)
    const percentage = (spent / budgetLimit) * 100

    // Calculate potential savings from discounts
    const savings = cart.reduce((total, item) => {
      const originalPrice = item.price * 1.2 // Assume 20% markup as original
      return total + (originalPrice - item.price) * item.quantity
    }, 0)

    const projectedTotal = spent + spent * 0.18 // Add 18% tax

    return {
      limit: budgetLimit,
      spent,
      remaining,
      percentage: Math.min(100, percentage),
      savings,
      projectedTotal,
    }
  }

  static setBudgetLimit(limit: number): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user-budget-limit", limit.toString())
    }
  }

  static getBudgetLimit(): number {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user-budget-limit")
      if (stored) {
        return Number(stored)
      }
    }
    return this.DEFAULT_BUDGET_LIMIT
  }

  // Keep all other existing methods unchanged
  static getBudgetStatus(budget: BudgetData): "safe" | "warning" | "exceeded" {
    if (budget.percentage <= 60) return "safe"
    if (budget.percentage <= 100) return "warning"
    return "exceeded"
  }

  static getBudgetMessage(budget: BudgetData): string {
    const status = this.getBudgetStatus(budget)

    switch (status) {
      case "safe":
        return `Excellent! You have ₹${budget.remaining.toFixed(2)} left. You're saving ₹${budget.savings.toFixed(2)} with current deals!`
      case "warning":
        return `Almost there! ₹${budget.remaining.toFixed(2)} remaining. Consider removing some items or look for alternatives.`
      case "exceeded":
        return `Budget exceeded by ₹${Math.abs(budget.remaining).toFixed(2)}. Remove items worth ₹${Math.abs(budget.remaining).toFixed(2)} to stay on track.`
      default:
        return ""
    }
  }

  static getBudgetTips(budget: BudgetData): string[] {
    const tips: string[] = []

    if (budget.percentage > 80) {
      tips.push("Consider generic brands to save 15-30%")
      tips.push("Look for bulk discounts on frequently used items")
    }

    if (budget.savings > 50) {
      tips.push(`Great job! You're already saving ₹${budget.savings.toFixed(2)}`)
    }

    if (budget.remaining > 200) {
      tips.push("You have room for 2-3 more essential items")
    }

    return tips
  }
}
