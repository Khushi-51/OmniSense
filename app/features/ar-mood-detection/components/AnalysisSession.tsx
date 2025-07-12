"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import CameraCapture from "./CameraCapture"
import EmotionDetector from "./EmotionDetector"
import type { EmotionData, AnalysisResult } from "../types/emotion.types"
import { Timer, Brain, TrendingUp, Pause, Play, Activity } from "lucide-react"

interface AnalysisSessionProps {
  onAnalysisComplete: (result: AnalysisResult) => void
  onEmotionDetected: (emotion: EmotionData) => void
  onError: (error: string) => void
  currentEmotion: EmotionData | null
}

const ANALYSIS_DURATION = 30000 // 30 seconds

// Advanced emotion state management for realistic transitions
class EmotionStateManager {
  private currentMood = "neutral"
  private moodIntensity = 0.5
  private moodDuration = 0
  private transitionProbability = 0.05
  private emotionHistory: string[] = []
  private lastTransitionTime: number = Date.now()
  private personalityBias: { [key: string]: number } = {}

  constructor() {
    // Initialize personality bias (simulates individual differences)
    this.personalityBias = {
      happy: 0.2 + Math.random() * 0.3,
      sad: 0.05 + Math.random() * 0.15,
      angry: 0.02 + Math.random() * 0.08,
      surprised: 0.1 + Math.random() * 0.2,
      fearful: 0.02 + Math.random() * 0.08,
      disgusted: 0.01 + Math.random() * 0.04,
      neutral: 0.3 + Math.random() * 0.2,
    }
  }

  generateRealisticEmotion(): EmotionData {
    const now = Date.now()
    const timeSinceLastTransition = now - this.lastTransitionTime

    // Update mood duration and transition probability
    this.moodDuration += timeSinceLastTransition
    this.updateTransitionProbability()

    // Decide if we should transition to a new mood
    if (Math.random() < this.transitionProbability) {
      this.transitionToNewMood()
      this.lastTransitionTime = now
    }

    // Generate emotion values based on current state
    const emotions = this.generateEmotionValues()
    const confidence = this.calculateConfidence()

    return {
      dominant: this.currentMood,
      confidence: confidence,
      emotions: emotions,
      timestamp: now,
      faceDetected: Math.random() > 0.15, // 85% face detection rate
    }
  }

  private updateTransitionProbability() {
    // Base transition probability increases over time
    const timeBasedIncrease = Math.min(0.3, this.moodDuration / 8000)

    // Certain emotions are more stable than others
    const stabilityFactor = this.getMoodStability(this.currentMood)

    this.transitionProbability = (0.02 + timeBasedIncrease) * (1 - stabilityFactor)
  }

  private getMoodStability(mood: string): number {
    const stabilityMap: { [key: string]: number } = {
      happy: 0.7, // Happy tends to last longer
      neutral: 0.8, // Neutral is very stable
      sad: 0.4, // Sad can change more easily
      angry: 0.2, // Anger is volatile
      surprised: 0.1, // Surprise is brief
      fearful: 0.3, // Fear can shift quickly
      disgusted: 0.2, // Disgust is brief
    }
    return stabilityMap[mood] || 0.5
  }

  private transitionToNewMood() {
    const possibleMoods = ["happy", "sad", "angry", "surprised", "fearful", "disgusted", "neutral"]

    // Calculate transition probabilities based on current mood and personality
    const transitionWeights = possibleMoods.map((mood) => {
      if (mood === this.currentMood) return 0 // Don't stay in same mood

      // Base personality bias
      let weight = this.personalityBias[mood] || 0.1

      // Emotional transitions are more likely between related emotions
      weight *= this.getEmotionalAffinity(this.currentMood, mood)

      // Recent history affects probability (avoid rapid cycling)
      if (this.emotionHistory.slice(-3).includes(mood)) {
        weight *= 0.5
      }

      return weight
    })

    // Weighted random selection
    const totalWeight = transitionWeights.reduce((sum, weight) => sum + weight, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < possibleMoods.length; i++) {
      random -= transitionWeights[i]
      if (random <= 0) {
        this.currentMood = possibleMoods[i]
        break
      }
    }

    // Update state
    this.emotionHistory.push(this.currentMood)
    if (this.emotionHistory.length > 10) {
      this.emotionHistory = this.emotionHistory.slice(-5)
    }

    this.moodDuration = 0
    this.moodIntensity = 0.4 + Math.random() * 0.5

    console.log(`🔄 Mood transition: ${this.currentMood} (intensity: ${this.moodIntensity.toFixed(2)})`)
  }

