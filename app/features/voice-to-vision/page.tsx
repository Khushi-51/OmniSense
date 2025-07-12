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

        {/* Feature Information Cards */}
        <div className="grid gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Feature Overview</CardTitle>
              <CardDescription>Voice-activated shopping assistant with AI product recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Core Functionality:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Voice command recognition and processing</li>
                  <li>Natural language product search</li>
                  <li>Audio response with product information</li>
                  <li>Smart product recommendations</li>
                  <li>Haptic feedback for product identification</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Example Interaction:</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p>
                    <strong>User:</strong> 🗣 "Show me gluten-free snacks under ₹200"
                  </p>
                  <p>
                    <strong>App:</strong> 💬 "Found 5 gluten-free snacks under ₹200. Try NutriSnax and OatBars — both in
                    aisle A3"
                  </p>
                  <p>
                    <strong>Feedback:</strong> Phone vibrates when product is selected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Multiple voice command languages</li>
                <li>Adjustable speech rate and volume</li>
                <li>Alternative input methods (keyboard, touch)</li>
                <li>High contrast visual indicators</li>
                <li>Screen reader compatibility</li>
                <li>Haptic feedback for navigation</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
