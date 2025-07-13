"use client"

import { useState, useEffect } from "react"
import type {
  CartItem,
  UserPreference,
  UserMood,
  Recommendation,
  CheckoutState,
  Notification,
} from "./types/checkout.types"
import type { Product } from "./data/products"
import type { SearchFilters as SearchFiltersType } from "./lib/search-engine"
import { BudgetAnalyzer } from "./lib/budget-analysis"
import { PreferenceTracker } from "./lib/preference-tracking"
import { RecommendationEngine } from "./lib/recommendation-logic"
import { SearchEngine } from "./lib/search-engine"
import CartTracker from "./components/CartTracker"
import BudgetMonitor from "./components/BudgetMonitor"
import RecommendationComponent from "./components/RecommendationEngine"
import CheckoutSummary from "./components/CheckoutSummary"
import SearchBar from "./components/SearchBar"
import ProductGrid from "./components/ProductGrid"
import SearchFiltersComponent from "./components/SearchFilters"
import { X, CheckCircle, AlertTriangle, Info, XCircle, Sparkles, ShoppingBag, Target, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import BudgetSetter from "./components/BudgetSetter"

// Enhanced mock cart data with realistic product images
const initialCart: CartItem[] = [
  {
    id: "1",
    name: "Organic Almonds Premium",
    price: 250,
    quantity: 1,
    category: "Health",
    tags: ["healthy", "organic", "nuts", "protein"],
    image: "https://images.unsplash.com/photo-1508747760841-d0e60d5e90e0?w=150&h=150&fit=crop&auto=format",
    description: "Premium quality organic almonds rich in vitamin E and healthy fats",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "2",
    name: "Green Tea Detox Blend",
    price: 120,
    quantity: 2,
    category: "Beverages",
    tags: ["healthy", "antioxidants", "detox", "organic"],
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=150&h=150&fit=crop&auto=format",
    description: "Refreshing green tea blend with natural detox properties",
    rating: 4.3,
    inStock: true,
  },
  {
    id: "3",
    name: "70% Dark Chocolate Bar",
    price: 80,
    quantity: 1,
    category: "Snacks",
    tags: ["low-sugar", "antioxidants", "premium"],
    image: "https://images.unsplash.com/photo-1606312619371-75d8b76b4de2?w=150&h=150&fit=crop&auto=format",
    description: "Rich dark chocolate with 70% cocoa content",
    rating: 4.7,
    inStock: true,
  },
]

export default function PredictiveCheckoutPage() {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    cart: initialCart,
    budget: BudgetAnalyzer.calculateBudget(initialCart),
    preferences: PreferenceTracker.loadPreferences(),
    mood: PreferenceTracker.loadMood(),
    recommendations: [],
    personalizedMessage: "",
    notifications: [],
  })

  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>({})
  const [searchResults, setSearchResults] = useState(SearchEngine.search())
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<"products" | "cart" | "recommendations">("products")
  const [shoppingStartTime] = useState(Date.now())
  const [userBudget, setUserBudget] = useState(BudgetAnalyzer.getBudgetLimit())

  // Update checkout state when dependencies change
  useEffect(() => {
    const budget = BudgetAnalyzer.calculateBudget(checkoutState.cart, userBudget)
    const recommendations = RecommendationEngine.generateRecommendations(
      checkoutState.cart,
      checkoutState.preferences,
      checkoutState.mood,
      budget,
    )
    const personalizedMessage = RecommendationEngine.generatePersonalizedMessage(
      checkoutState.cart,
      checkoutState.preferences,
      checkoutState.mood,
      budget,
      recommendations,
    )

    setCheckoutState((prev) => ({
      ...prev,
      budget,
      recommendations,
      personalizedMessage,
    }))
  }, [checkoutState.cart, checkoutState.preferences, checkoutState.mood, userBudget])

  // Update search results when filters change
  useEffect(() => {
    const results = SearchEngine.search(searchFilters, 1, 20)
    setSearchResults(results)
  }, [searchFilters])

  const addNotification = (type: Notification["type"], message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
    }

    setCheckoutState((prev) => ({
      ...prev,
      notifications: [...prev.notifications, notification],
    }))

    setTimeout(() => {
      dismissNotification(notification.id)
    }, 4000)
  }

  const dismissNotification = (id: string) => {
    setCheckoutState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }))
  }

  const handleSearch = (query: string) => {
    setSearchFilters((prev) => ({ ...prev, query }))
    setActiveTab("products")
  }

  const handleFiltersChange = (filters: SearchFiltersType) => {
    setSearchFilters(filters)
  }

  const handleUpdateCart = (cart: CartItem[]) => {
    const oldTotal = checkoutState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    setCheckoutState((prev) => ({ ...prev, cart }))

    if (newTotal > oldTotal) {
      addNotification("success", "Item added to cart!")
    } else if (newTotal < oldTotal && cart.length < checkoutState.cart.length) {
      addNotification("info", "Item removed from cart")
    }

    const newBudget = BudgetAnalyzer.calculateBudget(cart)
    if (newBudget.percentage > 90 && checkoutState.budget.percentage <= 90) {
      addNotification("warning", "Approaching budget limit!")
    } else if (newBudget.percentage > 100 && checkoutState.budget.percentage <= 100) {
      addNotification("error", "Budget exceeded!")
    }
  }

  const handleUpdatePreferences = (preferences: UserPreference) => {
    setCheckoutState((prev) => ({ ...prev, preferences }))
    addNotification("success", "Preferences updated!")
  }

  const handleUpdateMood = (mood: UserMood) => {
    setCheckoutState((prev) => ({ ...prev, mood }))
    addNotification("info", "Mood updated!")
  }

  const handleAddRecommendationToCart = (recommendation: Recommendation) => {
    const existingItem = checkoutState.cart.find((item) => item.name === recommendation.name)

    if (existingItem) {
      const updatedCart = checkoutState.cart.map((item) =>
        item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
      )
      handleUpdateCart(updatedCart)
    } else {
      const newItem: CartItem = {
        id: `rec_${recommendation.id}_${Date.now()}`,
        name: recommendation.name,
        price: recommendation.price,
        quantity: 1,
        category: recommendation.category,
        tags: ["recommended", "ai-suggested"],
        image: recommendation.image,
        description: recommendation.description,
        rating: recommendation.rating,
        inStock: true,
      }

      const updatedCart = [...checkoutState.cart, newItem]
      handleUpdateCart(updatedCart)
    }
  }

  const handleAddProductToCart = (product: Product) => {
    const existingItem = checkoutState.cart.find((item) => item.name === product.name)

    if (existingItem) {
      const updatedCart = checkoutState.cart.map((item) =>
        item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
      )
      handleUpdateCart(updatedCart)
    } else {
      const newItem: CartItem = {
        id: `prod_${product.id}_${Date.now()}`,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
        tags: product.tags,
        image: product.image,
        description: product.description,
        rating: product.rating,
        inStock: product.inStock,
      }

      const updatedCart = [...checkoutState.cart, newItem]
      handleUpdateCart(updatedCart)
    }
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getNotificationStyle = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  const totalItems = checkoutState.cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleBudgetSet = (newBudget: number) => {
    setUserBudget(newBudget)
    addNotification("success", `Budget updated to ₹${newBudget}!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Compact Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs">
        {checkoutState.notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center space-x-2 p-3 rounded-lg border shadow-xl backdrop-blur-sm animate-in slide-in-from-right duration-300 ${getNotificationStyle(notification.type)}`}
          >
            {getNotificationIcon(notification.type)}
            <p className="text-xs font-medium flex-1">{notification.message}</p>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="p-0.5 hover:bg-gray-200 hover:bg-opacity-50 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-4">
              AI-Powered Shopping Assistant
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🛒 Predictive Checkout Concierge
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered shopping with smart recommendations and budget tracking
            </p>
          </div>

          {/* Compact Stats & Search Row */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-2">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                <p className="text-sm text-gray-600">Cart Items</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-2">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{checkoutState.budget.percentage.toFixed(0)}%</p>
                <p className="text-sm text-gray-600">Budget Used</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{checkoutState.recommendations.length}</p>
                <p className="text-sm text-gray-600">AI Suggestions</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{checkoutState.budget.savings.toFixed(0)}</p>
                <p className="text-sm text-gray-600">Saved</p>
              </div>
            </div>

            {/* Budget Setter and Search Bar Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-shrink-0">
                <BudgetSetter onBudgetSet={handleBudgetSet} currentBudget={userBudget} />
              </div>
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} onFilterToggle={() => setShowFilters(!showFilters)} />
              </div>
            </div>
          </div>

          {/* Main Layout - 2 Column for better space usage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 backdrop-blur-sm rounded-xl p-1 border border-gray-200">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === "products"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Products ({searchResults.totalCount})
                </button>
                <button
                  onClick={() => setActiveTab("cart")}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all relative ${
                    activeTab === "cart"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Cart ({totalItems})
                  {totalItems > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>}
                </button>
                <button
                  onClick={() => setActiveTab("recommendations")}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all relative ${
                    activeTab === "recommendations"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  AI Picks ({checkoutState.recommendations.length})
                  {checkoutState.recommendations.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 min-h-[600px]">
                {activeTab === "products" && (
                  <div className="p-6">
                    <ProductGrid products={searchResults.products} onAddToCart={handleAddProductToCart} />
                  </div>
                )}

                {activeTab === "cart" && (
                  <div className="p-6">
                    <CartTracker cart={checkoutState.cart} onUpdateCart={handleUpdateCart} />
                  </div>
                )}

                {activeTab === "recommendations" && (
                  <div className="p-6">
                    <RecommendationComponent
                      recommendations={checkoutState.recommendations}
                      onAddToCart={handleAddRecommendationToCart}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Compact Sidebar */}
            <div className="space-y-6">
              {/* Compact Budget Monitor */}
              <BudgetMonitor budget={checkoutState.budget} />

              {/* Compact Checkout Summary */}
              <CheckoutSummary
                personalizedMessage={checkoutState.personalizedMessage}
                cart={checkoutState.cart}
                preferences={checkoutState.preferences}
                mood={checkoutState.mood}
                onUpdatePreferences={handleUpdatePreferences}
                onUpdateMood={handleUpdateMood}
              />
            </div>
          </div>

          {/* Filters Overlay */}
          {showFilters && (
            <SearchFiltersComponent
              filters={searchFilters}
              onFiltersChange={handleFiltersChange}
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              facets={searchResults.facets}
            />
          )}
        </div>
      </div>
    </div>
  )
}
