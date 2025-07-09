import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Product } from '../types';

export interface DetectedObject {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export interface ProductMatch {
  products: Product[];
  confidence: number;
  detectedClass: string;
}

class ObjectDetectionService {
  private model: cocoSsd.ObjectDetection | null = null;
  private modelReady = false;
  private initializationPromise: Promise<void> | null = null;

  // Mapping from COCO-SSD classes to product categories/keywords
  private readonly classToProductMapping: Record<string, string[]> = {
    'apple': ['apple', 'fruit', 'produce'],
    'banana': ['banana', 'fruit', 'produce'],
    'orange': ['orange', 'fruit', 'citrus', 'produce'],
    'broccoli': ['broccoli', 'vegetable', 'produce'],
    'carrot': ['carrot', 'vegetable', 'produce'],
    'hot dog': ['hot dog', 'sausage', 'meat'],
    'pizza': ['pizza', 'frozen pizza', 'prepared'],
    'donut': ['donut', 'doughnut', 'bakery'],
    'cake': ['cake', 'bakery', 'dessert'],
    'sandwich': ['sandwich', 'bread', 'bakery'],
    'bottle': ['bottle', 'water', 'beverage', 'drink'],
    'wine glass': ['wine', 'glass', 'beverage'],
    'cup': ['cup', 'coffee', 'tea', 'beverage'],
    'bowl': ['bowl', 'cereal', 'soup'],
    'spoon': ['spoon', 'utensil'],
    'knife': ['knife', 'utensil'],
    'fork': ['fork', 'utensil'],
    'cell phone': ['phone', 'mobile', 'electronics'],
    'laptop': ['laptop', 'computer', 'electronics'],
    'mouse': ['mouse', 'computer', 'electronics'],
    'keyboard': ['keyboard', 'computer', 'electronics'],
    'book': ['book', 'reading'],
    'clock': ['clock', 'time'],
    'scissors': ['scissors', 'office'],
    'teddy bear': ['toy', 'bear', 'stuffed'],
    'hair drier': ['hair dryer', 'beauty', 'personal care'],
    'toothbrush': ['toothbrush', 'dental', 'health', 'beauty']
  };

  async initialize(): Promise<void> {
    if (this.modelReady) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        console.log('Initializing TensorFlow.js...');
        await tf.ready();
        console.log('TensorFlow.js ready, loading COCO-SSD model...');
        
        // Set backend to webgl for better performance
        await tf.setBackend('webgl');
        
        this.model = await cocoSsd.load({
          base: 'lite_mobilenet_v2' // Use lighter model for better performance
        });
        
        this.modelReady = true;
        console.log('COCO-SSD model loaded successfully');
      } catch (error) {
        console.error('Model loading failed:', error);
        this.model = null;
        this.modelReady = false;
        throw new Error(`Model loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    })();

    return this.initializationPromise;
  }

  async detectObjects(videoElement: HTMLVideoElement): Promise<DetectedObject[]> {
    if (!this.model || !this.modelReady) {
      throw new Error('Object detection model not initialized');
    }

    // Check if video element is ready
    if (!videoElement || videoElement.readyState < HTMLMediaElement.HAVE_METADATA) {
      console.warn('Video element not ready for detection');
      return [];
    }

    try {
      console.log('Starting object detection...');
      const predictions = await this.model.detect(videoElement);
      console.log('Raw predictions:', predictions);
      
      return predictions.map(prediction => ({
        class: prediction.class,
        score: prediction.score,
        bbox: prediction.bbox as [number, number, number, number]
      }));
    } catch (error) {
      console.error('Detection error:', error);
      return [];
    }
  }

  findMatchingProducts(detectedObjects: DetectedObject[], allProducts: Product[]): ProductMatch[] {
    const matches: ProductMatch[] = [];

    for (const obj of detectedObjects) {
      // Only consider objects with high confidence
      if (obj.score < 0.5) continue;

      const keywords = this.classToProductMapping[obj.class.toLowerCase()] || [obj.class.toLowerCase()];
      const matchingProducts: Product[] = [];

      // Search for products matching the detected object
      for (const product of allProducts) {
        const productText = `${product.name} ${product.category} ${product.description} ${product.dietary.join(' ')}`.toLowerCase();
        
        // Check if any keyword matches the product
        const hasMatch = keywords.some(keyword => 
          productText.includes(keyword.toLowerCase())
        );

        if (hasMatch) {
          matchingProducts.push(product);
        }
      }

      if (matchingProducts.length > 0) {
        matches.push({
          products: matchingProducts.slice(0, 10), // Limit to top 10 matches
          confidence: obj.score,
          detectedClass: obj.class
        });
      }
    }

    // Sort by confidence and remove duplicates
    return matches
      .sort((a, b) => b.confidence - a.confidence)
      .filter((match, index, self) => 
        index === self.findIndex(m => m.detectedClass === match.detectedClass)
      );
  }

  // Enhanced search that also considers partial matches and synonyms
  searchProductsByKeywords(keywords: string[], allProducts: Product[]): Product[] {
    const results: Product[] = [];
    const seenIds = new Set<string>();

    for (const keyword of keywords) {
      for (const product of allProducts) {
        if (seenIds.has(product.id)) continue;

        const searchText = `${product.name} ${product.brand} ${product.category} ${product.description}`.toLowerCase();
        
        if (searchText.includes(keyword.toLowerCase())) {
          results.push(product);
          seenIds.add(product.id);
        }
      }
    }

    return results;
  }

  isInitialized(): boolean {
    return this.modelReady && this.model !== null;
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.modelReady = false;
    }
  }
}

export const objectDetectionService = new ObjectDetectionService();
