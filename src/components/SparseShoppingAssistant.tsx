import React, { useState } from "react";
import { ShoppingCart, Search, Package, Mic, MicOff, Sparkles, Zap, Star } from "lucide-react";
import { ProductResults } from "./ProductResults";
import { VoiceInterface } from "./VoiceInterface";
import { Product } from "../types";
import { products as productDatabase } from "../data/products";

interface SparseShoppingAssistantProps {
  onProductDetected?: (product: Product) => void;
  onProductsFound?: (products: Product[]) => void;
}

export const SparseShoppingAssistant: React.FC<
  SparseShoppingAssistantProps
> = ({ onProductDetected, onProductsFound }) => {
  const [detectedProducts, setDetectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);

  // Demo products to show
  // const demoProducts = productDatabase.slice(0, 6);

  // useEffect(() => {
  //   // Set some demo detected products for display
  //   setDetectedProducts(demoProducts);
  //   if (onProductsFound) {
  //     onProductsFound(demoProducts);
  //   }
  // }, [demoProducts, onProductsFound]);

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    setResponse("");

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Search for products based on voice command
      const searchResults = productDatabase.filter(
        (product) =>
          product.name.toLowerCase().includes(command.toLowerCase()) ||
          product.category.toLowerCase().includes(command.toLowerCase()) ||
          product.description.toLowerCase().includes(command.toLowerCase())
      );

      if (searchResults.length > 0) {
        setDetectedProducts(searchResults.slice(0, 10));
        setResponse(
          `Found ${searchResults.length} products matching "${command}"`
        );
        if (onProductsFound) {
          onProductsFound(searchResults);
        }
      } else {
        setResponse(
          `No products found matching "${command}". Try searching for categories like "organic", "gluten-free", or "dairy".`
        );
      }
    } catch (err) {
      console.error("Voice command processing error:", err);
      setResponse(
        "Sorry, I had trouble processing your request. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const searchResults = productDatabase.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setDetectedProducts(searchResults.slice(0, 10));
    if (onProductsFound) {
      onProductsFound(searchResults);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-4 rounded-2xl shadow-lg">
              <ShoppingCart size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Smart Shopping Assistant
              </h1>
              <p className="text-gray-600 text-lg">
                AI-powered product discovery with voice commands
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowVoiceInterface(!showVoiceInterface)}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              showVoiceInterface 
                ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
            }`}
          >
            {showVoiceInterface ? <MicOff size={22} /> : <Mic size={22} />}
            <span className="text-sm">
              {showVoiceInterface ? 'Voice Active' : 'Start Voice'}
            </span>
          </button>
        </div>

        {/* Enhanced System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-5 border border-blue-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Package size={18} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-700">Products Found</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">
              {detectedProducts.length}
            </p>
            <p className="text-xs text-blue-600 mt-1">Ready to explore</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl p-5 border border-orange-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Search size={18} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-orange-700">Search Status</span>
            </div>
            <p className="text-2xl font-bold text-orange-800">
              {isProcessing ? 'Processing...' : 'Ready'}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              {isProcessing ? 'Please wait...' : 'Type or speak to search'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-5 border border-purple-200">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-purple-500 p-2 rounded-lg">
                <ShoppingCart size={18} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-purple-700">Database</span>
            </div>
            <p className="text-2xl font-bold text-purple-800">
              {productDatabase.length}
            </p>
            <p className="text-xs text-purple-600 mt-1">Items available</p>
          </div>
        </div>
      </div>

      {/* Voice Interface */}
      {showVoiceInterface && (
        <div className="animate-fadeIn">
          <VoiceInterface
            onCommand={handleVoiceCommand}
            isProcessing={isProcessing}
            response={response}
          />
        </div>
      )}

      {/* Enhanced Search Interface */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Product Search</h2>
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <Sparkles size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-700">AI Powered</span>
          </div>
        </div>
        
        <div className="flex space-x-4 mb-8">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for products, brands, or categories..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isProcessing}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg"
          >
            <Search size={20} />
            <span>{isProcessing ? 'Searching...' : 'Search'}</span>
          </button>
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Mic size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-800">Voice Search</h3>
            </div>
            <p className="text-blue-700 text-sm mb-4">
              Use natural language to find products. Try "organic apples" or "gluten-free bread"
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                "find organic bread"
              </span>
              <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                "dairy-free milk"
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Star size={20} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Smart Recommendations</h3>
            </div>
            <p className="text-green-700 text-sm mb-4">
              Get personalized product suggestions based on your preferences and dietary needs
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Organic
              </span>
              <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Gluten-Free
              </span>
              <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Vegan
              </span>
            </div>
          </div>
        </div>
        
        {/* Response Display */}
        {response && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6 animate-fadeIn">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-500 p-2 rounded-lg">
                <Zap size={16} className="text-white" />
              </div>
              <h4 className="font-semibold text-green-800">Search Results</h4>
            </div>
            <p className="text-green-700 text-sm leading-relaxed">{response}</p>
          </div>
        )}
      </div>

      {/* Detected/Found Products */}
      {detectedProducts.length > 0 && (
        <ProductResults
          products={detectedProducts}
          onProductSelect={(product) => {
            if (onProductDetected) {
              onProductDetected(product);
            }
            console.log("Product selected:", product);
          }}
        />
      )}
    </div>
  );
};
