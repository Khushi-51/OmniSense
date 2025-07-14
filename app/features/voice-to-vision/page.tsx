import { Badge } from "@/components/ui/badge"
import { VoiceToVisionAssistant } from "./components/VoiceToVisionAssistant"

export default function VoiceToVisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-4 bg-gray-800 text-gray-300 border-gray-700">
            AI-Powered Shopping Assistant
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🗣️ Voice-to-Vision Shopping Assistant
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Voice commands with AI guidance for an accessible shopping experience
          </p>
        </div>
        {/* Main Voice Assistant Interface */}
        <VoiceToVisionAssistant />
      </div>
    </div>
  )
}
