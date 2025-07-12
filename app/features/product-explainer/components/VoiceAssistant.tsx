"use client"

import { useEffect, useState } from "react"
import type { VoiceSettings } from "../types/ter.types"
import type { SpeechRecognition } from "web-speech-api"

interface VoiceAssistantProps {
  onVoiceInput: (text: string) => void
  isListening: boolean
  setIsListening: (listening: boolean) => void
  voiceSettings: VoiceSettings
  setVoiceSettings: (settings: VoiceSettings) => void
}

export default function VoiceAssistant({
  onVoiceInput,
  isListening,
  setIsListening,
  voiceSettings,
  setVoiceSettings,
}: VoiceAssistantProps) {
  /* ------------------------------------------------------------------ */
  /*  Local state for SpeechRecognition & SpeechSynthesis references    */
  /* ------------------------------------------------------------------ */
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null)

  /* ------------------------------------------------------------------ */
  /*  Initialise voice APIs once on client-side mount                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return

    /* -----------  Detect browser SpeechRecognition implementation ---- */
    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    const speechSynth = window.speechSynthesis

    /* --------------------------  Recognition ------------------------- */
    if (SpeechRecognitionConstructor) {
      const recog: SpeechRecognition = new SpeechRecognitionConstructor()
      recog.continuous = false
      recog.interimResults = false
      recog.lang = "en-US"

      recog.onstart = () => {
        setIsListening(true)
      }

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onVoiceInput(transcript)
        setIsListening(false)
      }

      recog.onerror = () => setIsListening(false)
      recog.onend = () => setIsListening(false)

      setRecognition(recog)
    }

    /* ---------------------------  Synthesis -------------------------- */
    if (speechSynth) {
      setSynthesis(speechSynth)
    }

    /* ------------  Expose capability flags to parent state ----------- */
    setVoiceSettings({
      isListening: false,
      isSpeaking: false,
      isSupported: Boolean(SpeechRecognitionConstructor) && Boolean(speechSynth),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once

  /* ------------------------------------------------------------------ */
  /*  Public helper methods attached to window for parent to call       */
  /* ------------------------------------------------------------------ */
  const startListening = () => recognition?.start()
  const stopListening = () => recognition?.stop()

  const speak = (text: string) => {
    if (!synthesis) return

    /* cancel any current speech first */
    synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onstart = () => setVoiceSettings((prev) => ({ ...prev, isSpeaking: true }))
    utterance.onend = () => setVoiceSettings((prev) => ({ ...prev, isSpeaking: false }))
    utterance.onerror = () => setVoiceSettings((prev) => ({ ...prev, isSpeaking: false }))

    synthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    synthesis?.cancel()
    setVoiceSettings((prev) => ({ ...prev, isSpeaking: false }))
  }

  /* Expose helpers globally so the parent page can call them */
  useEffect(() => {
    ;(window as any).voiceAssistant = {
      startListening,
      stopListening,
      speak,
      stopSpeaking,
    }
  })

  /* This component renders nothing visible */
  return null
}
