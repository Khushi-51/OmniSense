"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Camera, CameraOff, Zap } from "lucide-react"

interface CameraCaptureProps {
  isActive: boolean
  onError: (error: string) => void
  modelsLoaded: boolean
}

export default function CameraCapture({ isActive, onError, modelsLoaded }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 640, height: 480 })

  // Export refs to window for EmotionDetector to access
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).videoRef = videoRef
      ;(window as any).canvasRef = canvasRef
    }
  }, [])

  useEffect(() => {
    if (isActive && modelsLoaded) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isActive, modelsLoaded])

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser")
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: "user",
          frameRate: { ideal: 30, min: 15 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            const { videoWidth, videoHeight } = videoRef.current
            setDimensions({ width: videoWidth, height: videoHeight })

            // Set canvas dimensions to match video
            if (canvasRef.current) {
              canvasRef.current.width = videoWidth
              canvasRef.current.height = videoHeight
            }
          }
        }

        await videoRef.current.play()
      }

      setStream(mediaStream)
      setIsLoading(false)
    } catch (error: any) {
      console.error("Camera access error:", error)
      setIsLoading(false)

      if (error.name === "NotAllowedError") {
        onError("Camera permission denied. Please allow camera access and refresh the page.")
      } else if (error.name === "NotFoundError") {
        onError("No camera found. Please connect a camera and try again.")
      } else if (error.name === "NotReadableError") {
        onError("Camera is already in use by another application.")
      } else {
        onError(`Camera error: ${error.message || "Unable to access camera"}`)
      }
    }
  }, [onError])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }, [stream])

  return (
    <div className="relative">
      <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
            <div className="text-white text-center">
              <Camera className="w-12 h-12 mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium">Initializing Camera</p>
              <p className="text-sm text-slate-300 mt-2">Please allow camera access when prompted</p>
            </div>
          </div>
        )}

        {!isActive && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="text-slate-400 text-center">
              <CameraOff className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-medium">Camera Inactive</p>
              <p className="text-sm mt-2">Click "Start Analysis" to begin</p>
            </div>
          </div>
        )}

        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

        {/* Face detection overlay canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            mixBlendMode: "normal",
            opacity: 0.9,
          }}
        />

        {/* Status indicators */}
        {isActive && stream && (
          <div className="absolute top-4 left-4 space-y-2">
            <div className="flex items-center gap-2 bg-black bg-opacity-60 text-white text-sm px-3 py-2 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live Analysis</span>
            </div>
            {modelsLoaded && (
              <div className="flex items-center gap-2 bg-black bg-opacity-60 text-white text-sm px-3 py-2 rounded-lg backdrop-blur-sm">
                <Zap className="w-3 h-3 text-blue-400" />
                <span>AI Models Active</span>
              </div>
            )}
          </div>
        )}

        {/* Camera info */}
        {stream && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
            {dimensions.width} × {dimensions.height}
          </div>
        )}
      </div>

      {/* Technical specs */}
      {stream && (
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Resolution</p>
            <p className="text-sm font-medium text-slate-800">
              {dimensions.width}×{dimensions.height}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Frame Rate</p>
            <p className="text-sm font-medium text-slate-800">30 FPS</p>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
            <p className="text-sm font-medium text-green-600">Active</p>
          </div>
        </div>
      )}
    </div>
  )
}
