import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { VoiceInterface } from './components/VoiceInterface';
import { CameraView } from './components/CameraView';
import { ProductResults } from './components/ProductResults';
import { AccessibilityControls } from './components/AccessibilityControls';
import { AIService } from './services/aiService';
import { useVibration } from './hooks/useVibration';
import { Product, SearchFilters } from './types';
import { products as productDatabase } from './data/products';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [highlightedProduct, setHighlightedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  
  // Accessibility settings
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { vibrateSuccess, vibrateFound } = useVibration();

  useEffect(() => {
    // Apply accessibility settings
    const root = document.documentElement;
    
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [fontSize, highContrast, reducedMotion]);

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    setResponse('');

    try {
      const result = await AIService.processVoiceCommand(command);
      setProducts(result.products);
      setResponse(result.response);
      setCurrentFilters(result.filters || {});
      
      if (result.products.length > 0) {
        setHighlightedProduct(result.products[0]);
        vibrateSuccess();
      }
    } catch (error) {
      console.error('Voice command error:', error);
      setResponse('Sorry, I encountered an error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProductDetected = (product: Product) => {
    setHighlightedProduct(product);
    vibrateFound();
    
    // Update products to include the detected product
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev;
      return [product, ...prev];
    });
  };

  const handleProductsFound = (foundProducts: Product[], detectedClass: string) => {
    // Update the products list with all found products
    setProducts(foundProducts);
    
    // Set response about what was detected
    const productNames = foundProducts.slice(0, 3).map(p => p.name).join(', ');
    const additionalCount = foundProducts.length > 3 ? ` and ${foundProducts.length - 3} more` : '';
    setResponse(`I detected "${detectedClass}" and found ${foundProducts.length} related products: ${productNames}${additionalCount}`);
    
    if (foundProducts.length > 0) {
      setHighlightedProduct(foundProducts[0]);
      vibrateSuccess();
    }
  };

  const handleProductSelect = (product: Product) => {
    setHighlightedProduct(product);
    vibrateFound();
    
    const productResponse = `Selected ${product.name} by ${product.brand}. Price: $${product.price}. Location: Aisle ${product.location.aisle}, ${product.location.shelf} shelf. ${product.inStock ? 'In stock!' : 'Out of stock.'}`;
    setResponse(productResponse);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${
      highContrast ? 'high-contrast' : ''
    } ${reducedMotion ? 'reduced-motion' : ''}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <ShoppingCart size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Voice-to-Vision
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your AI-powered shopping assistant with voice commands, visual recognition, and accessibility features
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Voice Interface */}
          <div className="space-y-6">
            <VoiceInterface
              onCommand={handleVoiceCommand}
              isProcessing={isProcessing}
              response={response}
            />
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Commands</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleVoiceCommand('find organic bread')}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Find Organic Bread
                </button>
                <button
                  onClick={() => handleVoiceCommand('show me dairy free milk')}
                  className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Dairy-Free Milk
                </button>
                <button
                  onClick={() => handleVoiceCommand('where are the bananas')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Find Bananas
                </button>
                <button
                  onClick={() => handleVoiceCommand('cheap protein options')}
                  className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Cheap Protein
                </button>
              </div>
            </div>
          </div>

          {/* Camera View */}
          <div>
            <CameraView
              products={productDatabase}
              onProductDetected={handleProductDetected}
              onProductsFound={handleProductsFound}
            />
          </div>
        </div>

        {/* Product Results */}
        <ProductResults
          products={products}
          highlightedProduct={highlightedProduct || undefined}
          onProductSelect={handleProductSelect}
        />

        {/* Current Filters */}
        {Object.keys(currentFilters).length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {currentFilters.category && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Category: {currentFilters.category}
                </span>
              )}
              {currentFilters.priceRange && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Price: ${currentFilters.priceRange[0]} - ${currentFilters.priceRange[1]}
                </span>
              )}
              {currentFilters.dietary && currentFilters.dietary.map((diet) => (
                <span key={diet} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {diet}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Controls */}
      <AccessibilityControls
        audioEnabled={audioEnabled}
        onAudioToggle={() => setAudioEnabled(!audioEnabled)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        highContrast={highContrast}
        onHighContrastToggle={() => setHighContrast(!highContrast)}
        reducedMotion={reducedMotion}
        onReducedMotionToggle={() => setReducedMotion(!reducedMotion)}
      />
    </div>
  );
}

export default App;