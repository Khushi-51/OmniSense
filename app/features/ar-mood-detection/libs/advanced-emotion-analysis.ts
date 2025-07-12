import type { EmotionData, AnalysisResult } from "../types/emotion.types"

export class AdvancedEmotionAnalyzer {
  private emotionHistory: EmotionData[] = []
  private moodPatterns: Map<string, number[]> = new Map()
  private confidenceThreshold = 0.6
  private stabilityWindow = 10 // Number of samples to consider for stability

  addEmotionSample(emotion: EmotionData): void {
    if (!emotion || !emotion.dominant || emotion.confidence < 0.3) {
      return // Skip low-confidence or invalid samples
    }

    this.emotionHistory.push(emotion)
    this.updateMoodPatterns(emotion)

    // Keep only recent samples for performance
    if (this.emotionHistory.length > 1000) {
      this.emotionHistory = this.emotionHistory.slice(-500)
    }
  }

  private updateMoodPatterns(emotion: EmotionData): void {
    const mood = emotion.dominant
    if (!this.moodPatterns.has(mood)) {
      this.moodPatterns.set(mood, [])
    }

    const pattern = this.moodPatterns.get(mood)!
    pattern.push(emotion.confidence)

    // Keep only recent patterns
    if (pattern.length > 50) {
      this.moodPatterns.set(mood, pattern.slice(-25))
    }
  }

  calculateAdvancedMoodAnalysis(): AnalysisResult {
    if (this.emotionHistory.length === 0) {
      return this.getDefaultResult()
    }

    // Filter high-confidence samples
    const validSamples = this.emotionHistory.filter((e) => e.confidence >= 0.4)

    if (validSamples.length === 0) {
      return this.getDefaultResult()
    }

    // Calculate weighted emotion averages (recent samples have more weight)
    const emotionSums = this.calculateWeightedEmotions(validSamples)
    const finalMood = this.determineFinalMood(emotionSums)
    const confidence = this.calculateMoodConfidence(finalMood, validSamples)
    const stability = this.calculateMoodStability(validSamples)
    const dominantEmotions = this.getDominantEmotions(emotionSums)

    return {
      finalMood,
      confidence: Math.max(0.3, Math.min(1.0, confidence)),
      emotionBreakdown: emotionSums,
      analysisTime: this.getAnalysisTimeSeconds(),
      samplesCollected: this.emotionHistory.length,
      dominantEmotions,
      moodStability: Math.max(0.1, Math.min(1.0, stability)),
      // Additional advanced metrics
      moodTrend: this.calculateMoodTrend(),
      emotionalRange: this.calculateEmotionalRange(),
      consistencyScore: this.calculateConsistencyScore(),
    }
  }

