import type { EmotionData } from "../types/emotion.types"

// Set to true for real face detection
const USE_REAL_FACE_API = true

let faceapi: any = null
let modelsLoaded = false

// Real face-api.js implementation
export async function loadFaceApiModels(): Promise<void> {
  try {
    if (USE_REAL_FACE_API) {
      console.log("Loading real face-api.js models...")

      // Dynamic import to avoid SSR issues
      faceapi = await import("face-api.js")

      const MODEL_URL = "/models"

      // Load all required models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ])

      modelsLoaded = true
      console.log("✅ Real face-api.js models loaded successfully!")
    } else {
      // Demo mode fallback
      console.log("Loading demo models...")
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Demo models loaded")
    }
  } catch (error) {
    console.error("❌ Failed to load face-api models:", error)
    throw new Error(`Could not load AI models: ${error}`)
  }
}

export async function detectEmotionRealTime(videoElement: HTMLVideoElement): Promise<{
  emotion: EmotionData
  detections: any[]
} | null> {
  try {
    if (!videoElement || videoElement.readyState !== 4) {
      return null
    }

    if (USE_REAL_FACE_API && faceapi && modelsLoaded) {
      // 🔥 REAL FACE DETECTION WITH face-api.js
      const detections = await faceapi
        .detectAllFaces(
          videoElement,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.5,
          }),
        )
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()

      if (detections.length > 0) {
        const detection = detections[0]
        const expressions = detection.expressions
        const { age, gender, genderProbability } = detection

        // Get sorted emotions
        const emotionArray = expressions.asSortedArray()
        const dominant = emotionArray[0].expression
        const confidence = emotionArray[0].probability

        // Convert expressions to our format
        const emotions = {
          happy: expressions.happy,
          sad: expressions.sad,
          angry: expressions.angry,
          surprised: expressions.surprised,
          fearful: expressions.fearful,
          disgusted: expressions.disgusted,
          neutral: expressions.neutral,
        }

        console.log(`🎯 REAL DETECTION: ${dominant} (${Math.round(confidence * 100)}%)`)
        console.log(`👤 Age: ${Math.round(age)}, Gender: ${gender} (${Math.round(genderProbability * 100)}%)`)

        return {
          emotion: {
            emotions,
            dominant,
            confidence,
            timestamp: Date.now(),
            // Additional real data
            age: Math.round(age),
            gender,
            genderProbability,
          },
          detections,
        }
      } else {
        console.log("👤 No face detected")
        return null
      }
    } else {
      // Fallback demo mode
      return generateDemoDetection(videoElement)
    }
  } catch (error) {
    console.error("❌ Real-time detection error:", error)
    return generateDemoDetection(videoElement)
  }
}

function generateDemoDetection(videoElement: HTMLVideoElement) {
  const emotions = generateAdvancedEmotions()
  const dominant = getDominantEmotion(emotions)
  const confidence = emotions[dominant]

  const mockDetection = {
    detection: {
      box: {
        x: videoElement.videoWidth * 0.25,
        y: videoElement.videoHeight * 0.2,
        width: videoElement.videoWidth * 0.5,
        height: videoElement.videoHeight * 0.6,
      },
    },
    landmarks: generateMockLandmarks(videoElement),
  }

  return {
    emotion: {
      emotions,
      dominant,
      confidence,
      timestamp: Date.now(),
    },
    detections: [mockDetection],
  }
}

