"use client"

import { useState } from "react"
import type { CartItem, UserPreference, UserMood } from "../types/checkout.types"
import { PreferenceTracker } from "../lib/preference-tracking"
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Heart,
  Clock,
  Zap,
  Sun,
  Moon,
  Cloud,
  ShoppingCart,
  CreditCard,
  Shield,
  Truck,
} from "lucide-react"

interface CheckoutSummaryProps {
  personalizedMessage: string
  cart: CartItem[]
  preferences: UserPreference
  mood: UserMood
  onUpdatePreferences: (preferences: UserPreference) => void
  onUpdateMood: (mood: UserMood) => void
}

export default function CheckoutSummary({
  personalizedMessage,
  cart,
  preferences,
  mood,
  onUpdatePreferences,
  onUpdateMood,
}: CheckoutSummaryProps) {
  const [showPreferences, setShowPreferences] = useState(false)
  const [showMoodTracker, setShowMoodTracker] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxAmount = totalAmount * 0.18
  const finalAmount = totalAmount + taxAmount

  const handlePreferenceChange = (field: keyof UserPreference, value: any) => {
    const updated = { ...preferences, [field]: value }
    onUpdatePreferences(updated)
    PreferenceTracker.savePreferences(updated)
  }

  const handleMoodChange = (field: keyof UserMood, value: any) => {
    const updated = { ...mood, [field]: value }
    onUpdateMood(updated)
    PreferenceTracker.saveMood(updated)
  }

  const handleCheckout = async () => {
    setIsProcessing(true)
    // Simulate checkout process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    PreferenceTracker.saveShoppingHistory(cart, finalAmount)
    setIsProcessing(false)
    // In a real app, this would redirect to payment
    alert("Checkout successful! (This is a demo)")
  }

  const getMoodIcon = (moodValue: string) => {
    if (moodValue.toLowerCase().includes("tired")) return <Moon className="w-4 h-4" />
    if (moodValue.toLowerCase().includes("energetic")) return <Zap className="w-4 h-4" />
    if (moodValue.toLowerCase().includes("happy")) return <Sun className="w-4 h-4" />
    return <Heart className="w-4 h-4" />
  }

  const getTimeIcon = (timeOfDay: UserMood["timeOfDay"]) => {
    switch (timeOfDay) {
      case "morning":
        return <Sun className="w-4 h-4 text-yellow-500" />
      case "afternoon":
        return <Sun className="w-4 h-4 text-orange-500" />
      case "evening":
        return <Cloud className="w-4 h-4 text-blue-500" />
      case "night":
        return <Moon className="w-4 h-4 text-purple-500" />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Personalized Message */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl border-b border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Your Personal Shopping Assistant</h3>
            <p className="text-blue-800 font-medium text-sm leading-relaxed">{personalizedMessage}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
            Order Summary
          </h3>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              {cart.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.image || "/placeholder.svg?height=32&width=32"}
                      alt={item.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="truncate max-w-32">{item.name}</span>
                    <span className="text-gray-500">× {item.quantity}</span>
                  </div>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              {cart.length > 3 && (
                <div className="text-sm text-gray-500 text-center py-2">+{cart.length - 3} more items</div>
              )}

              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%):</span>
                  <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Shopping Preferences</span>
            </div>
            {showPreferences ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showPreferences && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {["Low sugar", "Organic", "Gluten-free", "Vegan", "Keto", "High protein"].map((diet) => (
                    <button
                      key={diet}
                      onClick={() => {
                        const updated = preferences.dietary.includes(diet)
                          ? preferences.dietary.filter((d) => d !== diet)
                          : [...preferences.dietary, diet]
                        handlePreferenceChange("dietary", updated)
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        preferences.dietary.includes(diet)
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (per item)</label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={preferences.priceRange.max}
                      onChange={(e) =>
                        handlePreferenceChange("priceRange", {
                          ...preferences.priceRange,
                          max: Number(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>₹0</span>
                      <span>₹{preferences.priceRange.max}</span>
                      <span>₹1000+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Allergens to Avoid</label>
                <div className="flex flex-wrap gap-2">
                  {["Nuts", "Dairy", "Gluten", "Soy", "Eggs"].map((allergen) => (
                    <button
                      key={allergen}
                      onClick={() => {
                        const updated = preferences.allergens.includes(allergen)
                          ? preferences.allergens.filter((a) => a !== allergen)
                          : [...preferences.allergens, allergen]
                        handlePreferenceChange("allergens", updated)
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        preferences.allergens.includes(allergen)
                          ? "bg-red-100 text-red-800 border-2 border-red-300"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mood Tracker Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowMoodTracker(!showMoodTracker)}
            className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-gray-600" />
              <span>Mood & Context</span>
            </div>
            {showMoodTracker ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showMoodTracker && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">How are you feeling?</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "Feeling great", icon: <Sun className="w-4 h-4" /> },
                    { value: "Feeling tired", icon: <Moon className="w-4 h-4" /> },
                    { value: "Stressed", icon: <Zap className="w-4 h-4" /> },
                    { value: "Relaxed", icon: <Heart className="w-4 h-4" /> },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleMoodChange("mood", option.value)}
                      className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-all ${
                        mood.mood === option.value
                          ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option.icon}
                      <span>{option.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Energy Level</label>
                <div className="flex space-x-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => handleMoodChange("energy", level)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        mood.energy === level
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                  <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border">
                    {getTimeIcon(mood.timeOfDay)}
                    <span className="text-sm capitalize">{mood.timeOfDay}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shopping Time</label>
                  <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{mood.shoppingDuration} min</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security & Delivery Info */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Secure Checkout</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">Free Delivery</span>
            </div>
          </div>
          <p className="text-sm text-green-700">
            Your payment is secured with 256-bit SSL encryption. Free delivery on orders above ₹500.
          </p>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing || cart.length === 0}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Proceed to Checkout (₹{finalAmount.toFixed(2)})</span>
            </>
          )}
        </button>

        {cart.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-3">Add items to your cart to proceed with checkout</p>
        )}
      </div>
    </div>
  )
}
