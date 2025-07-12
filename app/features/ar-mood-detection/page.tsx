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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-3xl mx-auto pt-16">
          <Card className="border-2 border-purple-200 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                AI Mood Shopping Assistant
              </CardTitle>
              <p className="text-xl text-slate-600 leading-relaxed">
                Discover products that perfectly match your current emotional state using advanced AI emotion detection
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              <Alert className="border-purple-200 bg-purple-50">
                <Shield className="h-6 w-6 text-purple-600" />
                <AlertDescription className="text-purple-800 text-lg">
                  <strong>100% Private:</strong> All emotion analysis happens locally on your device. No data is ever
                  stored or transmitted.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-slate-800">How It Works</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">30-Second Analysis</p>
                        <p className="text-sm text-slate-600">AI analyzes your facial expressions in real-time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Mood Calculation</p>
                        <p className="text-sm text-slate-600">Determines your dominant emotional state</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Perfect Products</p>
                        <p className="text-sm text-slate-600">Get personalized recommendations for your mood</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-slate-800">AI Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-800">Real-time emotion detection</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <Sparkles className="w-5 h-5 text-green-500" />
                      <span className="text-slate-800">7 emotion categories</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <span className="text-slate-800">Smart product matching</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                      <Sparkles className="w-5 h-5 text-orange-500" />
                      <span className="text-slate-800">Confidence scoring</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6">
                <Button
                  onClick={handleConsentGiven}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl px-12 py-4 text-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <ModelLoader onModelsLoaded={handleModelsLoaded} onError={handleModelError} />
        </div>
      </div>
    )
  }

  // Ready Screen
  if (appState === "ready") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              AI Mood Analysis Ready
            </h1>
            <p className="text-xl text-slate-600">Position yourself in front of the camera and start your analysis</p>
            <Badge className="mt-4 bg-green-100 text-green-800 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Models Loaded & Ready
            </Badge>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Camera Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl border-purple-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                    <Camera className="w-6 h-6" />
                    Camera Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CameraCapture isActive={true} onError={handleError} modelsLoaded={modelsLoaded} />

                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleStartAnalysis}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl px-12 py-4 text-lg"
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
              <Card className="shadow-xl border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">Analysis Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        1
                      </div>
                      <p className="text-sm text-slate-700">Position your face clearly in the camera frame</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        2
                      </div>
                      <p className="text-sm text-slate-700">Ensure good lighting on your face</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        3
                      </div>
                      <p className="text-sm text-slate-700">Stay natural - don't force expressions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        4
                      </div>
                      <p className="text-sm text-slate-700">The analysis will run for 30 seconds</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-purple-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">What We Detect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😊</span>
                      <span className="text-slate-700">Happy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😢</span>
                      <span className="text-slate-700">Sad</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😠</span>
                      <span className="text-slate-700">Angry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😲</span>
                      <span className="text-slate-700">Surprised</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😨</span>
                      <span className="text-slate-700">Fearful</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🤢</span>
                      <span className="text-slate-700">Disgusted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😐</span>
                      <span className="text-slate-700">Neutral</span>
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <FinalMoodResult result={analysisResult} onStartNewAnalysis={handleStartNewAnalysis} />
          <MoodBasedProducts mood={analysisResult.finalMood} confidence={analysisResult.confidence} />
        </div>
      </div>
    )
  }

  return null
}
