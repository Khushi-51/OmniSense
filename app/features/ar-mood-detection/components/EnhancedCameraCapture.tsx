"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Maximize2, Minimize2, Camera, Settings, Zap } from "lucide-react"

interface EnhancedCameraCaptureProps {
  isActive: boolean
  onError: (error: string) => void
  modelsLoaded: boolean
  onCameraReady?: (ready: boolean) => void
}

export default function EnhancedCameraCapture({
  isActive,
  onError,
  modelsLoaded,
  onCameraReady,
}: EnhancedCameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1280, height: 720 })
  const [videoReady, setVideoReady] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [fps, setFps] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [quality, setQuality] = useState<"HD" | "4K" | "Auto">("HD")
  const [detectionActive, setDetectionActive] = useState(false)
  const frameCount = useRef(0)
  const lastFpsTime = useRef(Date.now())
  const maxRetries = 3

  // Export refs globally for detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).videoRef = videoRef
      ;(window as any).canvasRef = canvasRef
    }
  }, [])

  // FPS counter
  useEffect(() => {
    if (!videoReady) return

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - lastFpsTime.current
      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed))
        frameCount.current = 0
        lastFpsTime.current = now
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [videoReady])

  useEffect(() => {
    if (isActive && modelsLoaded) {
      startEnhancedCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isActive, modelsLoaded])

  const getQualityConstraints = (qualityLevel: string) => {
    switch (qualityLevel) {
      case "4K":
        return {
          width: { ideal: 3840, min: 1920 },
          height: { ideal: 2160, min: 1080 },
          frameRate: { ideal: 30, min: 24 },
        }
      case "HD":
        return {
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          frameRate: { ideal: 30, min: 15 },
        }
      default: // Auto
        return {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 },
        }
    }
  }

  const startEnhancedCamera = useCallback(async () => {
    if (isLoading) return

    try {
      setIsLoading(true)
      setVideoReady(false)

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access not supported")
      }

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }

      // Enhanced camera constraints for better quality
      const qualityConstraints = getQualityConstraints(quality)
      const constraints = {
        video: {
          ...qualityConstraints,
          facingMode: "user",
          aspectRatio: { ideal: 16 / 9 },
          resizeMode: "crop-and-scale" as any,
          // Advanced settings for better face detection
          whiteBalanceMode: "auto" as any,
          exposureMode: "auto" as any,
          focusMode: "auto" as any,
        },
        audio: false,
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        const video = videoRef.current

        // Clear previous source
        video.srcObject = null
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Set up enhanced event handlers
        const handleLoadedMetadata = () => {
          const { videoWidth, videoHeight } = video
          setDimensions({ width: videoWidth, height: videoHeight })

          // Configure canvas for optimal detection
          if (canvasRef.current) {
            canvasRef.current.width = videoWidth
            canvasRef.current.height = videoHeight

            // Set canvas style for responsive display
            const aspectRatio = videoWidth / videoHeight
            canvasRef.current.style.aspectRatio = aspectRatio.toString()
          }
        }

        const handleCanPlay = async () => {
          try {
            if (video.readyState >= 3 && isActive && video.srcObject === mediaStream) {
              await video.play()
              setVideoReady(true)
              setRetryCount(0)
              setDetectionActive(true)
              onCameraReady?.(true)

              // Start FPS counting
              frameCount.current = 0
              lastFpsTime.current = Date.now()
            }
          } catch (playError: any) {
            console.error("Enhanced video play error:", playError)
            if (retryCount < maxRetries) {
              setRetryCount((prev) => prev + 1)
              setTimeout(() => startEnhancedCamera(), 1000)
            } else {
              onError(`Failed to start camera: ${playError.message}`)
            }
          }
        }

        const handleError = (error: Event) => {
          console.error("Enhanced video error:", error)
          onError("Video playback error")
        }

        // Add event listeners
        video.addEventListener("loadedmetadata", handleLoadedMetadata)
        video.addEventListener("canplay", handleCanPlay)
        video.addEventListener("error", handleError)

        // Store cleanup
        ;(video as any)._enhancedCleanup = () => {
          video.removeEventListener("loadedmetadata", handleLoadedMetadata)
          video.removeEventListener("canplay", handleCanPlay)
          video.removeEventListener("error", handleError)
        }

        // Set source and load
        video.srcObject = mediaStream
        video.load()
      }

      setStream(mediaStream)
      setIsLoading(false)
    } catch (error: any) {
      console.error("Enhanced camera error:", error)
      setIsLoading(false)
      setVideoReady(false)
      setDetectionActive(false)
      onCameraReady?.(false)

      // Enhanced error messages
      if (error.name === "NotAllowedError") {
        onError("Camera permission denied. Please allow camera access and refresh.")
      } else if (error.name === "NotFoundError") {
        onError("No camera found. Please connect a camera.")
      } else if (error.name === "NotReadableError") {
        onError("Camera is busy. Please close other applications using the camera.")
      } else if (error.name === "OverconstrainedError") {
        onError("Camera doesn't support required settings. Trying fallback...")
        // Try with basic constraints
        setTimeout(() => startBasicCamera(), 1000)
      } else {
        onError(`Camera error: ${error.message}`)
      }
    }
  }, [isActive, onError, stream, retryCount, onCameraReady, quality])

  const startBasicCamera = async () => {
    try {
      const basicStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = basicStream
        await videoRef.current.play()
        setStream(basicStream)
        setVideoReady(true)
        setDetectionActive(true)
        onCameraReady?.(true)
      }
    } catch (error: any) {
      onError(`Fallback camera failed: ${error.message}`)
    }
  }

  const stopCamera = useCallback(() => {
    setIsLoading(false)
    setVideoReady(false)
    setFps(0)
    setDetectionActive(false)
    onCameraReady?.(false)

    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }

    if (videoRef.current) {
      const video = videoRef.current

      // Enhanced cleanup
      if ((video as any)._enhancedCleanup) {
        ;(video as any)._enhancedCleanup()
        ;(video as any)._enhancedCleanup = null
      }

      video.pause()
      video.srcObject = null
      video.load()
    }

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }, [stream, onCameraReady])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const cycleQuality = () => {
    const qualities: Array<"HD" | "4K" | "Auto"> = ["Auto", "HD", "4K"]
    const currentIndex = qualities.indexOf(quality)
    const nextQuality = qualities[(currentIndex + 1) % qualities.length]
    setQuality(nextQuality)

    // Restart camera with new quality if active
    if (isActive && videoReady) {
      setTimeout(() => startEnhancedCamera(), 100)
    }
  }

  // Update frame count for FPS calculation
  useEffect(() => {
    if (!videoReady) return

    const updateFrame = () => {
      frameCount.current++
      if (videoReady) {
        requestAnimationFrame(updateFrame)
      }
    }

    requestAnimationFrame(updateFrame)
  }, [videoReady])

  const getQualityColor = () => {
    switch (quality) {
      case "4K":
        return "bg-purple-500"
      case "HD":
        return "bg-blue-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <div className="relative">
      <div
        className={`relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
          isFullscreen ? "fixed inset-4 z-50 rounded-2xl" : ""
        }`}
        style={{ aspectRatio: isFullscreen ? "auto" : "16/9" }}
      >
        {/* Enhanced Status Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant={videoReady ? "default" : "secondary"}
              className={`${videoReady ? "bg-green-500 hover:bg-green-600" : "bg-gray-500"} text-white`}
            >
              <Camera className="w-3 h-3 mr-1" />
              {videoReady ? "Live" : isLoading ? "Connecting..." : "Offline"}
            </Badge>

            {videoReady && (
              <>
                <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                  {fps} FPS
                </Badge>
                <Badge variant="outline" className={`${getQualityColor()} text-white border-white/20`}>
                  {quality}
                </Badge>
                {detectionActive && (
                  <Badge variant="outline" className="bg-purple-500 text-white border-white/20 animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    AI Active
                  </Badge>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleQuality}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              title={`Current: ${quality} - Click to change`}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            style={{
              transform: "scaleX(-1)",
              filter: videoReady ? "none" : "blur(4px)",
              transition: "filter 0.3s ease",
            }}
          />

          {/* Detection Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              transform: "scaleX(-1)",
              opacity: detectionActive ? 0.8 : 0,
              transition: "opacity 0.3s ease",
            }}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg font-medium">Initializing Enhanced Camera...</p>
                <p className="text-sm opacity-75">Quality: {quality}</p>
                {retryCount > 0 && (
                  <p className="text-xs mt-2 text-yellow-300">
                    Retry attempt {retryCount}/{maxRetries}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* No Video Placeholder */}
          {!isLoading && !videoReady && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Camera Ready</p>
                <p className="text-sm opacity-75">
                  {modelsLoaded ? "Start analysis to begin" : "Loading AI models..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Info Panel */}
        {videoReady && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-gray-300">Resolution</div>
                  <div className="font-mono">
                    {dimensions.width}×{dimensions.height}
                  </div>
                </div>
                <div>
                  <div className="text-gray-300">Frame Rate</div>
                  <div className="font-mono">{fps} FPS</div>
                </div>
                <div>
                  <div className="text-gray-300">Quality</div>
                  <div className="font-mono">{quality}</div>
                </div>
                <div>
                  <div className="text-gray-300">Detection</div>
                  <div className={`font-mono ${detectionActive ? "text-green-400" : "text-gray-400"}`}>
                    {detectionActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Exit Hint */}
        {isFullscreen && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div className="bg-black/75 text-white px-4 py-2 rounded-lg text-sm opacity-75">
              Press ESC or click minimize to exit fullscreen
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen ESC handler */}
      {isFullscreen && <div className="fixed inset-0 z-40 bg-black/50" onClick={toggleFullscreen} />}
    </div>
  )
}
