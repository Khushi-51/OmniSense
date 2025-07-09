import { useState, useRef, useCallback, useEffect } from 'react';
import { objectDetectionService, DetectedObject, ProductMatch } from '../services/objectDetectionService';
import { Product } from '../types';

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionRequestRef = useRef<number | null>(null);
  const modelInitializationAttempted = useRef(false);

  // Initialize the object detection model
  useEffect(() => {
    let mounted = true;
    
    const initializeModel = async () => {
      if (modelInitializationAttempted.current) return;
      modelInitializationAttempted.current = true;
      
      setIsModelLoading(true);
      setError(null);
      
      try {
        console.log('Starting model initialization...');
        await objectDetectionService.initialize();
        
        if (mounted) {
          console.log('Model successfully initialized');
          setIsModelReady(true);
          setIsModelLoading(false);
        }
      } catch (err) {
        console.error('Model initialization error:', err);
        if (mounted) {
          setError(`Failed to load AI model: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsModelLoading(false);
          setIsModelReady(false);
        }
      }
    };

    // Only initialize if not already ready and not already loading
    if (!isModelReady && !isModelLoading) {
      initializeModel();
    }

    return () => {
      mounted = false;
      // Clean up detection processes
      if (detectionRequestRef.current) {
        cancelAnimationFrame(detectionRequestRef.current);
        detectionRequestRef.current = null;
      }
    };
  }, [isModelReady, isModelLoading]);

  const detectObjects = useCallback(async () => {
    if (!videoRef.current || !isModelReady || !isActive) return;

    try {
      console.log('Running object detection...');
      const objects = await objectDetectionService.detectObjects(videoRef.current);
      console.log('Detected objects:', objects);
      setDetectedObjects(objects);
    } catch (err) {
      console.error('Detection error:', err);
    } finally {
      // Schedule next detection
      if (isActive && isDetecting) {
        detectionRequestRef.current = requestAnimationFrame(detectObjects);
      }
    }
  }, [isActive, isModelReady, isDetecting]);

  const startObjectDetection = useCallback(() => {
    if (!videoRef.current || !isModelReady || isDetecting) return;

    setIsDetecting(true);
    detectObjects();
  }, [isModelReady, isDetecting, detectObjects]);

  const stopObjectDetection = useCallback(() => {
    setIsDetecting(false);
    if (detectionRequestRef.current) {
      cancelAnimationFrame(detectionRequestRef.current);
      detectionRequestRef.current = null;
    }
    setDetectedObjects([]);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('Camera requires HTTPS or localhost');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      setIsActive(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        return new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            console.log('Camera loaded, video dimensions:', 
              videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            resolve();
          };
        });
      }
    } catch (err) {
      const error = err as Error;
      let errorMessage = 'Camera access denied or unavailable';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported in this browser.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      }
      
      setError(errorMessage);
      setHasPermission(false);
      setIsActive(false);
      console.error('Camera error:', error);
      throw error;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    stopObjectDetection();
    setIsActive(false);
    setIsDemoMode(false);
  }, [stopObjectDetection]);

  const startDemoMode = useCallback(() => {
    setIsDemoMode(true);
    setIsActive(true);
    setHasPermission(true);
    setError(null);
    // Simulate some detected objects for demo
    setDetectedObjects([
      { class: 'apple', score: 0.95, bbox: [160, 120, 80, 60] },
      { class: 'banana', score: 0.88, bbox: [400, 140, 60, 80] },
      { class: 'bottle', score: 0.82, bbox: [320, 250, 48, 96] }
    ]);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Draw the mirrored video frame
    context.scale(-1, 1);
    context.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const findProductMatches = useCallback(async (detectedObjects: DetectedObject[], allProducts: Product[]): Promise<ProductMatch[]> => {
    return objectDetectionService.findMatchingProducts(detectedObjects, allProducts);
  }, []);

  // Start detection when model becomes ready and camera is active
  useEffect(() => {
    if (isActive && isModelReady && !isDetecting && !isDemoMode) {
      startObjectDetection();
    }
  }, [isActive, isModelReady, isDetecting, isDemoMode, startObjectDetection]);

  return {
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
    captureFrame,
    findProductMatches,
    // Add debug info
    debugInfo: {
      modelStatus: isModelReady ? 'ready' : isModelLoading ? 'loading' : 'not loaded',
      videoDimensions: videoRef.current 
        ? `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}` 
        : 'not available',
      detectionStatus: isDetecting ? 'active' : 'inactive'
    }
  };
};