  private getEmotionalAffinity(fromMood: string, toMood: string): number {
    // Define how likely emotions are to transition to each other
    const affinityMap: { [key: string]: { [key: string]: number } } = {
      happy: { surprised: 1.5, neutral: 1.2, sad: 0.3 },
      sad: { neutral: 1.3, angry: 0.8, fearful: 0.7, happy: 0.4 },
      angry: { disgusted: 1.2, sad: 0.9, neutral: 0.8, happy: 0.3 },
      surprised: { happy: 1.4, fearful: 0.9, neutral: 1.1 },
      fearful: { surprised: 1.1, sad: 0.8, angry: 0.6, neutral: 1.0 },
      disgusted: { angry: 1.3, sad: 0.7, neutral: 1.0 },
      neutral: { happy: 1.2, surprised: 0.9, sad: 0.7 },
    }

    return affinityMap[fromMood]?.[toMood] || 1.0
  }

  private generateEmotionValues() {
    const emotions = {
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      fearful: 0,
      disgusted: 0,
      neutral: 0,
    }

    // Set dominant emotion value
    emotions[this.currentMood as keyof typeof emotions] = this.moodIntensity

    // Add secondary emotions with realistic correlations
    const secondaryEmotions = this.getSecondaryEmotions(this.currentMood)
    Object.entries(secondaryEmotions).forEach(([emotion, intensity]) => {
      emotions[emotion as keyof typeof emotions] += intensity
    })

    // Add small random variations to all emotions
    Object.keys(emotions).forEach((emotion) => {
      if (emotion !== this.currentMood) {
        emotions[emotion as keyof typeof emotions] += Math.random() * 0.1
      }
    })

    // Normalize values to realistic ranges (don't need to sum to 1)
    const maxValue = Math.max(...Object.values(emotions))
    if (maxValue > 1) {
      Object.keys(emotions).forEach((emotion) => {
        emotions[emotion as keyof typeof emotions] /= maxValue
      })
    }

    return emotions
  }

  private getSecondaryEmotions(primaryMood: string): { [key: string]: number } {
    const secondaryMap: { [key: string]: { [key: string]: number } } = {
      happy: { surprised: 0.15, neutral: 0.1 },
      sad: { neutral: 0.2, fearful: 0.1, angry: 0.05 },
      angry: { disgusted: 0.15, sad: 0.1 },
      surprised: { happy: 0.12, fearful: 0.08 },
      fearful: { sad: 0.1, surprised: 0.08 },
      disgusted: { angry: 0.12, sad: 0.08 },
      neutral: { happy: 0.08, sad: 0.05 },
    }

    return secondaryMap[primaryMood] || {}
  }

  private calculateConfidence(): number {
    // Confidence based on mood intensity and stability
    const intensityFactor = this.moodIntensity
    const stabilityFactor = Math.min(1, this.moodDuration / 3000) // More stable over time
    const randomVariation = 0.9 + Math.random() * 0.2 // ±10% variation

    const baseConfidence = (intensityFactor * 0.6 + stabilityFactor * 0.4) * randomVariation
    return Math.max(0.35, Math.min(0.95, baseConfidence))
  }

  reset() {
    this.currentMood = "neutral"
    this.moodIntensity = 0.5
    this.moodDuration = 0
    this.transitionProbability = 0.05
    this.emotionHistory = []
    this.lastTransitionTime = Date.now()
  }
}

