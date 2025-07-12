"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Star, Heart, ShoppingCart, ExternalLink, Sparkles } from "lucide-react"
import { getAdvancedProductSuggestions } from "../libs/emotion-mapping"

interface MoodBasedProductsProps {
  mood: string
  confidence: number
}

export default function MoodBasedProducts({ mood, confidence }: MoodBasedProductsProps) {
  const productData = getAdvancedProductSuggestions(mood, confidence)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          Perfect Products for Your Mood
        </h2>
        <p className="text-xl text-slate-600">{productData.message}</p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge className="bg-green-100 text-green-800 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            {Math.round(confidence * 100)}% Mood Match
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2">{productData.products.length} Curated Items</Badge>
        </div>
      </div>

      {/* Product Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productData.categories.map((category, index) => (
          <Card
            key={index}
            className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                <div className="text-3xl">{category.icon}</div>
                <div>
                  <h3>{category.name}</h3>
                  <p className="text-sm text-slate-600 font-normal">{category.description}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.products.map((product, productIndex) => (
                <div
                  key={productIndex}
                  className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                      {product.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 mb-1 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{product.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {product.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium text-slate-700">{product.rating}</span>
                        </div>
                        <Badge className="text-xs bg-green-100 text-green-800">{product.moodMatch}% Match</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-600">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-slate-400 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="p-2 bg-transparent">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-4 group bg-transparent">
                <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                View All {category.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Products */}
      <Card className="shadow-2xl border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
            <ShoppingBag className="w-6 h-6 text-green-600" />
            Top Recommendations for {mood.charAt(0).toUpperCase() + mood.slice(1)} Mood
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {productData.featured.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-3xl shadow-md">
                    {product.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-lg text-slate-800">{product.name}</h4>
                      <Badge className="bg-green-500 text-white">Featured</Badge>
                    </div>
                    <p className="text-slate-600 mb-4">{product.description}</p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-slate-700">{product.rating}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{product.moodMatch}% Perfect Match</Badge>
                      <span className="text-sm text-slate-500">{product.reviews} reviews</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-slate-400 line-through">${product.originalPrice}</span>
                        )}
                        {product.discount && <Badge className="bg-red-100 text-red-800">{product.discount}% OFF</Badge>}
                      </div>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-12 py-4 text-lg"
            >
              <ShoppingBag className="w-6 h-6 mr-3" />
              Shop All Mood-Matched Products
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mood Shopping Stats */}
      <Card className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">{productData.products.length}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide">Curated Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{Math.round(confidence * 100)}%</div>
              <div className="text-sm text-slate-500 uppercase tracking-wide">Mood Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">
                ${productData.products.reduce((sum, p) => sum + p.price, 0).toFixed(0)}
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wide">Total Value</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {Math.round(
                  productData.products.reduce((sum, p) => sum + p.moodMatch, 0) / productData.products.length,
                )}
                %
              </div>
              <div className="text-sm text-slate-500 uppercase tracking-wide">Avg Match</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
