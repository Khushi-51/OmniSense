"use client"

import type React from "react"

import { useState } from "react"
import { Search, Mic, MicOff } from "lucide-react"

interface TermInputProps {
  onSearch: (term: string) => void
  isLoading: boolean
  onVoiceInput: (isListening: boolean) => void
  isListening: boolean
  voiceSupported: boolean
}

export default function TermInput({ onSearch, isLoading, onVoiceInput, isListening, voiceSupported }: TermInputProps) {
  const [term, setTerm] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term.trim()) {
      onSearch(term.trim())
    }
  }

  const handleVoiceToggle = () => {
    onVoiceInput(!isListening)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Enter a product term (e.g., 'cold-pressed oil', 'keto', 'probiotics')"
            className="w-full px-4 py-3 pr-20 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            disabled={isLoading}
            aria-label="Product term input"
          />

          {voiceSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`absolute right-12 p-2 rounded-full transition-all duration-200 ${
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
              disabled={isLoading}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !term.trim()}
            className="absolute right-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Search for term explanation"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {isListening && (
        <div className="mt-2 text-center">
          <p className="text-sm text-red-600 animate-pulse">🎤 Listening... Speak your product term now</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Try terms like: <span className="font-medium">organic</span>, <span className="font-medium">gluten-free</span>
          , <span className="font-medium">omega-3</span>
        </p>
        <p className="text-xs text-pink-600 mt-1">
          Feeling overwhelmed while shopping? Click the comfort shopping button above!
        </p>
      </div>
    </div>
  )
}
