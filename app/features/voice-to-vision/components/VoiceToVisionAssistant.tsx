"use client";
import type React from "react";
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Package, Mic, Star, MapPin, Leaf, Volume2, Loader2 } from 'lucide-react';
import { VoiceRecognition } from "./VoiceRecognition";
import { AccessibilityControls } from "./AccessibilityControls";
import type { Product } from "../types/voice.types";
import { productDatabase } from "../lib/product-database";
import { useTextToSpeech } from "../lib/speech-processing";

export function VoiceToVisionAssistant() {
  const [products, setProducts] = useState<Product[]>([]);
  const [highlightedProduct, setHighlightedProduct] = useState<Product | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [showVoice, setShowVoice] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [voiceFound, setVoiceFound] = useState(0);
  const [searchStatus, setSearchStatus] = useState("Ready");
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Speech management
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const lastSpokenRef = useRef<string>("");
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Accessibility settings
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleSpeech = (text: string) => {
    if (!audioEnabled || !text || text === lastSpokenRef.current) return;
    // Clear any existing timeout
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    // Stop current speech
    stop();
    // Set a small delay to prevent rapid-fire speech
    speechTimeoutRef.current = setTimeout(() => {
      lastSpokenRef.current = text;
      speak(text);
    }, 500);
  };

  const handleVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    setSearchStatus("Processing...")
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const results = productDatabase.filter(
        (product) =>
          product.name.toLowerCase().includes(command.toLowerCase()) ||
          product.category.toLowerCase().includes(command.toLowerCase()) ||
          product.description.toLowerCase().includes(command.toLowerCase()) ||
          product.dietary.some((diet) => diet.toLowerCase().includes(command.toLowerCase())),
      )
      if (results.length > 0) {
        const topProduct = results[0]
        setProducts(results.slice(0, 10))
        setHighlightedProduct(topProduct)
        setVoiceFound(results.length)
        const responseText = `Found ${results.length} products matching "${command}". The top result is ${topProduct.name} by ${topProduct.brand}, priced at ₹${topProduct.price}. It is located in aisle ${topProduct.location.aisle}, ${topProduct.location.shelf} shelf.`
        setResponse(responseText)
        handleSpeech(responseText)
      } else {
        const responseText = `No products found matching "${command}". Try searching for categories like organic, gluten-free, or dairy.`
        setResponse(responseText)
        handleSpeech(responseText)
        setProducts([])
        setVoiceFound(0)
      }
      setSearchStatus("Ready")
    } catch (error) {
      console.error("Voice command error:", error)
      const errorText = "Sorry, I encountered an error processing your request."
      setResponse(errorText)
      handleSpeech(errorText)
      setSearchStatus("Ready")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsProcessing(true);
    setSearchStatus("Processing...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const results = productDatabase.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.dietary.some((diet) =>
            diet.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setProducts(results.slice(0, 10));
      setVoiceFound(results.length);
      setSearchStatus("Ready");
    } catch (error) {
      console.error("Search error:", error);
      setSearchStatus("Ready");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setHighlightedProduct(product);
    const productText = `Selected ${product.name} by ${product.brand}. Price: ₹${product.price}. Located in aisle ${product.location.aisle}.`;
    setResponse(productText);
    handleSpeech(productText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-cyan-600 p-3 rounded-full">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Voice-to-Vision
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your AI-powered shopping assistant with voice commands, visual
            recognition, and accessibility features
          </p>
        </div>
        {/* Quick Commands */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Quick Commands
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleVoiceCommand("find organic bread")}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
            >
              Find Organic Bread
            </Button>
            <Button
              onClick={() => handleVoiceCommand("dairy free milk")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg"
            >
              Dairy-Free Milk
            </Button>
            <Button
              onClick={() => handleVoiceCommand("find bananas")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg"
            >
              Find Bananas
            </Button>
            <Button
              onClick={() => handleVoiceCommand("cheap protein")}
              className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 rounded-lg"
            >
              Cheap Protein
            </Button>
          </div>
        </div>
        {/* Smart Shopping Assistant */}
        <Card className="mb-6 bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-purple-400">
                    Smart Shopping Assistant
                  </CardTitle>
                  <p className="text-sm text-gray-300">
                    AI-powered product discovery with voice commands
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`${
                  isVoiceActive
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-700 hover:bg-gray-600"
                } text-white px-4 py-2 rounded-lg flex items-center gap-2`}
              >
                <Mic className="w-4 h-4" />
                {isVoiceActive ? "Voice Active" : "Voice"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-900/50 rounded-lg p-4 text-center border border-blue-700">
                <div className="bg-blue-600 p-2 rounded-lg w-fit mx-auto mb-2">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-200">
                  {voiceFound}
                </div>
                <div className="text-xs text-blue-200 font-medium">
                  Voice Found
                </div>
                <div className="text-xs text-blue-300 mt-1">
                  Ready to explore
                </div>
              </div>
              <div className="bg-orange-900/50 rounded-lg p-4 text-center border border-orange-700">
                <div className="bg-orange-600 p-2 rounded-lg w-fit mx-auto mb-2">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-200">
                  {searchStatus}
                </div>
                <div className="text-xs text-orange-200 font-medium">
                  Search Status
                </div>
                <div className="text-xs text-orange-300 mt-1">
                  {isProcessing ? "Please wait..." : "Type or speak to search"}
                </div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center border border-purple-700">
                <div className="bg-purple-600 p-2 rounded-lg w-fit mx-auto mb-2">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-200">1000</div>
                <div className="text-xs text-purple-200 font-medium">
                  Database
                </div>
                <div className="text-xs text-purple-300 mt-1">
                  Items available
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Voice Assistant */}
        <Card className="mb-6 bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Voice Assistant</CardTitle>
              <Badge variant="secondary" className="bg-blue-900/50 text-blue-200 border-blue-700">
                AI Powered
              </Badge>
            </div>
            <p className="text-sm text-gray-300">
              Speak naturally to search for products
            </p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowVoice(true)}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-700 hover:from-cyan-700 hover:to-purple-800 text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              {isProcessing ? "Processing..." : "Tap to speak"}
            </Button>
          </CardContent>
        </Card>
        {/* Product Search */}
        <Card className="mb-6 bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-white">Product Search</CardTitle>
              <Badge variant="secondary" className="bg-blue-900/50 text-blue-200 border-blue-700">
                AI Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for products, brands, or categories..."
                className="flex-1 rounded-lg bg-gray-700 text-gray-100 border-gray-600 placeholder:text-gray-400"
              />
              <Button
                onClick={handleSearch}
                disabled={isProcessing}
                className="bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white"
              >
                Search
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/50 rounded-lg p-4 border border-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-600 p-1 rounded">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-blue-200">
                    Voice Search
                  </span>
                </div>
                <p className="text-sm text-blue-300 mb-3">
                  Use natural language to find products. Try "organic apples" or
                  "gluten-free bread"
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="secondary"
                    className="bg-blue-800 text-blue-200 text-xs border-blue-700"
                  >
                    "find organic bread"
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-800 text-blue-200 text-xs border-blue-700"
                  >
                    "dairy-free milk"
                  </Badge>
                </div>
              </div>
              <div className="bg-green-900/50 rounded-lg p-4 border border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-600 p-1 rounded">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-green-200">
                    Smart Recommendations
                  </span>
                </div>
                <p className="text-sm text-green-300 mb-3">
                  Get personalized product suggestions based on your preferences
                  and dietary needs
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="secondary"
                    className="bg-green-800 text-green-200 text-xs border-green-700"
                  >
                    Organic
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-green-800 text-green-200 text-xs border-green-700"
                  >
                    Gluten-Free
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-green-800 text-green-200 text-xs border-green-700"
                  >
                    Vegan
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Response Display */}
        {response && (
          <Card className="mb-6 bg-green-900/50 border-green-700 shadow-lg rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-600 p-2 rounded-full">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">Assistant Response</Badge>
                    {isSpeaking && (
                      <Badge variant="outline" className="animate-pulse bg-gray-700 text-gray-300 border-gray-600">
                        Speaking...
                      </Badge>
                    )}
                  </div>
                  <p className="text-green-200">{response}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Product Results */}
        {products.length > 0 ? (
          <Card className="mb-6 bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">🛍️ Product Results</CardTitle>
              <p className="text-sm text-gray-300">
                Found {products.length} products
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      highlightedProduct?.id === product.id
                        ? "border-cyan-500 bg-cyan-900/50"
                        : "border-gray-700 hover:border-gray-600 bg-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          product.image || "/placeholder.svg?height=60&width=60"
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate text-gray-100">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-400">{product.brand}</p>
                        <p className="text-sm font-bold text-green-400">
                          ₹{product.price}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            Aisle {product.location.aisle}
                          </span>
                        </div>
                        {product.dietary.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.dietary.slice(0, 2).map((diet) => (
                              <Badge
                                key={diet}
                                variant="secondary"
                                className="text-xs bg-gray-600 text-gray-200 border-gray-500"
                              >
                                <Leaf className="w-2 h-2 mr-1" />
                                {diet}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700">
            <CardContent className="text-center py-12">
              <div className="bg-gray-700 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Products Found
              </h3>
              <p className="text-gray-300 mb-4">
                Try using voice commands or search for different terms
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-700 bg-gray-800 text-gray-300 border-gray-700"
                  onClick={() => handleVoiceCommand("organic apples")}
                >
                  "organic apples"
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-700 bg-gray-800 text-gray-300 border-gray-700"
                  onClick={() => handleVoiceCommand("gluten-free bread")}
                >
                  "gluten-free bread"
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-700 bg-gray-800 text-gray-300 border-gray-700"
                  onClick={() => handleVoiceCommand("dairy-free milk")}
                >
                  "dairy-free milk"
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Voice Modal */}
        {showVoice && (
          <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Voice Assistant</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowVoice(false)}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  ✕
                </Button>
              </div>
              <VoiceRecognition
                onCommand={handleVoiceCommand}
                isProcessing={isProcessing}
                response={response}
              />
            </div>
          </div>
        )}
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
    </div>
  );
}
