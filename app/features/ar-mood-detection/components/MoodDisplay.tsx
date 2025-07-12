"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { EmotionData } from "../types/emotion.types"
import { getMoodEmoji, getMoodDescription } from "../libs/emotion-mapping"
import { Brain, TrendingUp, Clock, User } from "lucide-react"
import { isRealMode } from "../libs/face-detection"

interface MoodDisplayProps {
  emotion: EmotionData | null
}

export default function MoodDisplay({ emotion }: MoodDisplayProps) {
  if (!emotion) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Brain className="w-5 h-5" />
            Real-Time Emotion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <div className="text-8xl mb-6">🤖</div>
            <p className="text-lg font-medium">Waiting for Face Detection</p>
            <p className="text-sm mt-2">Position your face in the camera view</p>
            <Badge className="mt-4" variant={isRealMode() ? "default" : "secondary"}>
              {isRealMode() ? "🔥 REAL-TIME MODE" : "📱 DEMO MODE"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  const moodEmoji = getMoodEmoji(emotion.dominant)
  const moodDescription = getMoodDescription(emotion.dominant)

  // Get top 3 emotions for display
  const topEmotions = Object.entries(emotion.emotions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-white to-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <TrendingUp className="w-5 h-5" />
          Live Emotion Analysis
          <Badge variant={isRealMode() ? "default" : "secondary"} className="ml-auto">
            {isRealMode() ? "🔥 REAL-TIME" : "📱 DEMO"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Mood Display */}
        <div className="text-center">
          <div className="text-9xl mb-6 animate-pulse">{moodEmoji}</div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-3">
            {emotion.dominant.charAt(0).toUpperCase() + emotion.dominant.slice(1)}
          </h3>
          <p className="text-slate-600 mb-4 text-lg">{moodDescription}</p>
          <Badge variant="secondary" className="text-lg px-6 py-2 bg-blue-100 text-blue-800">
            {Math.round(emotion.confidence * 100)}% Confidence
          </Badge>
        </div>

        {/* Real-time Demographics (if available) */}
        {isRealMode() && (emotion as any).age && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <User className="w-4 h-4" />
              Demographics (Real-time AI)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{(emotion as any).age}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Estimated Age</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{(emotion as any).gender}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  {Math.round((emotion as any).genderProbability * 100)}% Confidence
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Emotions */}
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Real-time Emotion Breakdown
          </h4>
          {topEmotions.map(([emotionName, value]) => (
            <div key={emotionName} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize font-medium text-slate-700">{emotionName}</span>
                <span className="text-slate-600">{Math.round(value * 100)}%</span>
              </div>
              <Progress value={value * 100} className={`h-3 ${isRealMode() ? "bg-green-200" : "bg-slate-200"}`} />
            </div>
          ))}
        </div>

        {/* Analysis Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{Math.round(emotion.confidence * 100)}%</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{Object.keys(emotion.emotions).length}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Emotions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{isRealMode() ? "5" : "2"}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">FPS</p>
          </div>
        </div>

        {/* Timestamp */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Last updated: {new Date(emotion.timestamp).toLocaleTimeString()}
            {isRealMode() && <span className="text-green-600 ml-2">• LIVE</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
