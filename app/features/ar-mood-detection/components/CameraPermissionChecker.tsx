"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Camera, CheckCircle, XCircle } from "lucide-react"

interface CameraPermissionCheckerProps {
  onPermissionGranted: () => void
  onPermissionDenied: (error: string) => void
}

export default function CameraPermissionChecker({
  onPermissionGranted,
  onPermissionDenied,
}: CameraPermissionCheckerProps) {
  const [permissionState, setPermissionState] = useState<"checking" | "granted" | "denied" | "prompt">("checking")
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    checkCameraSupport()
  }, [])

  const checkCameraSupport = async () => {
    // Check if camera API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false)
      onPermissionDenied(
        "Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.",
      )
      return
    }

    // Check permission status if supported
    try {
      const permission = await navigator.permissions.query({ name: "camera" as PermissionName })

      if (permission.state === "granted") {
        setPermissionState("granted")
        onPermissionGranted()
      } else if (permission.state === "denied") {
        setPermissionState("denied")
      } else {
        setPermissionState("prompt")
      }
    } catch (error) {
      // Permissions API not supported, we'll need to request directly
      setPermissionState("prompt")
    }
  }

  const requestPermission = async () => {
    try {
      setPermissionState("checking")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })

      // Stop the stream immediately, we just needed to check permission
      stream.getTracks().forEach((track) => track.stop())

      setPermissionState("granted")
      onPermissionGranted()
    } catch (error: any) {
      setPermissionState("denied")

      if (error.name === "NotAllowedError") {
        onPermissionDenied("Camera permission was denied. Please allow camera access and try again.")
      } else if (error.name === "NotFoundError") {
        onPermissionDenied("No camera found. Please connect a camera and try again.")
      } else {
        onPermissionDenied(`Camera error: ${error.message}`)
      }
    }
  }

  if (!isSupported) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.
        </AlertDescription>
      </Alert>
    )
  }

  if (permissionState === "checking") {
    return (
      <Alert>
        <Camera className="h-4 w-4 animate-pulse" />
        <AlertDescription>Checking camera permissions...</AlertDescription>
      </Alert>
    )
  }

  if (permissionState === "granted") {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Camera access granted! You can now start emotion detection.
        </AlertDescription>
      </Alert>
    )
  }

  if (permissionState === "denied") {
    return (
      <Alert className="border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="space-y-3">
            <p>Camera permission is required for emotion detection.</p>
            <div className="text-sm">
              <p className="font-medium">To enable camera access:</p>
              <ol className="list-decimal list-inside space-y-1 mt-1">
                <li>Look for a camera icon in your browser's address bar</li>
                <li>Click it and select "Allow"</li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <Button onClick={requestPermission} size="sm" className="mt-2">
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Camera className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="space-y-3">
          <p>Camera access is needed to detect your emotions and provide personalized recommendations.</p>
          <Button onClick={requestPermission} className="bg-blue-600 hover:bg-blue-700">
            <Camera className="w-4 h-4 mr-2" />
            Grant Camera Permission
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
