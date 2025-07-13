"use client"

import { useState, useEffect } from "react"
import TermInput from "./components/TermInput"
import ExplanationBox from "./components/ExplanationBox"
import VoiceAssistant from "./components/VoiceAssistant"
import EmpathyAssistant from "./components/EmpathyAssistant"
import { explainTerm, getRandomTip } from "./lib/explain-term"
import type { ExplanationResponse, VoiceSettings } from "./types/ter.types"
import { Lightbulb, Music, Heart } from 'lucide-react'

export default function ProductExplainerPage() {
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dailyTip, setDailyTip] = useState("")
  const [showEmpathyAssistant, setShowEmpathyAssistant] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    isListening: false,
    isSpeaking: false,
    isSupported: false,
  })

  useEffect(() => {
    setDailyTip(getRandomTip())
  }, [])

  const handleSearch = async (term: string) => {
    setIsLoading(true)
    try {
      const result = await explainTerm(term)
      setExplanation(result)
    } catch (error) {
      console.error("Error explaining term:", error)
      setExplanation({
        term,
        explanation: "Sorry, we encountered an error while explaining this term. Please try again.",
        simpleExplanation: "Oops! Something went wrong. Let's try again!",
        source: "local",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = (isListening: boolean) => {
    if (isListening) {
      ;(window as any).voiceAssistant?.startListening()
    } else {
      ;(window as any).voiceAssistant?.stopListening()
    }
  }

  const handleVoiceInputText = (text: string) => {
    handleSearch(text)
  }

  const handleReadAloud = (text: string) => {
    if (voiceSettings.isSpeaking) {
      ;(window as any).voiceAssistant?.stopSpeaking()
    } else {
      ;(window as any).voiceAssistant?.speak(text)
    }
  }

  const handleReset = () => {
    setExplanation(null)
    setDailyTip(getRandomTip())
  }

  const openMusicPlaylist = () => {
    window.open("https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0", "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4 text-gray-100">
      <VoiceAssistant
        onVoiceInput={handleVoiceInputText}
        isListening={voiceSettings.isListening}
        setIsListening={(listening) => setVoiceSettings({ ...voiceSettings, isListening: listening })}
        voiceSettings={voiceSettings}
        setVoiceSettings={setVoiceSettings}
      />
      {showEmpathyAssistant && <EmpathyAssistant onClose={() => setShowEmpathyAssistant(false)} />}
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">🧠 Smart Product Explainer</h1>
          <p className="text-xl text-gray-300 mb-6">
            Your friendly shopping assistant for understanding confusing product terms
          </p>
          {/* Daily Tip */}
          <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 mb-6 inline-block">
            <div className="flex items-center gap-2 text-yellow-200">
              <Lightbulb size={20} className="text-yellow-400" />
              <span className="font-medium">{dailyTip}</span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="text-center mb-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={openMusicPlaylist}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/50 text-green-200 rounded-lg hover:bg-green-800 transition-all duration-200 border border-green-700"
          >
            <Music size={18} className="text-green-400" />
            Calming Music While You Learn
          </button>
          <button
            onClick={() => setShowEmpathyAssistant(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-900/50 text-pink-200 rounded-lg hover:bg-pink-800 transition-all duration-200 border border-pink-700"
          >
            <Heart size={18} className="text-pink-400" />
            Need Some Comfort Shopping?
          </button>
        </div>
        {/* Search Input */}
        <TermInput
          onSearch={handleSearch}
          isLoading={isLoading}
          onVoiceInput={handleVoiceInput}
          isListening={voiceSettings.isListening}
          voiceSupported={voiceSettings.isSupported}
        />
        {/* Explanation Box */}
        <ExplanationBox
          explanation={explanation}
          isLoading={isLoading}
          onReset={handleReset}
          onReadAloud={handleReadAloud}
          isSpeaking={voiceSettings.isSpeaking}
        />
        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Made with ❤️ for curious shoppers, elderly users, and anyone who wants to understand products better
          </p>
          <p className="text-xs mt-2">Voice features work best in Chrome, Edge, and Safari browsers</p>
          <p className="text-xs mt-1">
            Feeling overwhelmed? Try our empathy assistant for comfort shopping recommendations
          </p>
        </div>
      </div>
    </div>
  )
}
