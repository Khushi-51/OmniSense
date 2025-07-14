"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Music, Smile, RefreshCw, Sparkles, Wind } from "lucide-react"
import type { EmpathyMood, EmpathyResponse, Product } from "../types/ter.types"

interface EmpathyAssistantProps {
  onClose: () => void
}

export default function EmpathyAssistant({ onClose }: EmpathyAssistantProps) {
  const [selectedMood, setSelectedMood] = useState<EmpathyMood["mood"] | null>(null)
  const [selectedBudget, setSelectedBudget] = useState<EmpathyMood["budget"] | null>(null)
  const [response, setResponse] = useState<EmpathyResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showHugModal, setShowHugModal] = useState(false)
  const [showCalmTransition, setShowCalmTransition] = useState(false)
  const [breathingExercise, setBreathingExercise] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(4)

  const moods = [
    { value: "anxious" as const, emoji: "😰", label: "Anxious" },
    { value: "sad" as const, emoji: "😢", label: "Sad" },
    { value: "tired" as const, emoji: "😴", label: "Tired" },
    { value: "overwhelmed" as const, emoji: "🤯", label: "Overwhelmed" },
  ]

  const budgets = [500, 1000, 1500] as const

  const generateEmpathyResponse = async (
    mood: EmpathyMood["mood"],
    budget: EmpathyMood["budget"],
  ): Promise<EmpathyResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const productCatalog: Record<string, Product[]> = {
      anxious: [
        { name: "Chamomile Tea Pack", description: "Soothing herbal tea to calm your nerves", price: 150 },
        { name: "Lavender Essential Oil", description: "Natural aromatherapy for relaxation", price: 200 },
        { name: "Stress Relief Gummies", description: "Natural supplements for anxiety relief", price: 300 },
        { name: "Meditation Cushion", description: "Comfortable cushion for mindful moments", price: 450 },
        { name: "Calming Face Mask", description: "Spa-quality mask for self-care", price: 180 },
      ],
      sad: [
        { name: "Comfort Hot Chocolate", description: "Rich, creamy cocoa to warm your heart", price: 120 },
        { name: "Cozy Blanket", description: "Soft fleece blanket for comfort", price: 400 },
        { name: "Uplifting Journal", description: "Beautiful journal for positive thoughts", price: 250 },
        { name: "Mood Boost Vitamins", description: "Natural supplements for emotional wellness", price: 350 },
        { name: "Aromatherapy Candle", description: "Vanilla scented candle for cozy vibes", price: 180 },
      ],
      tired: [
        { name: "Energy Boost Tea", description: "Natural caffeine blend for gentle energy", price: 160 },
        { name: "Vitamin B Complex", description: "Essential vitamins to fight fatigue", price: 280 },
        { name: "Comfortable Eye Mask", description: "Silk eye mask for better sleep", price: 220 },
        { name: "Energizing Body Wash", description: "Citrus-infused wash to wake you up", price: 190 },
        { name: "Power Nap Pillow", description: "Perfect pillow for quick rest", price: 350 },
      ],
      overwhelmed: [
        { name: "Organization Planner", description: "Daily planner to sort your thoughts", price: 200 },
        { name: "Calming Room Spray", description: "Instant relaxation in a bottle", price: 150 },
        { name: "Mindfulness Cards", description: "Daily affirmations and breathing exercises", price: 180 },
        { name: "Stress Ball Set", description: "Squeeze away the tension", price: 100 },
        { name: "Zen Garden Kit", description: "Mini desktop zen garden for focus", price: 300 },
      ],
    }

    const treatYourselfItems: Product[] = [
      { name: "Dark Chocolate Bar", description: "Premium Belgian chocolate for a sweet moment", price: 80 },
      { name: "Scented Candle", description: "Vanilla & sandalwood for instant calm", price: 120 },
      { name: "Face Sheet Mask", description: "Hydrating mask for a mini spa moment", price: 60 },
      { name: "Herbal Tea Sampler", description: "Try 5 different calming teas", price: 100 },
      { name: "Mini Succulent Plant", description: "Tiny green friend for your space", price: 90 },
    ]

    const comfortMessages = {
      anxious:
        "I can feel your worry, and that's completely okay. You're stronger than you know, and this feeling will pass. Let's find some gentle comfort together.",
      sad: "Your feelings are valid, and it's brave of you to reach out. Sometimes we all need a little extra care. You deserve kindness, especially from yourself.",
      tired:
        "Rest is not a luxury, it's a necessity. Your body and mind are asking for what they need. Let's find some gentle energy boosters and comfort.",
      overwhelmed:
        "Take a deep breath with me. You don't have to carry everything at once. Let's break things down into smaller, manageable pieces. You've got this.",
    }

    const bundleNames = {
      anxious: "Calm & Comfort Kit",
      sad: "Gentle Healing Bundle",
      tired: "Gentle Energy Box",
      overwhelmed: "Peace & Organization Set",
    }

    const moodUplifts = {
      anxious: {
        type: "selfcare" as const,
        content: "Take 3 deep breaths and text someone you love",
      },
      sad: {
        type: "joke" as const,
        content:
          "Why don't scientists trust atoms? Because they make up everything! Just like how you'll make up from this feeling 😊",
      },
      tired: {
        type: "music" as const,
        content: "Gentle Energy Playlist",
        link: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",
      },
      overwhelmed: {
        type: "selfcare" as const,
        content: "Write down 3 things you're grateful for today",
      },
    }

    const alternateMoods = {
      anxious: "Swap to Calm?",
      sad: "Swap to Hopeful?",
      tired: "Swap to Energized?",
      overwhelmed: "Swap to Peaceful?",
    }

    const availableProducts = productCatalog[mood]
    const selectedProducts: Product[] = []
    let totalSpent = 0

    // Select 2-3 products within budget
    const shuffled = [...availableProducts].sort(() => 0.5 - Math.random())
    for (const product of shuffled) {
      if (selectedProducts.length < 3 && totalSpent + product.price <= budget - 100) {
        selectedProducts.push(product)
        totalSpent += product.price
      }
    }

    // Add treat yourself item if budget allows
    let treatYourselfItem: Product | undefined
    const remainingBudget = budget - totalSpent
    const affordableTreats = treatYourselfItems.filter((item) => item.price <= remainingBudget)
    if (affordableTreats.length > 0) {
      treatYourselfItem = affordableTreats[Math.floor(Math.random() * affordableTreats.length)]
      totalSpent += treatYourselfItem.price
    }

    return {
      comfortMessage: comfortMessages[mood],
      products: selectedProducts,
      treatYourselfItem,
      bundleName: bundleNames[mood],
      moodUplift: moodUplifts[mood],
      alternateMood: alternateMoods[mood],
      totalSpent,
      remainingBudget: budget - totalSpent,
    }
  }

  const handleGetRecommendations = async () => {
    if (!selectedMood || !selectedBudget) return

    setIsLoading(true)
    try {
      const empathyResponse = await generateEmpathyResponse(selectedMood, selectedBudget)
      setResponse(empathyResponse)
    } catch (error) {
      console.error("Error generating empathy response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedMood(null)
    setSelectedBudget(null)
    setResponse(null)
  }

  const openMusicLink = () => {
    if (response?.moodUplift.link) {
      window.open(response.moodUplift.link, "_blank")
    }
  }

  const sendVirtualHug = () => {
    setShowHugModal(true)
  }

  const handleMoodSwap = () => {
    setShowCalmTransition(true)
  }

  const confirmMoodSwap = () => {
    setResponse(null)
    setSelectedMood(null)
    setSelectedBudget(null)
    setShowCalmTransition(false)
  }

  const cancelMoodSwap = () => {
    setShowCalmTransition(false)
  }

  const startBreathingExercise = () => {
    setBreathingExercise(true)
    setBreathingPhase("inhale")
    setBreathingCount(4)

    let phase: "inhale" | "hold" | "exhale" = "inhale"
    let count = 4
    let cycles = 0
    const maxCycles = 3 // 3 complete breathing cycles

    const breathingInterval = setInterval(() => {
      count--
      setBreathingCount(count)

      if (count === 0) {
        if (phase === "inhale") {
          phase = "hold"
          count = 4
        } else if (phase === "hold") {
          phase = "exhale"
          count = 6
        } else {
          phase = "inhale"
          count = 4
          cycles++

          if (cycles >= maxCycles) {
            clearInterval(breathingInterval)
            setBreathingExercise(false)
            return
          }
        }
        setBreathingPhase(phase)
      }
    }, 1000)

    // Cleanup after 30 seconds max
    setTimeout(() => {
      clearInterval(breathingInterval)
      setBreathingExercise(false)
    }, 30000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="text-pink-500" size={24} />
              Your Caring Shopping Assistant
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-xl font-bold">
              ×
            </button>
          </div>

          {!response ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  I'm here to help you feel better through thoughtful shopping. Let's find what your heart needs today.
                </p>
              </div>

              {/* Mood Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">How are you feeling today?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedMood === mood.value
                          ? "border-pink-500 bg-pink-900/30"
                          : "border-gray-600 hover:border-pink-400 bg-gray-800/50"
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="font-medium text-gray-200">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">What's your comfort budget today?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {budgets.map((budget) => (
                    <button
                      key={budget}
                      onClick={() => setSelectedBudget(budget)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedBudget === budget
                          ? "border-green-500 bg-green-900/30"
                          : "border-gray-600 hover:border-green-400 bg-gray-800/50"
                      }`}
                    >
                      <div className="font-bold text-lg text-gray-200">₹{budget}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Get Recommendations Button */}
              <button
                onClick={handleGetRecommendations}
                disabled={!selectedMood || !selectedBudget || isLoading}
                className="w-full py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Finding perfect comfort items...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Get My Comfort Recommendations
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Comfort Message */}
              <div className="bg-pink-900/30 border border-pink-700 rounded-lg p-4">
                <p className="text-pink-200 leading-relaxed">{response.comfortMessage}</p>
              </div>

              {/* Bundle */}
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                <h3 className="text-lg font-bold text-blue-200 mb-3">{response.bundleName}</h3>
                <div className="space-y-3">
                  {response.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-200">{product.name}</div>
                        <div className="text-sm text-gray-400">{product.description}</div>
                      </div>
                      <div className="font-bold text-blue-300">₹{product.price}</div>
                    </div>
                  ))}

                  {response.treatYourselfItem && (
                    <div className="border-t border-gray-600 pt-3 mt-3">
                      <div className="text-sm font-medium text-purple-300 mb-1">Treat Yourself Bonus:</div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-200">{response.treatYourselfItem.name}</div>
                          <div className="text-sm text-gray-400">{response.treatYourselfItem.description}</div>
                        </div>
                        <div className="font-bold text-purple-300">₹{response.treatYourselfItem.price}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-600 pt-3 mt-3 flex justify-between items-center">
                  <div className="font-bold text-gray-200">Total: ₹{response.totalSpent}</div>
                  <div className="text-sm text-green-400">Saved: ₹{response.remainingBudget}</div>
                </div>
              </div>

              {/* Mood Uplift */}
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-200 mb-2">A little something to lift your spirits:</h4>
                <p className="text-yellow-100 mb-3">{response.moodUplift.content}</p>

                {response.moodUplift.type === "music" && response.moodUplift.link && (
                  <button
                    onClick={openMusicLink}
                    className="flex items-center gap-2 px-3 py-2 bg-yellow-800/50 text-yellow-200 rounded-lg hover:bg-yellow-700/50 transition-all duration-200 border border-yellow-600"
                  >
                    <Music size={16} />
                    Listen Now
                  </button>
                )}
              </div>

              {/* Alternate Mood & Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={sendVirtualHug}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-900/50 text-pink-300 rounded-lg hover:bg-pink-800/50 transition-all duration-200 border border-pink-700"
                >
                  <Heart size={16} />
                  Send Virtual Hug
                </button>

                <button
                  onClick={handleMoodSwap}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-800/50 transition-all duration-200 border border-purple-700"
                >
                  <Smile size={16} />
                  {response.alternateMood}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200 border border-gray-600"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Calm Transition Modal */}
      {showCalmTransition && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[110] overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-3xl shadow-2xl min-h-[500px] border border-gray-700">
            {/* Close button */}
            <button
              onClick={cancelMoodSwap}
              className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gray-200 text-3xl font-bold bg-gray-800/80 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600"
            >
              ×
            </button>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {/* Gentle Waves */}
              <div className="absolute bottom-0 left-0 w-full h-32 opacity-30">
                <svg viewBox="0 0 1200 120" className="w-full h-full">
                  <path
                    d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
                    fill="rgba(59, 130, 246, 0.3)"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="relative z-20 max-h-[80vh] overflow-y-auto p-6 md:p-8">
              <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="bg-gray-800/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl border border-gray-600 w-full">
                  {/* Calm Animation */}
                  <div className="text-6xl md:text-8xl mb-6 animate-bounce">😌</div>

                  <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                    Ready to Find Your Calm?
                  </h2>

                  <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed max-w-lg mx-auto">
                    Sometimes we need to step back and reset our energy. Let's take a moment to breathe, release what's
                    weighing on you, and start fresh with a calmer perspective. You deserve this peaceful moment.
                  </p>

                  {/* Calming Affirmations */}
                  <div className="bg-gradient-to-r from-blue-900/50 to-teal-900/50 rounded-xl p-4 md:p-6 mb-6 border border-blue-700">
                    <h3 className="font-bold text-blue-300 mb-3 text-lg md:text-xl flex items-center justify-center gap-2">
                      <Wind size={20} />
                      Gentle Reminders
                    </h3>
                    <div className="space-y-2 text-sm md:text-base text-blue-200">
                      <p>You are exactly where you need to be</p>
                      <p>This feeling will pass like waves on the shore</p>
                      <p>You have the strength to find peace within</p>
                    </div>
                  </div>

                  {/* Mini Breathing Exercise */}
                  <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-4 md:p-6 mb-6 border border-green-700">
                    <h3 className="font-bold text-green-300 mb-3 text-lg flex items-center justify-center gap-2">
                      <Sparkles size={18} />
                      Take Three Deep Breaths
                    </h3>
                    <div className="text-center">
                      <p className="text-green-200 text-sm md:text-base">
                        Inhale peace... Hold gently... Exhale tension...
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6">
                    <button
                      onClick={confirmMoodSwap}
                      className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105 text-sm md:text-base flex items-center justify-center gap-2"
                    >
                      <Wind size={18} />
                      Yes, Let's Start Fresh
                    </button>
                    <button
                      onClick={cancelMoodSwap}
                      className="px-6 md:px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg transform hover:scale-105 text-sm md:text-base"
                    >
                      Maybe Later
                    </button>
                  </div>

                  {/* Additional Calm Options */}
                  <div className="pt-4 md:pt-6 border-t border-gray-600">
                    <p className="text-xs md:text-sm text-gray-400 mb-3">Quick calm boosters:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => window.open("https://www.youtube.com/watch?v=ZToicYcHIOU", "_blank")}
                        className="px-3 md:px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-800/50 transition-all duration-200 text-xs md:text-sm border border-blue-700"
                      >
                        Ocean Sounds
                      </button>
                      <button
                        onClick={() => alert("Take 5 minutes to step outside and feel the fresh air")}
                        className="px-3 md:px-4 py-2 bg-green-900/50 text-green-300 rounded-lg hover:bg-green-800/50 transition-all duration-200 text-xs md:text-sm border border-green-700"
                      >
                        Fresh Air Break
                      </button>
                      <button
                        onClick={() => alert("Make yourself a warm cup of tea and savor each sip mindfully")}
                        className="px-3 md:px-4 py-2 bg-amber-900/50 text-amber-300 rounded-lg hover:bg-amber-800/50 transition-all duration-200 text-xs md:text-sm border border-amber-700"
                      >
                        Mindful Tea
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Hug Modal */}
      {showHugModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl min-h-[600px] border border-gray-700">
            {/* Close button */}
            <button
              onClick={() => setShowHugModal(false)}
              className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gray-200 text-3xl font-bold bg-gray-800/80 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600"
            >
              ×
            </button>

            {/* Scrollable Content Container */}
            <div className="relative z-20 max-h-[80vh] overflow-y-auto p-4 md:p-8">
              <div className="flex flex-col items-center justify-center text-center min-h-[500px]">
                <div className="bg-gray-800/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl border border-gray-600 w-full">
                  {/* Main Hug Animation */}
                  <div className="text-6xl md:text-8xl mb-6 animate-pulse">🤗</div>

                  <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Sending You a Big Virtual Hug!
                  </h2>

                  <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed max-w-lg mx-auto">
                    You are not alone in this journey. Every challenge you face makes you stronger, and every step you
                    take is progress. Take a deep breath, feel this moment of peace, and remember that you are loved,
                    valued, and capable of amazing things.
                  </p>

                  <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 mb-6 border border-blue-700">
                    <p className="text-blue-200 font-medium italic text-sm md:text-base">
                      "Sometimes the most productive thing you can do is relax." - Mark Black
                    </p>
                  </div>

                  {/* Breathing Exercise */}
                  <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-4 md:p-6 mb-6 border border-green-700">
                    <h3 className="font-bold text-green-300 mb-3 text-lg md:text-xl">Take a Moment to Breathe</h3>
                    {!breathingExercise ? (
                      <div>
                        <p className="text-green-200 mb-4 text-sm md:text-base">
                          Let's do a quick breathing exercise together to center yourself
                        </p>
                        <button
                          onClick={startBreathingExercise}
                          className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg text-sm md:text-base"
                        >
                          Start Breathing Exercise
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">{breathingCount}</div>
                        <div className="text-base md:text-lg text-blue-300 font-medium">
                          {breathingPhase === "inhale" && "Breathe In Slowly..."}
                          {breathingPhase === "hold" && "Hold Gently..."}
                          {breathingPhase === "exhale" && "Breathe Out & Release..."}
                        </div>
                        <div className="mt-4 w-full bg-blue-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${((4 - breathingCount) / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6">
                    <button
                      onClick={() => setShowHugModal(false)}
                      className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl hover:from-pink-700 hover:to-red-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105 text-sm md:text-base"
                    >
                      Thank You
                    </button>
                    <button
                      onClick={() => {
                        setShowHugModal(false)
                        handleMoodSwap()
                      }}
                      className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg transform hover:scale-105 text-sm md:text-base"
                    >
                      I Feel Better Now
                    </button>
                  </div>

                  {/* Additional Comfort Options */}
                  <div className="pt-4 md:pt-6 border-t border-gray-600">
                    <p className="text-xs md:text-sm text-gray-400 mb-3">Need more comfort?</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => window.open("https://www.youtube.com/watch?v=1ZYbU82GVz4", "_blank")}
                        className="px-3 md:px-4 py-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-800/50 transition-all duration-200 text-xs md:text-sm border border-red-700"
                      >
                        Calming Music
                      </button>
                      <button
                        onClick={() => alert("Remember to drink some water and take care of yourself!")}
                        className="px-3 md:px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg hover:bg-blue-800/50 transition-all duration-200 text-xs md:text-sm border border-blue-700"
                      >
                        Self-Care Reminder
                      </button>
                      <button
                        onClick={() => alert("You've got this! Take one small step at a time.")}
                        className="px-3 md:px-4 py-2 bg-green-900/50 text-green-300 rounded-lg hover:bg-green-800/50 transition-all duration-200 text-xs md:text-sm border border-green-700"
                      >
                        Encouragement
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
