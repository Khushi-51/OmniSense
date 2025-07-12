"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import CameraCapture from "./components/CameraCapture"
import EmotionDetector from "./components/EmotionDetector"
import MoodDisplay from "./components/MoodDisplay"
import ProductSuggestions from "./components/ProductSuggestions"
import ModelLoader from "./components/ModelLoader"
import type { EmotionData } from "./types/emotion.types"
import { Shield, Camera, AlertTriangle, Zap, Info } from "lucide-react"

export default function ARMoodDetectionPage() {
  const [isActive, setIsActive] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)

  const handleConsentGiven = () => {
    setHasConsent(true)
  }

  const handleStartDetection = () => {
    if (!modelsLoaded) {
      setError("AI models are still loading. Please wait...")
      return
    }
    setIsActive(true)
    setError(null)
  }

  const handleStopDetection = () => {
    setIsActive(false)
    setCurrentEmotion(null)
    setFaceDetected(false)
  }

  const handleEmotionDetected = (emotion: EmotionData) => {
    setCurrentEmotion(emotion)
    setFaceDetected(true)
  }

  const handleNoFaceDetected = () => {
    setFaceDetected(false)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setIsActive(false)
  }

  const handleModelsLoaded = () => {
    setModelsLoaded(true)
  }

  const handleModelError = (errorMessage: string) => {
    // Don't show model errors as critical errors in demo mode
    console.log("Model loading info:", errorMessage)
  }

  if (!hasConsent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="border-2 border-blue-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-slate-800 mb-2">Professional Mood Detection</CardTitle>
              <p className="text-slate-600 text-lg">
                AI-powered emotion analysis for personalized shopping experiences
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Enterprise-Grade Privacy:</strong> All facial analysis happens locally using advanced AI
                  models. Zero data transmission or storage.
                </AlertDescription>
              </Alert>

              <Alert className="border-yellow-200 bg-yellow-50">
                <Info className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Demo Mode:</strong> This version uses simulated AI for demonstration. Real face detection
                  requires additional model files.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-semibold text-xl text-slate-800">Advanced Features:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <Zap className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium text-slate-800">Real-time Face Detection</p>
                      <p className="text-sm text-slate-600">68-point facial landmark detection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <Zap className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium text-slate-800">7 Emotion Categories</p>
                      <p className="text-sm text-slate-600">
                        Happy, sad, angry, surprised, fearful, disgusted, neutral
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <Zap className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <p className="font-medium text-slate-800">Smart Recommendations</p>
                      <p className="text-sm text-slate-600">AI-curated products based on mood</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                    <Zap className="w-5 h-5 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium text-slate-800">Local Processing</p>
                      <p className="text-sm text-slate-600">No cloud dependency required</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleConsentGiven}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Demo Experience
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-3">
            Professional Mood Detection System
          </h1>
          <p className="text-slate-600 text-lg">Real-time emotion analysis with AI-powered product recommendations</p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Privacy Protected
            </Badge>
            <Badge
              variant="secondary"
              className={`${modelsLoaded ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
            >
              <Zap className="w-3 h-3 mr-1" />
              {modelsLoaded ? "AI Models Ready" : "Loading AI Models"}
            </Badge>
            <Badge
              variant="secondary"
              className={`${faceDetected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
            >
              <Camera className="w-3 h-3 mr-1" />
              {faceDetected ? "Face Detected" : "No Face"}
            </Badge>
          </div>
        </div>

        {/* Model Loader */}
        <ModelLoader onModelsLoaded={handleModelsLoaded} onError={handleModelError} />

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="space-y-2">
                <p className="font-medium">{error}</p>
                {error.includes("permission") && (
                  <div className="text-sm">
                    <p className="font-medium">Camera Permission Required:</p>
                    <ol className="list-decimal list-inside space-y-1 mt-1">
                      <li>Click the camera icon in your browser's address bar</li>
                      <li>Select "Allow" for camera access</li>
                      <li>Refresh this page and try again</li>
                    </ol>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Camera className="w-5 h-5" />
                  Live Camera Feed
                  {faceDetected && <Badge className="bg-green-500">Face Detected</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CameraCapture isActive={isActive} onError={handleError} modelsLoaded={modelsLoaded} />

                <div className="flex gap-3 mt-6">
                  {!isActive ? (
                    <Button
                      onClick={handleStartDetection}
                      disabled={!modelsLoaded}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                    >
                      {modelsLoaded ? "Start Analysis" : "Loading AI Models..."}
                    </Button>
                  ) : (
                    <Button onClick={handleStopDetection} variant="destructive" className="shadow-lg">
                      Stop Analysis
                    </Button>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div
                      className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                    />
                    {isActive ? "Analysis Active" : "Analysis Stopped"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {isActive && (
              <EmotionDetector
                isActive={isActive}
                onEmotionDetected={handleEmotionDetected}
                onNoFaceDetected={handleNoFaceDetected}
                onError={handleError}
              />
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <MoodDisplay emotion={currentEmotion} />
            <ProductSuggestions emotion={currentEmotion} />
          </div>
        </div>
      </div>
    </div>
  )
}
