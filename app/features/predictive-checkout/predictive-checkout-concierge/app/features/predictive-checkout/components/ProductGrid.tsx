"use client"

import { useState } from "react"
import type { Product } from "../data/products"
import { Star, Heart, ShoppingCart, Zap, Leaf, Award } from "lucide-react"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  loading?: boolean
}

export default function ProductGrid({ products, onAddToCart, loading = false }: ProductGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set())

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const handleAddToCart = async (product: Product) => {
    if (!product.inStock) return

    setAddingItems((prev) => new Set(prev).add(product.id))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAddToCart(product)
    setAddingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(product.id)
      return newSet
    })
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-6 animate-pulse border border-gray-800">
              <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                <div className="h-6 bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-600" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">No products found</h3>
          <p className="text-gray-400 text-lg">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden"
            >
              {/* Product Image - Perfect Aspect Ratio */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges - Perfectly Positioned */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      -{product.discount}%
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                      <Award className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}
                  {product.isOrganic && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                      <Leaf className="w-3 h-3" />
                      <span>Organic</span>
                    </span>
                  )}
                </div>

                {/* Favorite Button - Perfect Position */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all backdrop-blur-sm"
                >
                  <Heart
                    className={`w-5 h-5 ${favorites.has(product.id) ? "text-red-500 fill-current" : "text-white"}`}
                  />
                </button>

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info - Perfect Spacing */}
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-semibold text-white text-base line-clamp-2 group-hover:text-purple-300 transition-colors mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">{product.brand}</p>
                </div>

                <p className="text-sm text-gray-300 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>

                {/* Tags - Perfect Alignment */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700 hover:border-purple-500 transition-colors"
                    >
                      {tag.replace("-", " ")}
                    </span>
                  ))}
                  {product.tags.length > 3 && (
                    <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
                      +{product.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Rating - Perfect Alignment */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 font-medium">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Price - Perfect Alignment */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                    <span className="text-xl font-bold text-white">₹{product.price}</span>
                  </div>

                  {product.discount && (
                    <div className="flex items-center space-x-1 text-green-400 text-sm font-medium">
                      <Zap className="w-4 h-4" />
                      <span>Save ₹{product.originalPrice! - product.price}</span>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button - Perfect Width */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock || addingItems.has(product.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-700 disabled:to-gray-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {addingItems.has(product.id) ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : !product.inStock ? (
                    <span>Out of Stock</span>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
