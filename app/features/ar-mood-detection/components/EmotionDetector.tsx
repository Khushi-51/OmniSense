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
  const [detectionCount, setDetectionCount] = useState(0)
  const [fps, setFps] = useState(0)
  const lastFrameTime = useRef(Date.now())

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

    console.log("🚀 Starting REAL-TIME emotion detection...")

    // Higher frequency for real-time detection
    const detectionInterval = isRealMode() ? 200 : 500 // 5 FPS for real, 2 FPS for demo

    intervalRef.current = setInterval(async () => {
      if (isDetecting.current) return

      try {
        isDetecting.current = true

        const videoElement = (window as any).videoRef?.current as HTMLVideoElement
        const canvasElement = (window as any).canvasRef?.current as HTMLCanvasElement

        if (!videoElement || !canvasElement) {
          return
        }

        if (videoElement.readyState !== 4) {
          return
        }

        // Calculate FPS
        const now = Date.now()
        const deltaTime = now - lastFrameTime.current
        setFps(Math.round(1000 / deltaTime))
        lastFrameTime.current = now

        const result = await detectEmotionRealTime(videoElement)

        if (result) {
          // Draw face detection overlay
          drawFaceDetections(canvasElement, result.detections)

          // Send emotion data
          onEmotionDetected(result.emotion)
          setDetectionCount((prev) => prev + 1)

          // Log real-time data
          if (isRealMode()) {
            console.log(
              `🎯 Frame ${detectionCount}: ${result.emotion.dominant} (${Math.round(result.emotion.confidence * 100)}%)`,
            )
          }
        } else {
          // Clear canvas if no face detected
          const ctx = canvasElement.getContext("2d")
          if (ctx) {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
          }
          onNoFaceDetected()
        }
      } catch (error: any) {
        console.error("❌ Real-time detection error:", error)
        onError(`Detection failed: ${error.message}`)
      } finally {
        isDetecting.current = false
      }
    }, detectionInterval)
  }

  const stopDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    isDetecting.current = false
    setDetectionCount(0)
    setFps(0)

    // Clear canvas
    const canvasElement = (window as any).canvasRef?.current as HTMLCanvasElement
    if (canvasElement) {
      const ctx = canvasElement.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
      }
    }

    console.log("⏹️ Stopped real-time detection")
  }

  if (!isActive) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white px-4 py-3 rounded-lg text-sm space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isRealMode() ? "bg-green-400" : "bg-yellow-400"} animate-pulse`} />
        <span>{isRealMode() ? "REAL-TIME DETECTION" : "DEMO MODE"}</span>
      </div>
      <div className="text-xs text-gray-300">
        <div>Frames: {detectionCount}</div>
        <div>FPS: {fps}</div>
        <div>Mode: {isRealMode() ? "face-api.js" : "Simulated"}</div>
      </div>
    </div>
  )
}