  private calculateWeightedEmotions(samples: EmotionData[]): { [key: string]: number } {
    const emotionSums: { [key: string]: number } = {}
    const emotionWeights: { [key: string]: number } = {}

    samples.forEach((sample, index) => {
      // More recent samples get higher weight
      const weight = Math.pow(1.1, index / samples.length)
      const confidenceWeight = sample.confidence
      const finalWeight = weight * confidenceWeight

      Object.entries(sample.emotions).forEach(([emotion, value]) => {
        if (typeof value === "number" && !isNaN(value)) {
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

  private determineFinalMood(emotions: { [key: string]: number }): string {
    const entries = Object.entries(emotions)
    if (entries.length === 0) return "neutral"

    // Sort by value and get the highest
    const sorted = entries.sort(([, a], [, b]) => b - a)
    const topEmotion = sorted[0]

    // Check if the top emotion is significantly higher than others
    if (sorted.length > 1) {
      const difference = topEmotion[1] - sorted[1][1]
      if (difference < 0.1) {
        // If emotions are close, consider it neutral or mixed
        return topEmotion[1] > 0.4 ? topEmotion[0] : "neutral"
      }
    }

    return topEmotion[0]
  }

  private calculateMoodConfidence(mood: string, samples: EmotionData[]): number {
    const moodSamples = samples.filter((s) => s.dominant === mood)
    if (moodSamples.length === 0) return 0.5

    // Base confidence from sample ratio
    const ratioConfidence = moodSamples.length / samples.length

    // Average confidence of mood samples
    const avgConfidence = moodSamples.reduce((sum, s) => sum + s.confidence, 0) / moodSamples.length

    // Consistency bonus (how often this mood appears consecutively)
    const consistencyBonus = this.calculateConsistencyBonus(mood, samples)

    return ratioConfidence * 0.4 + avgConfidence * 0.4 + consistencyBonus * 0.2
  }

  private calculateMoodStability(samples: EmotionData[]): number {
    if (samples.length < 2) return 0.5

    const recentSamples = samples.slice(-this.stabilityWindow)
    const moodChanges = recentSamples
      .slice(1)
      .filter((sample, i) => sample.dominant !== recentSamples[i].dominant).length

    const maxChanges = Math.max(1, recentSamples.length - 1)
    return 1 - moodChanges / maxChanges
  }

  private calculateConsistencyBonus(mood: string, samples: EmotionData[]): number {
    let consecutiveCount = 0
    let maxConsecutive = 0

    for (let i = samples.length - 1; i >= 0; i--) {
      if (samples[i].dominant === mood) {
        consecutiveCount++
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount)
      } else {
        consecutiveCount = 0
      }
    }

    return Math.min(1.0, maxConsecutive / 10) // Max bonus for 10+ consecutive
  }

  private getDominantEmotions(emotions: { [key: string]: number }): string[] {
    return Object.entries(emotions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion)
  }

  private calculateMoodTrend(): "improving" | "declining" | "stable" {
    if (this.emotionHistory.length < 10) return "stable"

    const recent = this.emotionHistory.slice(-10)
    const earlier = this.emotionHistory.slice(-20, -10)

    if (earlier.length === 0) return "stable"

    const recentPositivity = this.calculatePositivityScore(recent)
    const earlierPositivity = this.calculatePositivityScore(earlier)

    const difference = recentPositivity - earlierPositivity

    if (difference > 0.1) return "improving"
    if (difference < -0.1) return "declining"
    return "stable"
  }

  private calculatePositivityScore(samples: EmotionData[]): number {
    const positiveEmotions = ["happy", "surprised"]
    const negativeEmotions = ["sad", "angry", "fearful", "disgusted"]

    let positiveScore = 0
    let negativeScore = 0

    samples.forEach((sample) => {
      Object.entries(sample.emotions).forEach(([emotion, value]) => {
        if (positiveEmotions.includes(emotion)) {
          positiveScore += value
        } else if (negativeEmotions.includes(emotion)) {
          negativeScore += value
        }
      })
    })

    const total = positiveScore + negativeScore
    return total > 0 ? positiveScore / total : 0.5
  }

  private calculateEmotionalRange(): number {
    if (this.emotionHistory.length === 0) return 0

    const allEmotions = new Set<string>()
    this.emotionHistory.forEach((sample) => {
      Object.keys(sample.emotions).forEach((emotion) => allEmotions.add(emotion))
    })

    return allEmotions.size / 7 // Normalize by max possible emotions
  }

  private calculateConsistencyScore(): number {
    if (this.emotionHistory.length < 5) return 0.5

    const moodCounts = new Map<string, number>()
    this.emotionHistory.forEach((sample) => {
      const count = moodCounts.get(sample.dominant) || 0
      moodCounts.set(sample.dominant, count + 1)
    })

    const maxCount = Math.max(...moodCounts.values())
    return maxCount / this.emotionHistory.length
  }

  private getAnalysisTimeSeconds(): number {
    if (this.emotionHistory.length < 2) return 0

    const firstTimestamp = this.emotionHistory[0].timestamp
    const lastTimestamp = this.emotionHistory[this.emotionHistory.length - 1].timestamp

    return Math.round((lastTimestamp - firstTimestamp) / 1000)
  }

  private getDefaultResult(): AnalysisResult {
    return {
      finalMood: "neutral",
      confidence: 0.5,
      emotionBreakdown: { neutral: 1.0 },
      analysisTime: 0,
      samplesCollected: 0,
      dominantEmotions: ["neutral"],
      moodStability: 0.5,
      moodTrend: "stable",
      emotionalRange: 0,
      consistencyScore: 0.5,
    }
  }

  // Public methods for real-time insights
  getCurrentMoodStreak(): { mood: string; count: number } {
    if (this.emotionHistory.length === 0) {
      return { mood: "neutral", count: 0 }
    }

    const currentMood = this.emotionHistory[this.emotionHistory.length - 1].dominant
    let count = 0

    for (let i = this.emotionHistory.length - 1; i >= 0; i--) {
      if (this.emotionHistory[i].dominant === currentMood) {
        count++
      } else {
        break
      }
    }

    return { mood: currentMood, count }
  }

  getMoodDistribution(): { [key: string]: number } {
    if (this.emotionHistory.length === 0) return {}

    const distribution: { [key: string]: number } = {}

    this.emotionHistory.forEach((sample) => {
      distribution[sample.dominant] = (distribution[sample.dominant] || 0) + 1
    })

    // Convert to percentages
    Object.keys(distribution).forEach((mood) => {
      distribution[mood] = distribution[mood] / this.emotionHistory.length
    })

    return distribution
  }

  getConfidenceTrend(): number[] {
    return this.emotionHistory.slice(-20).map((sample) => sample.confidence)
  }

  reset(): void {
    this.emotionHistory = []
    this.moodPatterns.clear()
  }
}
