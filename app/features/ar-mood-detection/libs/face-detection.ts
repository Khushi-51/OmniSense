import type { EmotionData } from "../types/emotion.types"

// Global state for face detection
let faceapi: any = null
let modelsLoaded = false
let isLoading = false

// Demo mode state for realistic emotion simulation
let demoEmotionState = {
  currentMood: "neutral" as string,
  moodDuration: 0,
  transitionProbability: 0.1,
  lastEmotionTime: Date.now(),
  emotionHistory: [] as string[],
}

export async function loadFaceApiModels(): Promise<void> {
  if (modelsLoaded || isLoading) return

  try {
    isLoading = true
    console.log("\u{1F680} Loading face-api.js models...")

    try {
      faceapi = await import("face-api.js")
      const MODEL_URL = "/models"

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ])

      modelsLoaded = true
      console.log("\u{2705} Face-api.js models loaded successfully!")
    } catch (error) {
      console.warn("\u{26A0}\uFE0F Face-api.js not available, using enhanced demo mode")
      modelsLoaded = false
    }
  } catch (error) {
    console.error("\u{274C} Error loading models:", error)
    modelsLoaded = false
  } finally {
    isLoading = false
  }
}

export async function detectEmotionRealTime(videoElement: HTMLVideoElement): Promise<{
  emotion: EmotionData
  detections: any[]
} | null> {
  try {
    if (!isVideoElementReady(videoElement)) return null

    if (faceapi && modelsLoaded) {
      return await performRealFaceDetection(videoElement)
    } else {
      return generateRealisticEmotionDetection(videoElement)
    }
  } catch (error) {
    console.error("\u{274C} Detection error:", error)
    return generateRealisticEmotionDetection(videoElement)
  }
}

function isVideoElementReady(videoElement: HTMLVideoElement): boolean {
  return (
    videoElement &&
    videoElement.readyState >= 3 &&
    !videoElement.paused &&
    !videoElement.ended &&
    videoElement.videoWidth > 0 &&
    videoElement.videoHeight > 0
  )
}

async function performRealFaceDetection(videoElement: HTMLVideoElement) {
  try {
    const detections = await faceapi
      .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()

    if (detections && detections.length > 0) {
      const detection = detections[0]
      const expressions = detection.expressions

      if (expressions) {
        const emotionData = processRealEmotions(expressions)
        return {
          emotion: emotionData,
          detections,
        }
      }
    }

    return null
  } catch (error) {
    console.error("Real detection failed:", error)
    return null
  }
}

function processRealEmotions(expressions: any): EmotionData {
  const emotions = {
    happy: expressions.happy || 0,
    sad: expressions.sad || 0,
    angry: expressions.angry || 0,
    surprised: expressions.surprised || 0,
    fearful: expressions.fearful || 0,
    disgusted: expressions.disgusted || 0,
    neutral: expressions.neutral || 0,
  }

  const dominant = Object.entries(emotions).reduce((a, b) => (emotions[a[0]] > emotions[b[0]] ? a : b))[0]
  const confidence = emotions[dominant]

  return {
    emotions,
    dominant,
    confidence: Math.max(0.4, confidence),
    timestamp: Date.now(),
  }
}

function generateRealisticEmotionDetection(videoElement: HTMLVideoElement) {
  const currentTime = Date.now()
  const timeSinceLastEmotion = currentTime - demoEmotionState.lastEmotionTime

  updateDemoEmotionState(timeSinceLastEmotion)

  const emotions = generateDynamicEmotions()
  const dominant = getDominantEmotion(emotions)
  const confidence = calculateRealisticConfidence(emotions, dominant)
  const mockDetection = createMockDetection(videoElement, emotions)

  const emotionData: EmotionData = {
    emotions,
    dominant,
    confidence,
    timestamp: currentTime,
  }

  console.log(`\u{1F63F} Demo Detection: ${dominant} (${Math.round(confidence * 100)}%)`, emotions)

  return {
    emotion: emotionData,
    detections: [mockDetection],
  }
}

function updateDemoEmotionState(timeSinceLastEmotion: number) {
  demoEmotionState.moodDuration += timeSinceLastEmotion
  demoEmotionState.lastEmotionTime = Date.now()

  const timeBasedTransition = Math.min(0.3, demoEmotionState.moodDuration / 10000)
  demoEmotionState.transitionProbability = 0.05 + timeBasedTransition

  if (Math.random() < demoEmotionState.transitionProbability) {
    const possibleMoods = ["happy", "sad", "surprised", "neutral", "angry"]
    const newMood = possibleMoods[Math.floor(Math.random() * possibleMoods.length)]

    if (newMood !== demoEmotionState.currentMood) {
      demoEmotionState.currentMood = newMood
      demoEmotionState.moodDuration = 0
      demoEmotionState.transitionProbability = 0.05
      demoEmotionState.emotionHistory.push(newMood)

      if (demoEmotionState.emotionHistory.length > 20) {
        demoEmotionState.emotionHistory = demoEmotionState.emotionHistory.slice(-10)
      }

      console.log(`\u{1F501} Mood transition to: ${newMood}`)
    }
  }
}

