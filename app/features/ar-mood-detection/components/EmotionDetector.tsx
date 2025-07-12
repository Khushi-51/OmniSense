"use client"

import { useEffect, useRef, useState } from "react"
import type { EmotionData } from "../types/emotion.types"
import { detectEmotionRealTime, drawFaceDetections, isRealMode } from "../libs/face-detection"

interface EmotionDetectorProps {
  isActive: boolean
  onEmotionDetected: (emotion: EmotionData) => void
  onNoFaceDetected: () => void
  onError: (error: string) => void
}

export default function EmotionDetector({
  isActive,
  onEmotionDetected,
  onNoFaceDetected,
  onError,
}: EmotionDetectorProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isDetecting = useRef(false)
  const [detectionStats, setDetectionStats] = useState({
    totalDetections: 0,
    successfulDetections: 0,
    fps: 0,
    lastDetectionTime: 0,
  })

  const lastFrameTime = useRef(Date.now())
  const consecutiveErrors = useRef(0)
  const maxConsecutiveErrors = 3

  useEffect(() => {
    if (isActive) {
      startDetection()
    } else {
      stopDetection()
    }

    return () => {
      stopDetection()
    }
  }, [isActive])

  const startDetection = () => {
    if (intervalRef.current) return

    console.log("🚀 Starting emotion detection...")
    consecutiveErrors.current = 0

    // Detection frequency: 3-5 FPS for good performance
    const detectionInterval = isRealMode() ? 200 : 300 // Real: 5 FPS, Demo: 3.3 FPS

    intervalRef.current = setInterval(async () => {
      if (isDetecting.current) return

      try {
        isDetecting.current = true

        const videoElement = (window as any).videoRef?.current as HTMLVideoElement
        const canvasElement = (window as any).canvasRef?.current as HTMLCanvasElement

        if (!videoElement || !canvasElement) {
          console.warn("Video or canvas element not available")
          return
        }

        // Ensure video is ready
        if (videoElement.readyState < 3 || videoElement.paused || videoElement.ended) {
          console.warn("Video not ready for detection")
          return
        }

        // Calculate FPS
        const now = Date.now()
        const deltaTime = now - lastFrameTime.current
        if (deltaTime > 0) {
          const currentFps = Math.round(1000 / deltaTime)
          setDetectionStats((prev) => ({ ...prev, fps: currentFps }))
        }
        lastFrameTime.current = now

        // Perform detection
        const result = await detectEmotionRealTime(videoElement)

        // Update stats
        setDetectionStats((prev) => ({
          ...prev,
          totalDetections: prev.totalDetections + 1,
          lastDetectionTime: now,
        }))

        if (result && result.emotion) {
          // 🎯 SUCCESSFUL DETECTION
          try {
            // Draw face detection overlay
            drawFaceDetections(canvasElement, result.detections)
          } catch (drawError) {
            console.warn("Drawing error (non-critical):", drawError)
          }

          // Send emotion data to parent
          onEmotionDetected(result.emotion)

          // Update success stats
          setDetectionStats((prev) => ({
            ...prev,
            successfulDetections: prev.successfulDetections + 1,
          }))

          consecutiveErrors.current = 0

          // Log detection info
          console.log(
            `🎯 Detection #${detectionStats.totalDetections + 1}: ${result.emotion.dominant} (${Math.round(
              result.emotion.confidence * 100,
            )}%)`,
          )
        } else {
          // No face detected - clear canvas
          try {
            const ctx = canvasElement.getContext("2d")
            if (ctx) {
              ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
            }
          } catch (clearError) {
            console.warn("Canvas clear error (non-critical):", clearError)
          }

          onNoFaceDetected()
          console.log("👤 No face detected in frame")
        }
      } catch (error: any) {
        consecutiveErrors.current++
        console.error(`❌ Detection error #${consecutiveErrors.current}:`, error)

        // Only report error after multiple consecutive failures
        if (consecutiveErrors.current >= maxConsecutiveErrors) {
          onError(`Detection failed: ${error.message}`)
          console.error("🚨 Too many consecutive errors, stopping detection")
          stopDetection()
        }
      } finally {
        isDetecting.current = false
      }
    }, detectionInterval)

    console.log(`✅ Detection started with ${detectionInterval}ms interval`)
  }

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    isDetecting.current = false
    consecutiveErrors.current = 0

    // Clear canvas
    try {
      const canvasElement = (window as any).canvasRef?.current as HTMLCanvasElement
      if (canvasElement) {
        const ctx = canvasElement.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
        }
      }
    } catch (error) {
      console.warn("Canvas cleanup error (non-critical):", error)
    }

    // Reset stats
    setDetectionStats({
      totalDetections: 0,
      successfulDetections: 0,
      fps: 0,
      lastDetectionTime: 0,
    })

    console.log("⏹️ Emotion detection stopped")
  }

  if (!isActive) return null

  const successRate =
    detectionStats.totalDetections > 0 ? Math.round((detectionStats.successfulDetections / detectionStats.totalDetections) * 100) : 0

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-3 rounded-lg text-sm space-y-1 z-50 min-w-[200px]">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isRealMode() ? "bg-green-400" : "bg-blue-400"} animate-pulse`} />
        <span className="font-semibold">{isRealMode() ? "REAL-TIME AI" : "DEMO MODE"}</span>
      </div>

      <div className="text-xs text-gray-300 space-y-1">
        <div className="flex justify-between">
          <span>Detections:</span>
          <span className="text-green-400">
            {detectionStats.successfulDetections}/{detectionStats.totalDetections}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Success Rate:</span>
          <span className={successRate > 80 ? "text-green-400" : successRate > 50 ? "text-yellow-400" : "text-red-400"}>
            {successRate}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>FPS:</span>
          <span className="text-blue-400">{detectionStats.fps}</span>
        </div>

        {consecutiveErrors.current > 0 && (
          <div className="flex justify-between text-yellow-400">
            <span>Errors:</span>
            <span>
              {consecutiveErrors.current}/{maxConsecutiveErrors}
            </span>
          </div>
        )}

        <div className="text-xs text-gray-400 mt-2">Mode: {isRealMode() ? "face-api.js" : "Smart Demo"}</div>
      </div>
    </div>
  )
}
