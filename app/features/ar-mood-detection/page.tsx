"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import CameraCapture from "./components/CameraCapture"
import AnalysisSession from "./components/AnalysisSession"
import FinalMoodResult from "./components/FinalMoodResult"
import MoodBasedProducts from "./components/MoodBasedProducts"
import ModelLoader from "./components/ModelLoader"
import type { EmotionData, AnalysisResult } from "./types/emotion.types"
import { Shield, Camera, AlertTriangle, Sparkles, Timer } from "lucide-react"

type AppState = "consent" | "loading" | "ready" | "analyzing" | "results"

export default function ARMoodDetectionPage() {
  const [appState, setAppState] = useState<AppState>("consent")
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleConsentGiven = () => {
    setAppState("loading")
  }

  const handleModelsLoaded = () => {
    setModelsLoaded(true)
    setAppState("ready")
  }

  const handleStartAnalysis = () => {
    setAppState("analyzing")
    setError(null)
  }

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setAppState("results")
  }

  const handleStartNewAnalysis = () => {
    setAnalysisResult(null)
    setCurrentEmotion(null)
    setAppState("ready")
  }

  const handleEmotionDetected = (emotion: EmotionData) => {
    setCurrentEmotion(emotion)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setAppState("ready")
  }

  const handleModelError = (errorMessage: string) => {
    console.log("Model loading info:", errorMessage)
  }

  // Consent Screen
  if (appState === "consent") {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto pt-16">
          <Card className="border border-gray-700 shadow-2xl bg-gray-800 text-gray-100">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-24 h-24 bg-cyan-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold text-white mb-4">AI Mood Shopping Assistant</CardTitle>
              <p className="text-xl text-gray-300 leading-relaxed">
                Discover products that perfectly match your current emotional state using advanced AI emotion detection
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <Alert className="border-gray-700 bg-gray-700 text-gray-200">
                <Shield className="h-6 w-6 text-cyan-400" />
                <AlertDescription className="text-gray-200 text-lg">
                  <strong>100% Private:</strong> All emotion analysis happens locally on your device. No data is ever
                  stored or transmitted.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">How It Works</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-white">30-Second Analysis</p>
                        <p className="text-sm text-gray-300">AI analyzes your facial expressions in real-time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-white">Mood Calculation</p>
                        <p className="text-sm text-gray-300">Determines your dominant emotional state</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-white">Perfect Products</p>
                        <p className="text-sm text-gray-300">Get personalized recommendations for your mood</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">AI Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-200">Real-time emotion detection</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-200">7 emotion categories</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-200">Smart product matching</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-200">Confidence scoring</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6">
                <Button
                  onClick={handleConsentGiven}
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-xl px-12 py-4 text-lg"
                >
                  <Camera className="w-6 h-6 mr-3" />
                  Start AI Mood Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Loading Screen
  if (appState === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <ModelLoader onModelsLoaded={handleModelsLoaded} onError={handleModelError} />
        </div>
      </div>
    )
  }

  // Ready Screen
  if (appState === "ready") {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">AI Mood Analysis Ready</h1>
            <p className="text-xl text-gray-300">Position yourself in front of the camera and start your analysis</p>
            <Badge className="mt-4 bg-cyan-700 text-white px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Models Loaded & Ready
            </Badge>
          </div>

          {error && (
            <Alert className="mb-6 border-red-700 bg-red-900 text-red-200">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Camera Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-gray-700 bg-gray-800 text-gray-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <Camera className="w-6 h-6 text-cyan-400" />
                    Camera Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CameraCapture isActive={true} onError={handleError} modelsLoaded={modelsLoaded} />

                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleStartAnalysis}
                      size="lg"
                      className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-xl px-12 py-4 text-lg"
                    >
                      <Timer className="w-6 h-6 mr-3" />
                      Start 30-Second Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <Card className="shadow-xl border-gray-700 bg-gray-800 text-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Analysis Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-xs">
                        1
                      </div>
                      <p className="text-sm text-gray-300">Position your face clearly in the camera frame</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-xs">
                        2
                      </div>
                      <p className="text-sm text-gray-300">Ensure good lighting on your face</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-xs">
                        3
                      </div>
                      <p className="text-sm text-gray-300">Stay natural - don't force expressions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold text-xs">
                        4
                      </div>
                      <p className="text-sm text-gray-300">The analysis will run for 30 seconds</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-gray-700 bg-gray-800 text-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl text-white">What We Detect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😊</span>
                      <span className="text-gray-300">Happy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😢</span>
                      <span className="text-gray-300">Sad</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😠</span>
                      <span className="text-gray-300">Angry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😲</span>
                      <span className="text-gray-300">Surprised</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😨</span>
                      <span className="text-gray-300">Fearful</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🤢</span>
                      <span className="text-gray-300">Disgusted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😐</span>
                      <span className="text-gray-300">Neutral</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Analysis Screen
  if (appState === "analyzing") {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <AnalysisSession
            onAnalysisComplete={handleAnalysisComplete}
            onEmotionDetected={handleEmotionDetected}
            onError={handleError}
            currentEmotion={currentEmotion}
          />
        </div>
      </div>
    )
  }

  // Results Screen
  if (appState === "results" && analysisResult) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <FinalMoodResult result={analysisResult} onStartNewAnalysis={handleStartNewAnalysis} />
          <MoodBasedProducts mood={analysisResult.finalMood} confidence={analysisResult.confidence} />
        </div>
      </div>
    )
  }

  return null
}
