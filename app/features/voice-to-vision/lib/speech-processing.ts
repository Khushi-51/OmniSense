"use client"

import { useState, useEffect, useRef } from "react"
import type { VoiceCommand } from "../types/voice.types"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// Speech Recognition Hook
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [commands, setCommands] = useState<VoiceCommand[]>([])
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()

        const recognition = recognitionRef.current
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: any) => {
          let finalTranscript = ""
          let confidence = 0

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              finalTranscript += result[0].transcript
              confidence = result[0].confidence
            }
          }

          if (finalTranscript) {
            const command: VoiceCommand = {
              text: finalTranscript.trim(),
              confidence: confidence,
              timestamp: Date.now(),
            }

            setCommands((prev) => [...prev, command])
            setTranscript("")
            recognition.stop()
            setIsListening(false)
          } else {
            const interimText = event.results[event.results.length - 1][0].transcript
            setTranscript(interimText)
          }
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          setTranscript("")
        }

        recognition.onend = () => {
          setIsListening(false)
          setTranscript("")
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return {
    isListening,
    isSupported,
    transcript,
    commands,
    startListening,
    stopListening,
  }
}

// Text to Speech Hook with improved repetition prevention
export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const lastTextRef = useRef<string>("")
  const speechQueueRef = useRef<string[]>([])

  const speak = (text: string) => {
    if (!isSupported || !text || text === lastTextRef.current) return

    // Clear any existing speech
    stop()

    // Update last spoken text
    lastTextRef.current = text

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 0.8

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
      // Clear the last text after speaking to allow the same text to be spoken again later if needed
      setTimeout(() => {
        lastTextRef.current = ""
      }, 2000)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      currentUtteranceRef.current = null
      lastTextRef.current = ""
    }

    currentUtteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }
  }

  return { speak, stop, isSpeaking, isSupported }
}