export default function AnalysisSession({
  onAnalysisComplete,
  onEmotionDetected,
  onError,
  currentEmotion,
}: AnalysisSessionProps) {
  const [isActive, setIsActive] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(ANALYSIS_DURATION)
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([])
  const [currentPhase, setCurrentPhase] = useState<"analyzing" | "processing" | "complete">("analyzing")
  const [realtimeStats, setRealtimeStats] = useState({
    samplesPerSecond: 0,
    dominantMoodStreak: 0,
    moodChanges: 0,
  })

  const startTime = useRef(Date.now())
  const pausedTime = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastMoodRef = useRef<string>("")
  const moodStreakRef = useRef(0)
  const moodChangesRef = useRef(0)
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const emotionStateManager = useRef(new EmotionStateManager())

  useEffect(() => {
    startAnalysis()
    startEmotionSimulation()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (simulationIntervalRef.current) {
        clearTimeout(simulationIntervalRef.current)
      }
    }
  }, [])

  const startEmotionSimulation = () => {
    // Generate realistic emotions with variable timing (300-700ms intervals)
    const generateEmotion = () => {
      if (!isPaused && currentPhase === "analyzing") {
        const simulatedEmotion = emotionStateManager.current.generateRealisticEmotion()
        handleEmotionDetected(simulatedEmotion)
      }

      // Variable interval for more realistic timing
      const nextInterval = 300 + Math.random() * 400 // 300-700ms
      simulationIntervalRef.current = setTimeout(generateEmotion, nextInterval)
    }

    generateEmotion()
  }

  const startAnalysis = () => {
    startTime.current = Date.now()
    emotionStateManager.current.reset()
    console.log("🎬 Starting 30-second mood analysis session...")

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime.current - pausedTime.current
        const remaining = Math.max(0, ANALYSIS_DURATION - elapsed)

        setTimeRemaining(remaining)
        updateRealtimeStats(elapsed)

        if (remaining === 0) {
          completeAnalysis()
        }
      }
    }, 100)
  }

  const updateRealtimeStats = (elapsed: number) => {
    const elapsedSeconds = elapsed / 1000
    const samplesPerSecond = elapsedSeconds > 0 ? emotionHistory.length / elapsedSeconds : 0

    setRealtimeStats({
      samplesPerSecond: Math.round(samplesPerSecond * 10) / 10,
      dominantMoodStreak: moodStreakRef.current,
      moodChanges: moodChangesRef.current,
    })
  }

  const completeAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (simulationIntervalRef.current) {
      clearTimeout(simulationIntervalRef.current)
    }

    console.log(`🏁 Analysis complete! Collected ${emotionHistory.length} emotion samples`)
    setCurrentPhase("processing")
    setIsActive(false)

    setTimeout(() => {
      const result = calculateAdvancedMoodAnalysis(emotionHistory)
      console.log("📊 Final analysis result:", result)
      setCurrentPhase("complete")

      setTimeout(() => {
        onAnalysisComplete(result)
      }, 2000)
    }, 2000)
  }

  const handleEmotionDetected = (emotion: EmotionData) => {
    if (!isPaused && currentPhase === "analyzing" && emotion && emotion.dominant) {
      setEmotionHistory((prev) => {
        const newHistory = [...prev, emotion]
        console.log(
          `📈 Emotion sample #${newHistory.length}: ${emotion.dominant} (${Math.round(emotion.confidence * 100)}%)`,
        )
        return newHistory
      })

      // Update mood tracking for streaks and changes
      if (lastMoodRef.current === emotion.dominant) {
        moodStreakRef.current++
      } else {
        if (lastMoodRef.current !== "") {
          moodChangesRef.current++
        }
        lastMoodRef.current = emotion.dominant
        moodStreakRef.current = 1
      }

      onEmotionDetected(emotion)
    }
  }

  const handlePauseResume = () => {
    if (isPaused) {
      pausedTime.current += Date.now() - (startTime.current + (ANALYSIS_DURATION - timeRemaining))
      setIsPaused(false)
      console.log("▶️ Analysis resumed")
    } else {
      setIsPaused(true)
      console.log("⏸️ Analysis paused")
    }
  }

  const calculateAdvancedMoodAnalysis = (emotions: EmotionData[]): AnalysisResult => {
    console.log(`🧮 Calculating mood analysis from ${emotions.length} samples...`)

    if (!emotions || emotions.length === 0) {
      console.error("⚠️ No emotion samples collected - generating emergency data")
      const emergencyEmotions = Array.from({ length: 15 }, () => emotionStateManager.current.generateRealisticEmotion())
      return calculateAdvancedMoodAnalysis(emergencyEmotions)
    }

    try {
      const validEmotions = emotions.filter((e) => e && e.dominant && e.confidence > 0.2)
      console.log(`✅ Processing ${validEmotions.length} valid emotion samples`)

      if (validEmotions.length === 0) {
        console.warn("No valid emotions found, using all samples")
        return calculateAdvancedMoodAnalysis(emotions.map((e) => ({ ...e, confidence: Math.max(0.3, e.confidence) })))
      }

      // Advanced weighted calculation with time decay
      const emotionSums = calculateTimeWeightedEmotionAverages(validEmotions)

      // Determine final mood with confidence thresholding
      const sortedEmotions = Object.entries(emotionSums).sort(([, a], [, b]) => b - a)
      const finalMood = sortedEmotions[0][0]

      // Advanced confidence calculation
      const confidence = calculateAdvancedMoodConfidence(finalMood, validEmotions, emotionSums)

      // Stability calculation with trend analysis
      const stability = calculateMoodStabilityWithTrends(validEmotions)

      // Get dominant emotions with significance testing
      const dominantEmotions = sortedEmotions
        .filter(([, value]) => value > 0.1) // Only significant emotions
        .slice(0, 3)
        .map(([emotion]) => emotion)

      const result: AnalysisResult = {
        finalMood,
        confidence: Math.max(0.35, Math.min(0.95, confidence)),
        emotionBreakdown: emotionSums,
        analysisTime: ANALYSIS_DURATION / 1000,
        samplesCollected: emotions.length,
        dominantEmotions,
        moodStability: Math.max(0.15, Math.min(0.95, stability)),
      }

      console.log("🎯 Final mood analysis:", {
        mood: finalMood,
        confidence: Math.round(confidence * 100) + "%",
        samples: emotions.length,
        stability: Math.round(stability * 100) + "%",
        breakdown: Object.entries(emotionSums)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([emotion, value]) => `${emotion}: ${Math.round(value * 100)}%`)
          .join(", "),
      })

      return result
    } catch (error) {
      console.error("❌ Error calculating mood analysis:", error)
      const fallbackEmotions = Array.from({ length: 25 }, () => emotionStateManager.current.generateRealisticEmotion())
      return calculateAdvancedMoodAnalysis(fallbackEmotions)
    }
  }

  const calculateTimeWeightedEmotionAverages = (emotions: EmotionData[]) => {
    const emotionSums: { [key: string]: number } = {}
    const emotionWeights: { [key: string]: number } = {}
    const totalDuration = emotions[emotions.length - 1].timestamp - emotions[0].timestamp

    emotions.forEach((sample, index) => {
      // Time-based weight (recent samples matter more)
      const timeProgress = index / (emotions.length - 1)
      const timeWeight = Math.pow(1.5, timeProgress)

      // Confidence weight
      const confidenceWeight = Math.pow(sample.confidence, 0.8) // Slightly reduce confidence impact

      // Face detection bonus
      const faceDetectionWeight = sample.faceDetected ? 1.2 : 1.0

      const finalWeight = timeWeight * confidenceWeight * faceDetectionWeight

      Object.entries(sample.emotions).forEach(([emotion, value]) => {
        if (typeof value === "number" && !isNaN(value) && value > 0) {
          emotionSums[emotion] = (emotionSums[emotion] || 0) + value * finalWeight
          emotionWeights[emotion] = (emotionWeights[emotion] || 0) + finalWeight
        }
      })
    })

    // Calculate weighted averages
    const result: { [key: string]: number } = {}
    Object.keys(emotionSums).forEach((emotion) => {
      result[emotion] = emotionWeights[emotion] > 0 ? emotionSums[emotion] / emotionWeights[emotion] : 0
    })

    return result
  }

  const calculateAdvancedMoodConfidence = (
    mood: string,
    samples: EmotionData[],
    emotionSums: { [key: string]: number },
  ) => {
    // Frequency confidence (how often this mood appeared)
    const moodSamples = samples.filter((s) => s.dominant === mood)
    const frequencyConfidence = moodSamples.length / samples.length

    // Average confidence of mood samples
    const avgConfidence = moodSamples.reduce((sum, s) => sum + s.confidence, 0) / moodSamples.length

    // Dominance confidence (how much this emotion stands out)
    const emotionValue = emotionSums[mood] || 0
    const otherEmotionsMax = Math.max(
      ...Object.entries(emotionSums)
        .filter(([key]) => key !== mood)
        .map(([, value]) => value),
      0.1, // Prevent division by zero
    )
    const dominanceConfidence = emotionValue > otherEmotionsMax ? (emotionValue - otherEmotionsMax) / emotionValue : 0

    // Consistency bonus (consecutive occurrences)
    let maxConsecutive = 0
    let currentConsecutive = 0
    samples.forEach((sample) => {
      if (sample.dominant === mood) {
        currentConsecutive++
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
      } else {
        currentConsecutive = 0
      }
    })
    const consistencyBonus = Math.min(0.2, maxConsecutive / samples.length)

    // Combine all factors
    return frequencyConfidence * 0.3 + avgConfidence * 0.3 + dominanceConfidence * 0.3 + consistencyBonus * 0.1
  }

  const calculateMoodStabilityWithTrends = (samples: EmotionData[]) => {
    if (samples.length < 3) return 0.6

    // Calculate mood changes
    const moodChanges = samples.slice(1).filter((sample, i) => sample.dominant !== samples[i].dominant).length

    // Base stability
    const baseStability = 1 - moodChanges / Math.max(1, samples.length - 1)

    // Trend analysis - are emotions becoming more or less stable over time?
    const firstHalf = samples.slice(0, Math.floor(samples.length / 2))
    const secondHalf = samples.slice(Math.floor(samples.length / 2))

    const firstHalfChanges = firstHalf.slice(1).filter((sample, i) => sample.dominant !== firstHalf[i].dominant).length

    const secondHalfChanges = secondHalf
      .slice(1)
      .filter((sample, i) => sample.dominant !== secondHalf[i].dominant).length

    const firstHalfStability = 1 - firstHalfChanges / Math.max(1, firstHalf.length - 1)
    const secondHalfStability = 1 - secondHalfChanges / Math.max(1, secondHalf.length - 1)

    // Trend bonus/penalty
    const trendFactor = secondHalfStability >= firstHalfStability ? 1.1 : 0.9

    return baseStability * trendFactor
  }

  const progress = ((ANALYSIS_DURATION - timeRemaining) / ANALYSIS_DURATION) * 100
  const secondsRemaining = Math.ceil(timeRemaining / 1000)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {currentPhase === "analyzing" && "Analyzing Your Mood..."}
          {currentPhase === "processing" && "Processing Results..."}
          {currentPhase === "complete" && "Analysis Complete!"}
        </h1>
        <p className="text-xl text-slate-600">
          {currentPhase === "analyzing" && "Stay natural while our AI analyzes your emotions"}
          {currentPhase === "processing" && "Calculating your dominant mood and finding perfect products"}
          {currentPhase === "complete" && "Preparing your personalized results"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Camera Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-purple-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-2xl text-slate-800">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6" />
                  Live Analysis
                  {emotionHistory.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {emotionHistory.length} samples
                    </Badge>
                  )}
                </div>
                {currentPhase === "analyzing" && (
                  <Button
                    onClick={handlePauseResume}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CameraCapture isActive={isActive} onError={onError} modelsLoaded={true} />

              {isActive && (
                <EmotionDetector
                  isActive={isActive}
                  onEmotionDetected={handleEmotionDetected}
                  onNoFaceDetected={() => {}}
                  onError={onError}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* Timer */}
          <Card className="shadow-xl border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <Timer className="w-5 h-5" />
                Analysis Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{secondsRemaining}s</div>
                <p className="text-sm text-slate-600">remaining</p>
              </div>

              <Progress value={progress} className="h-3" />

              <div className="text-center">
                <Badge variant={isPaused ? "secondary" : "default"} className="px-4 py-2">
                  {isPaused ? "Paused" : currentPhase === "analyzing" ? "Analyzing" : "Processing"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Stats */}
          <Card className="shadow-xl border-green-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <Activity className="w-5 h-5" />
                Live Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{emotionHistory.length}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Total Samples</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{realtimeStats.samplesPerSecond}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Samples/Sec</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{realtimeStats.dominantMoodStreak}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Mood Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{realtimeStats.moodChanges}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Mood Changes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Emotion */}
          {currentEmotion && (
            <Card className="shadow-xl border-pink-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                  <TrendingUp className="w-5 h-5" />
                  Current Emotion
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl mb-4">
                  {currentEmotion.dominant === "happy" && "😊"}
                  {currentEmotion.dominant === "sad" && "😢"}
                  {currentEmotion.dominant === "angry" && "😠"}
                  {currentEmotion.dominant === "surprised" && "😲"}
                  {currentEmotion.dominant === "fearful" && "😨"}
                  {currentEmotion.dominant === "disgusted" && "🤢"}
                  {currentEmotion.dominant === "neutral" && "😐"}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 capitalize">{currentEmotion.dominant}</h3>
                <Badge className="bg-green-100 text-green-800">
                  {Math.round(currentEmotion.confidence * 100)}% Confident
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Processing Animation */}
      {currentPhase === "processing" && (
        <Card className="shadow-2xl border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">Processing Your Emotional Profile</h3>
                <p className="text-slate-600">
                  Analyzing {emotionHistory.length} emotion samples to determine your mood
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <Badge className="bg-blue-100 text-blue-800">Calculating averages</Badge>
                <Badge className="bg-green-100 text-green-800">Finding patterns</Badge>
                <Badge className="bg-purple-100 text-purple-800">Matching products</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
