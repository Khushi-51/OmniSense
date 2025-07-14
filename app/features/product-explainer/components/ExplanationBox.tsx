"use client"

import { useState } from "react"
import type { ExplanationResponse } from "../types/ter.types"
import { Brain, Volume2, RotateCcw, Copy, Share2 } from "lucide-react"

interface ExplanationBoxProps {
  explanation: ExplanationResponse | null
  isLoading: boolean
  onReset: () => void
  onReadAloud: (text: string) => void
  isSpeaking: boolean
}

export default function ExplanationBox({
  explanation,
  isLoading,
  onReset,
  onReadAloud,
  isSpeaking,
}: ExplanationBoxProps) {
  const [isSimpleMode, setIsSimpleMode] = useState(false)
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700 animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            <div className="h-4 bg-gray-600 rounded w-4/6"></div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-10 bg-gray-600 rounded w-32"></div>
            <div className="h-10 bg-gray-600 rounded w-32"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!explanation) {
    return null
  }

  const currentExplanation = isSimpleMode ? explanation.simpleExplanation : explanation.explanation

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${explanation.term}: ${currentExplanation}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `Product Term: ${explanation.term}`,
      text: `${explanation.term}: ${currentExplanation}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white capitalize">{explanation.term}</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              explanation.source === "local" ? "bg-green-900/50 text-green-300 border border-green-700" : "bg-blue-900/50 text-blue-300 border border-blue-700"
            }`}
          >
            {explanation.source === "local" ? "📚 Local" : "🤖 AI"}
          </span>
        </div>

        <div className="mb-6">
          <p className="text-gray-200 leading-relaxed text-lg">{currentExplanation}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsSimpleMode(!isSimpleMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSimpleMode ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 border border-purple-700"
            }`}
            aria-label={isSimpleMode ? "Show detailed explanation" : "Show simple explanation"}
          >
            <Brain size={18} />
            {isSimpleMode ? "Show Detailed" : "Explain Like I'm 5"}
          </button>

          <button
            onClick={() => onReadAloud(currentExplanation)}
            disabled={isSpeaking}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSpeaking ? "bg-green-600 text-white animate-pulse" : "bg-green-900/50 text-green-300 hover:bg-green-800/50 border border-green-700"
            }`}
            aria-label="Read explanation aloud"
          >
            <Volume2 size={18} />
            {isSpeaking ? "Reading..." : "Read Aloud"}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 font-medium transition-all duration-200 border border-gray-600"
            aria-label="Copy explanation to clipboard"
          >
            <Copy size={18} />
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-900/50 text-cyan-300 rounded-lg hover:bg-cyan-800/50 font-medium transition-all duration-200 border border-cyan-700"
            aria-label="Share explanation"
          >
            <Share2 size={18} />
            Share
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-orange-900/50 text-orange-300 rounded-lg hover:bg-orange-800/50 font-medium transition-all duration-200 border border-orange-700"
            aria-label="Try another term"
          >
            <RotateCcw size={18} />
            Try Another Term
          </button>
        </div>
      </div>
    </div>
  )
}
