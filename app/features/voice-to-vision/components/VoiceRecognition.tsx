"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useSpeechRecognition } from "../lib/speech-processing"

interface VoiceRecognitionProps {
  onCommand: (command: string) => void
  isProcessing: boolean
  response?: string
}

export function VoiceRecognition({ onCommand, isProcessing, response }: VoiceRecognitionProps) {
  const [audioEnabled, setAudioEnabled] = useState(true)
  const { isListening, isSupported, transcript, commands, startListening, stopListening } = useSpeechRecognition()

  // Handle new voice commands
  useEffect(() => {
    if (commands.length > 0) {
      const latestCommand = commands[commands.length - 1]
      if (latestCommand.text.trim().length >= 2 && latestCommand.confidence > 0.7) {
        onCommand(latestCommand.text.trim())
        // Stop listening after successful command
        if (isListening) {
          stopListening()
        }
      }
    }
  }, [commands, onCommand, isListening, stopListening])

  const handleToggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
        <MicOff className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="font-semibold text-red-800 mb-2">Voice Recognition Unavailable</h3>
        <p className="text-red-700 text-sm">
          Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={isListening ? "destructive" : "secondary"}>{isListening ? "Listening..." : "Ready"}</Badge>
          {isProcessing && <Badge variant="outline">Processing...</Badge>}
        </div>
        <Button variant="outline" size="sm" onClick={() => setAudioEnabled(!audioEnabled)}>
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Voice Button */}
      <Button
        onClick={handleToggleListening}
        disabled={isProcessing}
        className={`w-full h-16 text-lg ${
          isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isListening ? <MicOff className="w-6 h-6 mr-2" /> : <Mic className="w-6 h-6 mr-2" />}
        {isProcessing ? "Processing..." : isListening ? "Tap to stop" : "Tap to speak"}
      </Button>

      {/* Transcript */}
      {transcript && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700 font-medium">Listening:</p>
          <p className="text-blue-800">{transcript}</p>
        </div>
      )}

      {/* Recent Commands */}
      {commands.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-sm text-gray-700 font-medium mb-2">Recent Commands:</p>
          <div className="space-y-1">
            {commands.slice(-3).map((command, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-800 truncate">{command.text}</span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(command.confidence * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Commands */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={() => onCommand("organic brown bread")} className="text-xs">
          Organic Brown Bread
        </Button>
        <Button variant="outline" size="sm" onClick={() => onCommand("dairy-free almond milk")} className="text-xs">
          Dairy-Free Almond Milk
        </Button>
        <Button variant="outline" size="sm" onClick={() => onCommand("organic apples")} className="text-xs">
          Organic Apples
        </Button>
        <Button variant="outline" size="sm" onClick={() => onCommand("protein rich paneer")} className="text-xs">
          Protein Rich Paneer
        </Button>
      </div>
    </div>
  )
}
