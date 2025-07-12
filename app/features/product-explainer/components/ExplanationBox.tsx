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
        <div className="bg-white rounded-lg shadow-lg p-6 border animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
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
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">{explanation.term}</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              explanation.source === "local" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            {explanation.source === "local" ? "📚 Local" : "🤖 AI"}
          </span>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed text-lg">{currentExplanation}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsSimpleMode(!isSimpleMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isSimpleMode ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200"
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
              isSpeaking ? "bg-green-500 text-white animate-pulse" : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
            aria-label="Read explanation aloud"
          >
            <Volume2 size={18} />
            {isSpeaking ? "Reading..." : "Read Aloud"}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200"
            aria-label="Copy explanation to clipboard"
          >
            <Copy size={18} />
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-all duration-200"
            aria-label="Share explanation"
          >
            <Share2 size={18} />
            Share
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-medium transition-all duration-200"
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
