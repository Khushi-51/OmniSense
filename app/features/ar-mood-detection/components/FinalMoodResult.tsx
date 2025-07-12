"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { AnalysisResult } from "../types/emotion.types"
import { Trophy, TrendingUp, Clock, RotateCcw, Share2 } from "lucide-react"

interface FinalMoodResultProps {
  result: AnalysisResult
  onStartNewAnalysis: () => void
}

export default function FinalMoodResult({ result, onStartNewAnalysis }: FinalMoodResultProps) {
  const getMoodEmoji = (mood: string) => {
    const emojiMap: { [key: string]: string } = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      surprised: "😲",
      fearful: "😨",
      disgusted: "🤢",
      neutral: "😐",
    }
    return emojiMap[mood] || "😐"
  }

  const getMoodColor = (mood: string) => {
    const colorMap: { [key: string]: string } = {
      happy: "from-yellow-400 to-orange-400",
      sad: "from-blue-400 to-indigo-400",
      angry: "from-red-400 to-pink-400",
      surprised: "from-purple-400 to-indigo-400",
      fearful: "from-gray-400 to-slate-400",
      disgusted: "from-green-400 to-emerald-400",
      neutral: "from-slate-400 to-gray-400",
    }
    return colorMap[mood] || "from-slate-400 to-gray-400"
  }

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return { level: "Very High", color: "text-green-600", bg: "bg-green-100" }
    if (confidence >= 0.6) return { level: "High", color: "text-blue-600", bg: "bg-blue-100" }
    if (confidence >= 0.4) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "Low", color: "text-red-600", bg: "bg-red-100" }
  }

  const confidenceInfo = getConfidenceLevel(result.confidence)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Your Mood Analysis Results
        </h1>
        <p className="text-xl text-slate-600">
          Based on {result.samplesCollected} emotion samples over {result.analysisTime} seconds
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Result */}
        <div className="lg:col-span-2">
          <Card className={`shadow-2xl border-2 bg-gradient-to-br ${getMoodColor(result.finalMood)} border-white/20`}>
            <CardContent className="p-12 text-center text-white">
              <div className="space-y-6">
                <div className="text-9xl mb-6 drop-shadow-lg">{getMoodEmoji(result.finalMood)}</div>

                <div>
                  <h2 className="text-5xl font-bold mb-4 capitalize drop-shadow-lg">{result.finalMood}</h2>
                  <p className="text-2xl opacity-90 drop-shadow">Your dominant emotional state</p>
                </div>

                <div className="flex justify-center gap-4">
                  <Badge className={`${confidenceInfo.bg} ${confidenceInfo.color} text-lg px-6 py-3 border-0`}>
                    <Trophy className="w-5 h-5 mr-2" />
                    {Math.round(result.confidence * 100)}% Confidence
                  </Badge>
                  <Badge className="bg-white/20 text-white text-lg px-6 py-3 border-0">
                    {confidenceInfo.level} Accuracy
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Details */}
        <div className="space-y-6">
          {/* Emotion Breakdown */}
          <Card className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <TrendingUp className="w-5 h-5" />
                Emotion Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(result.emotionBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([emotion, value]) => (
                  <div key={emotion} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium text-slate-700 flex items-center gap-2">
                        <span className="text-lg">{getMoodEmoji(emotion)}</span>
                        {emotion}
                      </span>
                      <span className="text-slate-600">{Math.round(value * 100)}%</span>
                    </div>
                    <Progress value={value * 100} className="h-2" />
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Analysis Stats */}
          <Card className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <Clock className="w-5 h-5" />
                Analysis Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{result.samplesCollected}</div>
                  <div className="text-xs text-blue-500 uppercase tracking-wide">Samples</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{result.analysisTime}s</div>
                  <div className="text-xs text-green-500 uppercase tracking-wide">Duration</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(result.moodStability * 100)}%</div>
                  <div className="text-xs text-purple-500 uppercase tracking-wide">Stability</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{Math.round(result.confidence * 100)}%</div>
                  <div className="text-xs text-orange-500 uppercase tracking-wide">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-xl border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              <Button
                onClick={onStartNewAnalysis}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Start New Analysis
              </Button>

              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <Share2 className="w-5 h-5 mr-2" />
                Share Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
