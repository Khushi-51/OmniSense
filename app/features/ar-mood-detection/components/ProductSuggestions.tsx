"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { EmotionData } from "../types/emotion.types"
import { getProductSuggestions } from "../libs/emotion-mapping"
import { ShoppingBag, Star, ExternalLink, Sparkles } from "lucide-react"

interface ProductSuggestionsProps {
  emotion: EmotionData | null
}

export default function ProductSuggestions({ emotion }: ProductSuggestionsProps) {
  if (!emotion) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <ShoppingBag className="w-5 h-5" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <p className="text-lg font-medium">Analyzing Your Mood</p>
            <p className="text-sm mt-2">Personalized product suggestions will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const suggestions = getProductSuggestions(emotion.dominant)

  return (
    <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-white to-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Sparkles className="w-5 h-5 text-green-600" />
          Perfect for Your Mood
        </CardTitle>
        <p className="text-slate-600">{suggestions.message}</p>
        <Badge className="w-fit bg-green-100 text-green-800">
          AI-Curated • {Math.round(emotion.confidence * 100)}% Match
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.products.map((product, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-3xl shadow-sm">
                {product.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 mb-2 text-lg">{product.name}</h4>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{product.description}</p>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                  </div>
                  <Badge className="text-xs bg-green-100 text-green-800">
                    {Math.round(emotion.confidence * 100)}% Match
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">${product.price}</span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Product
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-slate-200">
          <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg text-lg py-6">
            <ShoppingBag className="w-5 h-5 mr-3" />
            Explore All Mood-Based Recommendations
          </Button>
        </div>

        {/* Mood-based shopping stats */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">{suggestions.products.length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Products</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">{Math.round(emotion.confidence * 100)}%</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Match Rate</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">
              ${suggestions.products.reduce((sum, p) => sum + p.price, 0).toFixed(0)}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Total Value</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
