import React, { useState } from 'react';
import { Volume2, VolumeX, Type, Zap, Settings } from 'lucide-react';

interface AccessibilityControlsProps {
  audioEnabled: boolean;
  onAudioToggle: () => void;
  fontSize: 'small' | 'medium' | 'large';
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  highContrast: boolean;
  onHighContrastToggle: () => void;
  reducedMotion: boolean;
  onReducedMotionToggle: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  audioEnabled,
  onAudioToggle,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastToggle,
  reducedMotion,
  onReducedMotionToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Accessibility Settings"
        >
          <Settings size={24} />
        </button>

        {isExpanded && (
          <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl border p-4 min-w-[280px] space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Accessibility Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <Volume2 size={16} />
                  <span>Audio Feedback</span>
                </label>
                <button
                  onClick={onAudioToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    audioEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      audioEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <Type size={16} />
                  <span>Font Size</span>
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(e.target.value as 'small' | 'medium' | 'large')}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <Zap size={16} />
                  <span>High Contrast</span>
                </label>
                <button
                  onClick={onHighContrastToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    highContrast ? 'bg-yellow-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <span>Reduced Motion</span>
                </label>
                <button
                  onClick={onReducedMotionToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reducedMotion ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};