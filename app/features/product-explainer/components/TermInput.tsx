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
            className="w-full px-4 py-3 pr-20 text-lg bg-gray-800 text-gray-100 border-2 border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 transition-all duration-200 placeholder:text-gray-400"
            disabled={isLoading}
            aria-label="Product term input"
          />

          {voiceSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`absolute right-12 p-2 rounded-full transition-all duration-200 ${
                isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
            className="absolute right-2 p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Search for term explanation"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {isListening && (
        <div className="mt-2 text-center">
          <p className="text-sm text-red-400 animate-pulse">🎤 Listening... Speak your product term now</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-300">
          Try terms like: <span className="font-medium text-cyan-400">organic</span>, <span className="font-medium text-cyan-400">gluten-free</span>
          , <span className="font-medium text-cyan-400">omega-3</span>
        </p>
        <p className="text-xs text-pink-400 mt-1">
          Feeling overwhelmed while shopping? Click the comfort shopping button above!
        </p>
      </div>
    </div>
  )
}
