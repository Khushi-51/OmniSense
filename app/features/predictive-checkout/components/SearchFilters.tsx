"use client"

import { useState } from "react"
import { SEARCH_FILTERS } from "../data/products"
import { X, ChevronDown, ChevronUp, Filter, Star } from "lucide-react"

interface SearchFiltersProps {
  filters: any
  onFiltersChange: (filters: any) => void
  isOpen: boolean
  onClose: () => void
  facets?: {
    categories: { [key: string]: number }
    brands: { [key: string]: number }
    dietary: { [key: string]: number }
    priceRanges: { [key: string]: number }
  }
}

export default function SearchFilters({ filters, onFiltersChange, isOpen, onClose, facets }: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["categories", "price", "rating"]))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = (filters[key] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilters(key, newArray.length > 0 ? newArray : undefined)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories?.length) count += filters.categories.length
    if (filters.brands?.length) count += filters.brands.length
    if (filters.dietary?.length) count += filters.dietary.length
    if (filters.priceRange) count += 1
    if (filters.rating) count += 1
    if (filters.inStock !== undefined) count += 1
    if (filters.isOrganic !== undefined) count += 1
    return count
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Filter Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 overflow-y-auto lg:relative lg:w-full lg:h-auto lg:border-l-0 lg:border lg:border-gray-200 lg:rounded-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">{getActiveFiltersCount()}</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
              >
                Clear All
              </button>
            )}
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 transition-colors lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <button
              onClick={() => toggleSection("categories")}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              <span>Categories</span>
              {expandedSections.has("categories") ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {expandedSections.has("categories") && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {SEARCH_FILTERS.categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories?.includes(category) || false}
                      onChange={() => toggleArrayFilter("categories", category)}
                      className="rounded border-gray-300 bg-gray-100 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 flex-1">{category}</span>
                    {facets?.categories[category] && (
                      <span className="text-xs text-gray-500">({facets.categories[category]})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button
              onClick={() => toggleSection("price")}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              <span>Price Range</span>
              {expandedSections.has("price") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.has("price") && (
              <div className="space-y-2">
                {SEARCH_FILTERS.priceRanges.map((range) => (
                  <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange?.min === range.min && filters.priceRange?.max === range.max}
                      onChange={() => updateFilters("priceRange", { min: range.min, max: range.max })}
                      className="border-gray-300 bg-gray-100 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
                {filters.priceRange && (
                  <button
                    onClick={() => updateFilters("priceRange", undefined)}
                    className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Clear price filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <button
              onClick={() => toggleSection("rating")}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              <span>Minimum Rating</span>
              {expandedSections.has("rating") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.has("rating") && (
              <div className="space-y-2">
                {SEARCH_FILTERS.ratings.map((rating) => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => updateFilters("rating", rating)}
                      className="border-gray-300 bg-gray-100 text-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-400"}`}
                        />
                      ))}
                      <span className="text-sm text-gray-700 ml-1">& up</span>
                    </div>
                  </label>
                ))}
                {filters.rating && (
                  <button
                    onClick={() => updateFilters("rating", undefined)}
                    className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Clear rating filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Brands */}
          <div>
            <button
              onClick={() => toggleSection("brands")}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              <span>Brands</span>
              {expandedSections.has("brands") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSections.has("brands") && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {SEARCH_FILTERS.brands.map((brand) => (
                  <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.brands?.includes(brand) || false}
                      onChange={() => toggleArrayFilter("brands", brand)}
                      className="rounded border-gray-300 bg-gray-100 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 flex-1">{brand}</span>
                    {facets?.brands[brand] && <span className="text-xs text-gray-500">({facets.brands[brand]})</span>}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Dietary */}
          <div>
            <button
              onClick={() => toggleSection("dietary")}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              <span>Dietary Preferences</span>
              {expandedSections.has("dietary") ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {expandedSections.has("dietary") && (
              <div className="space-y-2">
                {SEARCH_FILTERS.dietary.map((diet) => (
                  <label key={diet} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.dietary?.includes(diet) || false}
                      onChange={() => toggleArrayFilter("dietary", diet)}
                      className="rounded border-gray-300 bg-gray-100 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 capitalize flex-1">{diet.replace("-", " ")}</span>
                    {facets?.dietary[diet] && <span className="text-xs text-gray-500">({facets.dietary[diet]})</span>}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Additional Filters */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Additional Filters</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock === true}
                  onChange={(e) => updateFilters("inStock", e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 bg-gray-100 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isOrganic === true}
                  onChange={(e) => updateFilters("isOrganic", e.target.checked ? true : undefined)}
                  className="rounded border-gray-300 bg-gray-100 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Organic Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
