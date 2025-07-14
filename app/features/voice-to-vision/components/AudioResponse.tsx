"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Volume2 } from "lucide-react"
import { useTextToSpeech, useSpeechRecognition } from "../lib/speech-processing"

interface AudioResponseProps {
  response: string
  audioEnabled: boolean
}

export function AudioResponse({ response, audioEnabled }: AudioResponseProps) {
  const { speak, isSpeaking } = useTextToSpeech()
  const lastSpokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (response && audioEnabled && response !== lastSpokenRef.current && !isSpeaking) {
      speak(response)
      lastSpokenRef.current = response
    }
  }, [response, audioEnabled, speak, isSpeaking])

  if (!response) return null

  return (
    <Card className="border-green-700 bg-green-900/30 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-green-600 p-2 rounded-full">
            <Volume2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600">Assistant Response</Badge>
              {isSpeaking && (
                <Badge variant="outline" className="animate-pulse border-green-600 text-green-300 bg-green-900/50">
                  Speaking...
                </Badge>
              )}
            </div>
            <p className="text-green-200">{response}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
