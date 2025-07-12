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
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-green-500 p-2 rounded-full">
            <Volume2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Assistant Response</Badge>
              {isSpeaking && (
                <Badge variant="outline" className="animate-pulse">
                  Speaking...
                </Badge>
              )}
            </div>
            <p className="text-green-800">{response}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
