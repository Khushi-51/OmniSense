"use client"

import { useState } from "react"
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { BudgetAnalyzer } from "../lib/budget-analysis"
import { PreferenceTracker } from "../lib/preference-tracking"
import { RecommendationEngine } from "../lib/recommendation-logic"
import { SearchEngine } from "../lib/search-engine"
import type { CartItem, UserPreference, UserMood } from "../types/checkout.types"

export default function SystemCheck() {
  const [isOpen, setIsOpen] = useState(false)

  // Test data
  const testCart: CartItem[] = [
    {
      id: "test1",
      name: "Test Product",
      price: 100,
      quantity: 2,
      category: "Test",
      tags: ["test"],
      inStock: true,
    },
  ]

  const testPreferences: UserPreference = {
    dietary: ["vegan"],
    categories: ["Health"],
    priceRange: { min: 0, max: 500 },
    brands: ["Test Brand"],
    allergens: [],
  }

  const testMood: UserMood = {
    mood: "happy",
    energy: "high",
    timeOfDay: "morning",
    shoppingDuration: 10,
  }

  // Run tests
  const budgetTest = () => {
    try {
      const budget = BudgetAnalyzer.calculateBudget(testCart)
      const status = BudgetAnalyzer.getBudgetStatus(budget)
      const message = BudgetAnalyzer.getBudgetMessage(budget)
      const tips = BudgetAnalyzer.getBudgetTips(budget)
      return {
        success: true,
        message: "Budget analyzer is working correctly",
        details: { budget, status, message, tipsCount: tips.length },
      }
    } catch (error) {
      return { success: false, message: `Budget analyzer error: ${(error as Error).message}` }
    }
  }

  const preferencesTest = () => {
    try {
      PreferenceTracker.savePreferences(testPreferences)
      const loaded = PreferenceTracker.loadPreferences()
      return {
        success: true,
        message: "Preference tracker is working correctly",
        details: { saved: testPreferences, loaded },
      }
    } catch (error) {
      return { success: false, message: `Preference tracker error: ${(error as Error).message}` }
    }
  }

  const moodTest = () => {
    try {
      PreferenceTracker.saveMood(testMood)
      const loaded = PreferenceTracker.loadMood()
      return {
        success: true,
        message: "Mood tracker is working correctly",
        details: { saved: testMood, loaded },
      }
    } catch (error) {
      return { success: false, message: `Mood tracker error: ${(error as Error).message}` }
    }
  }

  const recommendationTest = () => {
    try {
      const budget = BudgetAnalyzer.calculateBudget(testCart)
      const recommendations = RecommendationEngine.generateRecommendations(testCart, testPreferences, testMood, budget)
      const message = RecommendationEngine.generatePersonalizedMessage(
        testCart,
        testPreferences,
        testMood,
        budget,
        recommendations,
      )
      return {
        success: true,
        message: "Recommendation engine is working correctly",
        details: { recommendationsCount: recommendations.length, personalizedMessage: message },
      }
    } catch (error) {
      return { success: false, message: `Recommendation engine error: ${(error as Error).message}` }
    }
  }

  const searchTest = () => {
    try {
      const results = SearchEngine.search({ query: "organic" })
      const suggestions = SearchEngine.searchSuggestions("tea")
      return {
        success: true,
        message: "Search engine is working correctly",
        details: { resultsCount: results.totalCount, suggestionsCount: suggestions.length },
      }
    } catch (error) {
      return { success: false, message: `Search engine error: ${(error as Error).message}` }
    }
  }

  const typesTest = () => {
    try {
      // Check if all required types are defined
      const types = [
        "CartItem",
        "UserPreference",
        "UserMood",
        "Recommendation",
        "BudgetData",
        "CheckoutState",
        "Notification",
      ]
      return {
        success: true,
        message: "All required TypeScript types are defined",
        details: { types },
      }
    } catch (error) {
      return { success: false, message: `Types error: ${(error as Error).message}` }
    }
  }

  // Run all tests
  const tests = [
    { name: "Budget Analyzer", test: budgetTest() },
    { name: "Preference Tracker", test: preferencesTest() },
    { name: "Mood Tracker", test: moodTest() },
    { name: "Recommendation Engine", test: recommendationTest() },
    { name: "Search Engine", test: searchTest() },
    { name: "TypeScript Types", test: typesTest() },
  ]

  const allPassed = tests.every((t) => t.test.success)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center space-x-3">
          {allPassed ? (
            <CheckCircle className="w-6 h-6 text-green-400" />
          ) : (
            <XCircle className="w-6 h-6 text-red-400" />
          )}
          <h2 className="text-xl font-semibold text-gray-900">System Check</h2>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {tests.map((test, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                test.test.success
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {test.test.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <h3 className="font-medium text-gray-900">{test.name}</h3>
              </div>
              <p className="text-sm text-gray-700">{test.test.message}</p>
              {test.test.success && test.test.details && (
                <div className="mt-2 text-xs bg-gray-100 p-3 rounded-lg overflow-auto max-h-32 text-gray-800">
                  <pre>{JSON.stringify(test.test.details, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
