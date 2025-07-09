import React, { useEffect, useState } from 'react';
import { Camera, CameraOff, Focus, Zap, Brain, AlertCircle } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { Product, AROverlay } from '../types';

interface CameraViewProps {
  products: Product[];
  onProductDetected: (product: Product) => void;
  onProductsFound: (products: Product[], detectedClass: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ 
  products, 
  onProductDetected, 
  onProductsFound 
}) => {
  const { 
    isActive, 
    hasPermission, 
    error, 
    isModelLoading,
    isModelReady,
    detectedObjects,
    isDetecting,
    isDemoMode,
    videoRef, 
    startCamera, 
    stopCamera,
    startDemoMode,
    findProductMatches
  } = useCamera();
  
  const [overlays, setOverlays] = useState<AROverlay[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState(0);

  // Process detected objects and find matching products
  useEffect(() => {
    if (!isActive || !isModelReady || detectedObjects.length === 0) {
      setOverlays([]);
      return;
    }

    const now = Date.now();
    // Throttle detection processing to avoid overwhelming the UI
    if (now - lastDetectionTime < 3000) return;

    setLastDetectionTime(now);

    const processDetectedObjects = async () => {
      const productMatches = await findProductMatches(detectedObjects, products);
      const newOverlays: AROverlay[] = [];

      // Create overlays for detected objects with product matches
      detectedObjects.forEach((obj) => {
        if (obj.score > 0.5) { // Only show confident detections
          const [x, y, width, height] = obj.bbox;
          
          // Find matching products for this object
          const matchingProducts = productMatches
            .filter(match => match.detectedClass === obj.class)
            .flatMap(match => match.products);

          if (matchingProducts.length > 0) {
            // Create overlay for the detected object
            newOverlays.push({
              x: x,
              y: y,
              width: width,
              height: height,
              productId: matchingProducts[0].id,
              confidence: obj.score,
              detectedClass: obj.class
            });

            // Notify parent about found products
            onProductsFound(matchingProducts, obj.class);
            
            // Trigger product detection for the first match
            if (matchingProducts[0]) {
              onProductDetected(matchingProducts[0]);
            }
          }
        }
      });

      setOverlays(newOverlays);
    };

    processDetectedObjects();
  }, [detectedObjects, isActive, isModelReady, products, findProductMatches, onProductDetected, onProductsFound, lastDetectionTime]);

  const handleToggleCamera = () => {
    if (isActive) {
      stopCamera();
      setOverlays([]);
    } else {
      startCamera();
    }
  };

  const handleScan = () => {
    if (!isActive || !isModelReady) return;
    
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
    
    // Force a new detection cycle
    setLastDetectionTime(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">AI Vision</h2>
            {isModelLoading && (
              <div className="flex items-center space-x-1">
                <Brain size={16} className="text-white animate-pulse" />
                <span className="text-white text-sm">Loading AI...</span>
              </div>
            )}
            {isModelReady && (
              <div className="flex items-center space-x-1">
                <Brain size={16} className="text-green-300" />
                <span className="text-green-300 text-sm">AI Ready</span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleScan}
              disabled={!isActive || !isModelReady || isModelLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive && isModelReady && !isModelLoading
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Focus size={18} />
              <span>Scan</span>
            </button>
            <button
              onClick={startDemoMode}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Zap size={18} />
              <span>Demo</span>
            </button>
            <button
              onClick={handleToggleCamera}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {isActive ? <CameraOff size={18} /> : <Camera size={18} />}
              <span>{isActive ? 'Stop' : 'Start'}</span>
            </button>
          </div>
        </div>
        
        {/* Detection Status */}
        {isActive && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              {isDetecting ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white">Detecting objects...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="text-white/80">Standby</span>
                </>
              )}
            </div>
            <div className="text-white/80">
              Objects found: {detectedObjects.length}
            </div>
          </div>
        )}
      </div>

      <div className="relative aspect-video bg-gray-900 min-h-[300px]">
{/* ...existing code... */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
              <p className="text-lg font-medium">Camera Error</p>
              <p className="text-sm text-gray-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {!isModelReady && isModelLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <Brain size={48} className="mx-auto mb-4 text-blue-400 animate-pulse" />
              <p className="text-lg font-medium">Loading AI Model</p>
              <p className="text-sm text-gray-400 mt-1">Preparing object detection...</p>
            </div>
          </div>
        )}

        {hasPermission === null && !isModelLoading && !isDemoMode && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <Camera size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">AI Camera Ready</p>
              <p className="text-sm text-gray-400 mt-1">Tap start to begin object detection or try demo mode</p>
            </div>
          </div>
        )}

        {isDemoMode && !isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white">
            <div className="text-center">
              <Zap size={48} className="mx-auto mb-4 text-yellow-400" />
              <p className="text-lg font-medium">Demo Mode</p>
              <p className="text-sm text-gray-300 mt-1">Simulating object detection...</p>
            </div>
          </div>
        )}

        {hasPermission === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
            <div className="text-center">
              <CameraOff size={48} className="mx-auto mb-4 text-red-400" />
              <p className="text-lg font-medium">Camera Access Denied</p>
              <p className="text-sm text-gray-400 mt-1">Please enable camera permissions</p>
            </div>
          </div>
        )}

        {isActive && (
          <>
            {isDemoMode ? (
              // Demo mode display
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  🎬 Demo Mode
                </div>
                
                {/* Simulated grocery items */}
                <div className="absolute top-1/4 left-1/4 w-20 h-16 bg-red-400 rounded-lg flex items-center justify-center text-white font-bold">
                  🍎
                </div>
                <div className="absolute top-1/3 right-1/4 w-16 h-20 bg-yellow-400 rounded-lg flex items-center justify-center text-white font-bold">
                  🍌
                </div>
                <div className="absolute bottom-1/3 left-1/3 w-12 h-24 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold">
                  🍼
                </div>
              </div>
            ) : (
              // Real camera feed with mirroring
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width={640}
                height={480}
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}
            
            {/* Real AR Overlays based on object detection - positioned for mirrored video */}
            {overlays.map((overlay, index) => {
              const product = products.find(p => p.id === overlay.productId);
              // Get the container dimensions for mirroring calculation
              const containerWidth = 640; // video width
              
              // Calculate mirrored position
              const mirroredX = containerWidth - overlay.x - overlay.width;
              
              return (
                <div
                  key={index}
                  className="absolute border-2 border-green-400 rounded-lg bg-green-400/20 backdrop-blur-sm"
                  style={{
                    left: `${(mirroredX / containerWidth) * 100}%`,
                    top: `${(overlay.y / 480) * 100}%`,
                    width: `${(overlay.width / containerWidth) * 100}%`,
                    height: `${(overlay.height / 480) * 100}%`
                  }}
                >
                  <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium max-w-48 truncate">
                    {overlay.detectedClass} → {product?.name} ({Math.round(overlay.confidence * 100)}%)
                  </div>
                  <div className="absolute top-2 right-2">
                    <Zap size={16} className="text-green-400 animate-pulse" />
                  </div>
                </div>
              );
            })}

            {/* Scanning Animation */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-blue-500 rounded-full animate-ping" />
                <div className="absolute w-16 h-16 border-4 border-white rounded-full animate-spin" />
              </div>
            )}

            {/* Corner Guides */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/60" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/60" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/60" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/60" />
            
            {/* Detection Info Overlay */}
            {detectedObjects.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                Detected: {detectedObjects.map(obj => `${obj.class} (${Math.round(obj.score * 100)}%)`).join(', ')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    
  );
};
