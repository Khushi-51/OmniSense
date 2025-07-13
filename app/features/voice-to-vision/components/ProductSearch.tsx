"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Star, Mic } from "lucide-react"
import type { Product } from "../types/voice.types"
import { productDatabase } from "../lib/product-database"

interface ProductSearchProps {
  onProductsFound: (products: Product[]) => void
  onProductSelect: (product: Product) => void
}

export function ProductSearch({ onProductsFound, onProductSelect }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const results = productDatabase.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.dietary.some((diet) => diet.toLowerCase().includes(searchQuery.toLowerCase())),
      )

      onProductsFound(results.slice(0, 10))
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search products, categories..."
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <Package className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-800">{productDatabase.length}</div>
          <div className="text-xs text-blue-600">Products</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <Search className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-green-800">{isSearching ? "..." : "Ready"}</div>
          <div className="text-xs text-green-600">Search</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <Star className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-lg font-bold text-purple-800">AI</div>
          <div className="text-xs text-purple-600">Powered</div>
        </div>
      </div>

      {/* Quick Search Tags */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Quick Search:</p>
        <div className="flex flex-wrap gap-2">
          {["organic", "gluten-free", "dairy-free", "vegan", "protein"].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSearchQuery(tag)
                handleSearch()
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>


    </div>
  )
}
