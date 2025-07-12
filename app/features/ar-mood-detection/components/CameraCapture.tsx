"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Camera, CameraOff, Zap, AlertTriangle } from "lucide-react"

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
  const [videoReady, setVideoReady] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

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
    if (isLoading) return // Prevent multiple simultaneous attempts

    try {
      setIsLoading(true)
      setVideoReady(false)

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser")
      }

      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
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
        // Clear any existing source
        videoRef.current.srcObject = null

        // Wait a bit to ensure the previous source is cleared
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Set new source
        videoRef.current.srcObject = mediaStream

        // Set up event handlers before attempting to play
        const video = videoRef.current

        const handleLoadedMetadata = () => {
          if (video) {
            const { videoWidth, videoHeight } = video
            setDimensions({ width: videoWidth, height: videoHeight })

            // Set canvas dimensions to match video
            if (canvasRef.current) {
              canvasRef.current.width = videoWidth
              canvasRef.current.height = videoHeight
            }
          }
        }

        const handleCanPlay = async () => {
          try {
            if (video && video.readyState >= 3) {
              // Only play if we're still active and the video is ready
              if (isActive && video.srcObject === mediaStream) {
                await video.play()
                setVideoReady(true)
                setRetryCount(0) // Reset retry count on success
              }
            }
          } catch (playError: any) {
            console.error("Video play error:", playError)
            if (playError.name !== "AbortError") {
              // Only retry if it's not an abort error (which happens during cleanup)
              if (retryCount < maxRetries) {
                setRetryCount((prev) => prev + 1)
                setTimeout(() => startCamera(), 1000) // Retry after 1 second
              } else {
                onError(`Failed to start video after ${maxRetries} attempts: ${playError.message}`)
              }
            }
          }
        }

        const handleError = (error: Event) => {
          console.error("Video element error:", error)
          onError("Video playback error occurred")
        }

        // Add event listeners
        video.addEventListener("loadedmetadata", handleLoadedMetadata)
        video.addEventListener("canplay", handleCanPlay)
        video.addEventListener("error", handleError)

        // Cleanup function for event listeners
        const cleanup = () => {
          video.removeEventListener("loadedmetadata", handleLoadedMetadata)
          video.removeEventListener("canplay", handleCanPlay)
          video.removeEventListener("error", handleError)
        }

        // Store cleanup function for later use
        ;(video as any)._cleanup = cleanup

        // Load the video
        video.load()
      }

      setStream(mediaStream)
      setIsLoading(false)
    } catch (error: any) {
      console.error("Camera access error:", error)
      setIsLoading(false)
      setVideoReady(false)

      if (error.name === "NotAllowedError") {
        onError("Camera permission denied. Please allow camera access and refresh the page.")
      } else if (error.name === "NotFoundError") {
        onError("No camera found. Please connect a camera and try again.")
      } else if (error.name === "NotReadableError") {
        onError("Camera is already in use by another application.")
      } else if (error.name === "OverconstrainedError") {
        onError("Camera constraints could not be satisfied. Please try with a different camera.")
      } else {
        onError(`Camera error: ${error.message || "Unable to access camera"}`)
      }
    }
  }, [isActive, onError, stream, retryCount])

  const stopCamera = useCallback(() => {
    setIsLoading(false)
    setVideoReady(false)

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
      })
      setStream(null)
    }

    if (videoRef.current) {
      const video = videoRef.current

      // Clean up event listeners
      if ((video as any)._cleanup) {
        ;(video as any)._cleanup()
        ;(video as any)._cleanup = null
      }

      // Pause and clear source
      video.pause()
      video.srcObject = null
      video.load() // This helps clear the video element completely
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
              <p className="text-lg font-medium">
                {retryCount > 0 ? `Retrying... (${retryCount}/${maxRetries})` : "Initializing Camera"}
              </p>
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

        {retryCount >= maxRetries && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
            <div className="text-red-400 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-medium">Camera Error</p>
              <p className="text-sm mt-2">Failed to start camera after multiple attempts</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          style={{ display: videoReady ? "block" : "none" }}
        />

        {/* Face detection overlay canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            mixBlendMode: "normal",
            opacity: 0.9,
            display: videoReady ? "block" : "none",
          }}
        />

        {/* Status indicators */}
        {isActive && stream && videoReady && (
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
        {stream && videoReady && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
            {dimensions.width} × {dimensions.height}
          </div>
        )}
      </div>

      {/* Technical specs */}
      {stream && videoReady && (
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
            <p className="text-sm font-medium text-green-600">{videoReady ? "Active" : "Loading"}</p>
          </div>
        </div>
      )}
    </div>
  )
}