export function drawFaceDetections(canvas: HTMLCanvasElement, detections: any[]) {
  const ctx = canvas.getContext("2d")
  if (!ctx || !detections.length) return

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  detections.forEach((detection, index) => {
    if (USE_REAL_FACE_API && faceapi && modelsLoaded) {
      // 🎨 REAL FACE DETECTION DRAWING
      const box = detection.detection.box
      const landmarks = detection.landmarks
      const expressions = detection.expressions
      const { age, gender } = detection

      // Draw face bounding box with confidence-based color
      const confidence = Math.max(...Object.values(expressions))
      const boxColor = confidence > 0.7 ? "#00ff00" : confidence > 0.5 ? "#ffff00" : "#ff6600"

      ctx.strokeStyle = boxColor
      ctx.lineWidth = 3
      ctx.shadowColor = boxColor
      ctx.shadowBlur = 15
      ctx.strokeRect(box.x, box.y, box.width, box.height)
      ctx.shadowBlur = 0

      // Draw facial landmarks (68 points)
      if (landmarks) {
        ctx.fillStyle = boxColor
        const points = landmarks.positions || landmarks._positions
        if (points) {
          points.forEach((point: any) => {
            ctx.beginPath()
            ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI)
            ctx.fill()
          })
        }
      }

      // Draw emotion and demographic info
      const topEmotion = Object.entries(expressions).reduce((a, b) => (expressions[a[0]] > expressions[b[0]] ? a : b))

      // Background for text
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.fillRect(box.x, box.y - 80, 200, 75)

      // Text info
      ctx.fillStyle = boxColor
      ctx.font = "14px Arial"
      ctx.fillText(`${topEmotion[0]}: ${Math.round(topEmotion[1] * 100)}%`, box.x + 5, box.y - 55)
      ctx.fillText(`Age: ${Math.round(age)} | ${gender}`, box.x + 5, box.y - 35)
      ctx.fillText(`REAL DETECTION`, box.x + 5, box.y - 15)
    } else {
      // Demo mode drawing
      const box = detection.detection.box

      ctx.strokeStyle = "#00ff00"
      ctx.lineWidth = 3
      ctx.shadowColor = "#00ff00"
      ctx.shadowBlur = 10
      ctx.strokeRect(box.x, box.y, box.width, box.height)
      ctx.shadowBlur = 0

      if (detection.landmarks) {
        ctx.fillStyle = "#00ff00"
        detection.landmarks.forEach((point: { x: number; y: number }) => {
          ctx.beginPath()
          ctx.arc(point.x, point.y, 1.5, 0, 2 * Math.PI)
          ctx.fill()
        })
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(box.x, box.y - 30, 120, 25)
      ctx.fillStyle = "#00ff00"
      ctx.font = "14px Arial"
      ctx.fillText("DEMO MODE", box.x + 5, box.y - 10)
    }
  })
}

function generateAdvancedEmotions() {
  const timeOfDay = new Date().getHours()
  const isWorkingHours = timeOfDay >= 9 && timeOfDay <= 17

  const baseEmotions = {
    happy: Math.random() * 0.4 + (isWorkingHours ? 0.1 : 0.2),
    sad: Math.random() * 0.15,
    angry: Math.random() * 0.1,
    surprised: Math.random() * 0.2,
    fearful: Math.random() * 0.1,
    disgusted: Math.random() * 0.05,
    neutral: Math.random() * 0.3 + (isWorkingHours ? 0.2 : 0.1),
  }

  const total = Object.values(baseEmotions).reduce((sum, val) => sum + val, 0)
  const normalizedEmotions: { [key: string]: number } = {}

  for (const [emotion, value] of Object.entries(baseEmotions)) {
    normalizedEmotions[emotion] = value / total
  }

  return normalizedEmotions
}

function getDominantEmotion(emotions: { [key: string]: number }): string {
  return Object.entries(emotions).reduce((a, b) => (emotions[a[0]] > emotions[b[0]] ? a : b))[0]
}

function generateMockLandmarks(videoElement: HTMLVideoElement) {
  const landmarks = []
  const centerX = videoElement.videoWidth * 0.5
  const centerY = videoElement.videoHeight * 0.45

  for (let i = 0; i < 68; i++) {
    const angle = (i / 68) * 2 * Math.PI
    const radius = Math.min(videoElement.videoWidth, videoElement.videoHeight) * 0.15
    landmarks.push({
      x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
      y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 20,
    })
  }

  return landmarks
}

// Export the current mode for components to use
export const isRealMode = () => USE_REAL_FACE_API && modelsLoaded
