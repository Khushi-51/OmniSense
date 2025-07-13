import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VoiceToVisionAssistant } from "./components/VoiceToVisionAssistant"

export default function VoiceToVisionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            AI-Powered Shopping Assistant
          </Badge>
          <h1 className="text-3xl font-bold mb-4">🗣️ Voice-to-Vision Shopping Assistant</h1>
          <p className="text-lg text-gray-600">Voice commands with AI guidance for accessible shopping experience</p>
        </div>

        {/* Main Voice Assistant Interface */}
        <VoiceToVisionAssistant />
      </div>
    </div>
  )
}
