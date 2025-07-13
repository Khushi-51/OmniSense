"use client"

import { useState } from "react"
import type { CartItem } from "../types/checkout.types"
import { Minus, Plus, Trash2, Heart, Star, ShoppingBag } from "lucide-react"

interface CartTrackerProps {
  cart: CartItem[]
  onUpdateCart: (cart: CartItem[]) => void
}

export default function CartTracker({ cart, onUpdateCart }: CartTrackerProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    const updatedCart = cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    onUpdateCart(updatedCart)
  }

  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    onUpdateCart(updatedCart)
  }

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalSavings = cart.reduce((sum, item) => {
    const originalPrice = item.price * 1.15 // Assume 15% savings
    return sum + (originalPrice - item.price) * item.quantity
  }, 0)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-900 rounded-xl">
            <ShoppingBag className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
            <p className="text-sm text-gray-600">
              {totalItems} items • ₹{totalSavings.toFixed(2)} saved
            </p>
          </div>
        </div>
        {totalItems > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</p>
            <p className="text-sm text-green-400">You saved ₹{totalSavings.toFixed(2)}</p>
          </div>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-xl mb-2">Your cart is empty</p>
          <p className="text-gray-500 text-sm">Add some items to get personalized recommendations!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="group flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-purple-500 bg-gray-50"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop&auto=format" ||
                    "/placeholder.svg"
                  }
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-red-400 text-xs font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                    {item.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>}

                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {item.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{item.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors ml-4 flex-shrink-0"
                  >
                    <Heart
                      className={`w-4 h-4 ${favorites.has(item.id) ? "text-red-500 fill-current" : "text-gray-500"}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 rounded-md hover:bg-gray-200 hover:shadow-sm transition-all"
                        disabled={!item.inStock}
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 rounded-md hover:bg-gray-200 hover:shadow-sm transition-all"
                        disabled={!item.inStock}
                      >
                        <Plus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-xl text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-400">₹{item.price} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax (18%):</span>
                <span className="font-semibold text-gray-900">₹{(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total:</span>
                <span>₹{(totalPrice * 1.18).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
