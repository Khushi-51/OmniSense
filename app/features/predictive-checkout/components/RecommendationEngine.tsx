"use client"

import { useState } from "react"
import type { Recommendation } from "../types/checkout.types"
import { Plus, Star, Clock, Zap, Heart, Sparkles } from "lucide-react"

interface RecommendationEngineProps {
  recommendations: Recommendation[]
  onAddToCart: (recommendation: Recommendation) => void
}

export default function RecommendationEngine({ recommendations, onAddToCart }: RecommendationEngineProps) {
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set())

  const handleAddToCart = async (recommendation: Recommendation) => {
    setAddingItems((prev) => new Set(prev).add(recommendation.id))

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAddToCart(recommendation)
    setAddingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(recommendation.id)
      return newSet
    })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-gray-600"
  }

  const getConfidenceStars = (confidence: number) => {
    return Math.round(confidence * 5)
  }

  const getUrgencyIcon = (urgency: Recommendation["urgency"]) => {
    switch (urgency) {
      case "high":
        return <Zap className="w-4 h-4 text-orange-500" />
      case "medium":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "low":
        return <Heart className="w-4 h-4 text-gray-400" />
    }
  }

  const getUrgencyBadge = (urgency: Recommendation["urgency"]) => {
    switch (urgency) {
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Recommendations</h2>
            <p className="text-sm text-gray-500">Personalized just for you</p>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="text-sm text-gray-500">{recommendations.length} suggestions</div>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No recommendations yet</p>
          <p className="text-gray-400 text-sm">Add items to your cart to get personalized suggestions!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="group border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-300 hover:border-purple-200 bg-gradient-to-r from-white to-gray-50"
            >
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={
                      rec.image ||
                      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop&auto=format"
                    }
                    alt={rec.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                  {rec.discount && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{rec.discount}%
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-base text-gray-900 truncate">{rec.name}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyBadge(rec.urgency)}`}
                        >
                          {rec.urgency}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-2">{rec.category}</p>

                      {rec.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{rec.description}</p>}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start space-x-2">
                          <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-800 font-medium">{rec.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < getConfidenceStars(rec.confidence)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center space-x-1">
                            {getUrgencyIcon(rec.urgency)}
                            <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                              {(rec.confidence * 100).toFixed(0)}% match
                            </span>
                          </div>

                          {rec.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{rec.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="mb-3">
                        {rec.discount ? (
                          <div>
                            <p className="text-sm text-gray-500 line-through">
                              ₹{(rec.price / (1 - rec.discount / 100)).toFixed(2)}
                            </p>
                            <p className="text-xl font-bold text-green-600">₹{rec.price.toFixed(2)}</p>
                          </div>
                        ) : (
                          <p className="text-xl font-bold text-gray-900">₹{rec.price.toFixed(2)}</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(rec)}
                        disabled={addingItems.has(rec.id)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addingItems.has(rec.id) ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
