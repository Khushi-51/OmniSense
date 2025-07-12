"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Filter, Sparkles } from "lucide-react"
import { SearchEngine } from "../lib/search-engine"

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterToggle: () => void
  placeholder?: string
  className?: string
}

export default function SearchBar({
  onSearch,
  onFilterToggle,
  placeholder = "Search for products, brands, categories...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.length >= 2) {
        const newSuggestions = SearchEngine.searchSuggestions(query)
        setSuggestions(newSuggestions)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSubmit(e)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 z-10">
            <Search className="w-5 h-5 text-purple-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 shadow-lg"
          />

          <div className="absolute right-3 flex items-center space-x-2">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onFilterToggle}
              className="p-2 text-purple-400 hover:text-purple-300 transition-colors rounded-lg hover:bg-gray-800"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Search Suggestions - Perfect Positioning */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>Suggestions</span>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors ${
                  index === selectedIndex ? "bg-gray-800 text-purple-300" : "text-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-4 h-4 text-gray-500" />
                  <span className="capitalize">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