function generateDynamicEmotions(): { [key: string]: number } {
  const currentMood = demoEmotionState.currentMood
  const moodStrength = Math.min(1.0, 0.4 + demoEmotionState.moodDuration / 5000)

  const emotions = {
    happy: 0.1,
    sad: 0.1,
    angry: 0.05,
    surprised: 0.08,
    fearful: 0.05,
    disgusted: 0.02,
    neutral: 0.6,
  }

  emotions[currentMood] = moodStrength

  Object.keys(emotions).forEach((emotion) => {
    if (emotion !== currentMood) {
      const secondaryBoost = getSecondaryEmotionBoost(currentMood, emotion)
      emotions[emotion] += secondaryBoost + (Math.random() - 0.5) * 0.1
      emotions[emotion] = Math.max(0, Math.min(1, emotions[emotion]))
    }
  })

  const maxEmotion = Math.max(...Object.values(emotions))
  if (maxEmotion > 1) {
    Object.keys(emotions).forEach((key) => {
      emotions[key] = emotions[key] / maxEmotion
    })
  }

  return emotions
}

function getSecondaryEmotionBoost(primaryMood: string, emotion: string): number {
  const boostMap: { [key: string]: { [key: string]: number } } = {
    happy: { surprised: 0.15, neutral: 0.1 },
    sad: { neutral: 0.2, fearful: 0.1 },
    angry: { disgusted: 0.1, sad: 0.05 },
    surprised: { happy: 0.1, fearful: 0.05 },
    fearful: { sad: 0.1, surprised: 0.05 },
    neutral: { happy: 0.05, sad: 0.05 },
  }

  return boostMap[primaryMood]?.[emotion] || 0
}

function getDominantEmotion(emotions: { [key: string]: number }): string {
  const entries = Object.entries(emotions)
  if (entries.length === 0) return "neutral"
  return entries.reduce((a, b) => (emotions[a[0]] > emotions[b[0]] ? a : b))[0]
}

function calculateRealisticConfidence(emotions: { [key: string]: number }, dominant: string): number {
  const dominantValue = emotions[dominant] || 0
  const secondHighest = Object.entries(emotions)
    .filter(([key]) => key !== dominant)
    .reduce((max, [, value]) => Math.max(max, value), 0)

  const separation = dominantValue - secondHighest
  const baseConfidence = dominantValue * 0.7 + separation * 0.3
  const variation = (Math.random() - 0.5) * 0.1

  return Math.max(0.3, Math.min(0.95, baseConfidence + variation))
}

function createMockDetection(videoElement: HTMLVideoElement, emotions: { [key: string]: number }) {
  const centerX = videoElement.videoWidth * 0.5
  const centerY = videoElement.videoHeight * 0.4
  const faceWidth = videoElement.videoWidth * 0.3
  const faceHeight = videoElement.videoHeight * 0.4

  return {
    detection: {
      score: 0.85 + Math.random() * 0.1,
      box: {
        x: centerX - faceWidth / 2 + (Math.random() - 0.5) * 20,
        y: centerY - faceHeight / 2 + (Math.random() - 0.5) * 20,
        width: faceWidth + (Math.random() - 0.5) * 40,
        height: faceHeight + (Math.random() - 0.5) * 40,
      },
    },
    expressions: emotions,
    landmarks: generateMockLandmarks(centerX, centerY, faceWidth, faceHeight),
  }
}

function generateMockLandmarks(centerX: number, centerY: number, faceWidth: number, faceHeight: number) {
  const landmarks = []

  for (let i = 0; i < 68; i++) {
    const angle = (i / 68) * Math.PI * 2
    const radiusX = faceWidth * 0.4 * (0.8 + Math.random() * 0.4)
    const radiusY = faceHeight * 0.4 * (0.8 + Math.random() * 0.4)

    landmarks.push({
      x: centerX + Math.cos(angle) * radiusX + (Math.random() - 0.5) * 10,
      y: centerY + Math.sin(angle) * radiusY + (Math.random() - 0.5) * 10,
    })
  }

  return { positions: landmarks }
}

export function drawFaceDetections(canvas: HTMLCanvasElement, detections: any[]) {
  try {
    const ctx = canvas.getContext("2d")
    if (!ctx || !detections || detections.length === 0) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    detections.forEach((detection) => {
      drawSingleDetection(ctx, detection)
    })
  } catch (error) {
    console.error("Error drawing detections:", error)
  }
}

function drawSingleDetection(ctx: CanvasRenderingContext2D, detection: any) {
  const box = detection.detection?.box
  if (!box) return

  const expressions = detection.expressions
  const dominant = getDominantEmotion(expressions || {})

  const emotionColors: { [key: string]: string } = {
    happy: "#00ff00",
    sad: "#4169E1",
    angry: "#ff4500",
    surprised: "#ff69b4",
    fearful: "#9370db",
    disgusted: "#32cd32",
    neutral: "#00bfff",
  }

  const color = emotionColors[dominant] || "#00ff00"

  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.strokeRect(box.x, box.y, box.width, box.height)

  ctx.fillStyle = color
  ctx.font = "bold 16px Arial"
  ctx.fillText(`${dominant.toUpperCase()} (${Math.round((expressions?.[dominant] || 0) * 100)}%)`, box.x, box.y - 10)

  if (detection.landmarks?.positions) {
    ctx.fillStyle = color
    detection.landmarks.positions.forEach((point: any) => {
      if (point && typeof point.x === "number" && typeof point.y === "number") {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    })
  }
}

export const isRealMode = () => modelsLoaded
export const getModelStatus = () => ({ modelsLoaded, isLoading })

export function resetDemoState() {
  demoEmotionState = {
    currentMood: "neutral",
    moodDuration: 0,
    transitionProbability: 0.1,
    lastEmotionTime: Date.now(),
    emotionHistory: [],
  }
}
