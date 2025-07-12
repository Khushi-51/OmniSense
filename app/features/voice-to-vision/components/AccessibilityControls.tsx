"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Volume2, VolumeX, Type, Zap } from "lucide-react"

interface AccessibilityControlsProps {
  audioEnabled: boolean
  onAudioToggle: () => void
  fontSize: "small" | "medium" | "large"
  onFontSizeChange: (size: "small" | "medium" | "large") => void
  highContrast: boolean
  onHighContrastToggle: () => void
  reducedMotion: boolean
  onReducedMotionToggle: () => void
}

export function AccessibilityControls({
  audioEnabled,
  onAudioToggle,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastToggle,
  reducedMotion,
  onReducedMotionToggle,
}: AccessibilityControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="relative">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg"
          title="Accessibility Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>

        {isExpanded && (
          <Card className="absolute bottom-16 left-0 w-80 shadow-xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Accessibility Settings</h3>
                <Badge variant="secondary">A11y</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm">Audio Feedback</span>
                  </div>
                  <Button variant={audioEnabled ? "default" : "outline"} size="sm" onClick={onAudioToggle}>
                    {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <span className="text-sm">Font Size</span>
                  </div>
                  <select
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(e.target.value as "small" | "medium" | "large")}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">High Contrast</span>
                  </div>
                  <Button variant={highContrast ? "default" : "outline"} size="sm" onClick={onHighContrastToggle}>
                    {highContrast ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Reduced Motion</span>
                  <Button variant={reducedMotion ? "default" : "outline"} size="sm" onClick={onReducedMotionToggle}>
                    {reducedMotion ? "On" : "Off"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
