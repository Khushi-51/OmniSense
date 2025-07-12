export function getMoodEmoji(emotion: string): string {
  const emojiMap: { [key: string]: string } = {
    happy: "😄",
    sad: "😢",
    angry: "😠",
    surprised: "😲",
    fearful: "😨",
    disgusted: "🤢",
    neutral: "😐",
    focused: "😌",
    tired: "😴",
    bored: "😑",
  }

  return emojiMap[emotion] || "😐"
}

export function getMoodDescription(emotion: string): string {
  const descriptions: { [key: string]: string } = {
    happy: "You're radiating positive energy! Perfect time for some retail therapy.",
    sad: "Feeling a bit down? Let's find something to brighten your day.",
    angry: "Take a deep breath. Maybe some stress-relief items could help.",
    surprised: "You look amazed! Discover something equally surprising.",
    fearful: "Feeling anxious? Let's find some comfort items for you.",
    disgusted: "Not feeling it today? Let's find something more appealing.",
    neutral: "Calm and collected. Perfect for thoughtful shopping decisions.",
    focused: "You're in the zone! Great time for productive purchases.",
    tired: "Looking sleepy? Time for some cozy comfort items.",
    bored: "Need some excitement? Let's spice things up!",
  }

  return descriptions[emotion] || "Let's find something perfect for your current vibe."
}

export function getAdvancedProductSuggestions(mood: string, confidence: number) {
  const baseProducts = getProductSuggestions(mood)

  // Enhanced product data with mood matching scores
interface BaseProduct {
    name: string
    description: string
    price: number
    category: string
    rating: number
    emoji: string
}

interface EnhancedProduct extends BaseProduct {
    moodMatch: number
    originalPrice: number
    discount: number
    reviews: number
}

const enhancedProducts: EnhancedProduct[] = baseProducts.products.map((product: BaseProduct): EnhancedProduct => ({
    ...product,
    moodMatch: Math.round(confidence * 100 * (0.8 + Math.random() * 0.2)), // 80-100% based on confidence
    originalPrice: product.price * 1.2, // Show discount
    discount: Math.round(10 + Math.random() * 20), // 10-30% discount
    reviews: Math.round(50 + Math.random() * 500), // 50-550 reviews
}))

  const moodCategories = {
    happy: {
      categories: [
        {
          name: "Celebration & Fun",
          icon: "🎉",
          description: "Items to amplify your joy",
          products: [
            {
              name: "Party Snack Variety Pack",
              description: "Gourmet snacks perfect for sharing your happiness",
              price: 24.99,
              originalPrice: 29.99,
              category: "Food & Drinks",
              rating: 4.8,
              emoji: "🍿",
              moodMatch: 95,
              reviews: 234,
              discount: 17,
            },
            {
              name: "Bluetooth Party Speaker",
              description: "Portable speaker to share your favorite tunes",
              price: 79.99,
              originalPrice: 99.99,
              category: "Electronics",
              rating: 4.7,
              emoji: "🔊",
              moodMatch: 92,
              reviews: 456,
              discount: 20,
            },
          ],
        },
        {
          name: "Fashion & Style",
          icon: "👗",
          description: "Express your vibrant mood",
          products: [
            {
              name: "Colorful Summer Dress",
              description: "Bright and cheerful outfit to match your energy",
              price: 45.99,
              originalPrice: 59.99,
              category: "Fashion",
              rating: 4.6,
              emoji: "👗",
              moodMatch: 88,
              reviews: 189,
              discount: 23,
            },
          ],
        },
        {
          name: "Experiences",
          icon: "🎪",
          description: "Create lasting memories",
          products: [
            {
              name: "Adventure Experience Voucher",
              description: "Choose from skydiving, cooking classes, or wine tasting",
              price: 149.99,
              originalPrice: 199.99,
              category: "Experiences",
              rating: 4.9,
              emoji: "🎪",
              moodMatch: 97,
              reviews: 78,
              discount: 25,
            },
          ],
        },
      ],
      featured: [
        {
          name: "Happiness Starter Kit",
          description: "Curated bundle of mood-boosting items including aromatherapy, snacks, and a gratitude journal",
          price: 89.99,
          originalPrice: 119.99,
          rating: 4.9,
          emoji: "🌈",
          moodMatch: 98,
          reviews: 567,
          discount: 25,
        },
        {
          name: "Social Gathering Essentials",
          description: "Everything you need to host the perfect get-together with friends and family",
          price: 134.99,
          originalPrice: 169.99,
          rating: 4.8,
          emoji: "🎊",
          moodMatch: 94,
          reviews: 234,
          discount: 21,
        },
      ],
    },
    sad: {
      categories: [
        {
          name: "Comfort & Wellness",
          icon: "🤗",
          description: "Items to lift your spirits",
          products: [
            {
              name: "Weighted Comfort Blanket",
              description: "Therapeutic blanket designed to reduce anxiety and promote calm",
              price: 59.99,
              originalPrice: 79.99,
              category: "Wellness",
              rating: 4.8,
              emoji: "🛋️",
              moodMatch: 93,
              reviews: 445,
              discount: 25,
            },
            {
              name: "Mood-Boosting Tea Collection",
              description: "Herbal teas specifically blended to improve mood and energy",
              price: 29.99,
              originalPrice: 39.99,
              category: "Wellness",
              rating: 4.7,
              emoji: "🍵",
              moodMatch: 89,
              reviews: 267,
              discount: 25,
            },
          ],
        },
        {
          name: "Self-Care",
          icon: "💆",
          description: "Pamper yourself",
          products: [
            {
              name: "Luxury Bath Bomb Set",
              description: "Aromatherapy bath bombs with essential oils for relaxation",
              price: 34.99,
              originalPrice: 44.99,
              category: "Beauty",
              rating: 4.6,
              emoji: "🛁",
              moodMatch: 87,
              reviews: 189,
              discount: 22,
            },
          ],
        },
        {
          name: "Inspiration",
          icon: "📚",
          description: "Uplifting content",
          products: [
            {
              name: "Motivational Book Collection",
              description: "Bestselling books about resilience, hope, and personal growth",
              price: 49.99,
              originalPrice: 69.99,
              category: "Books",
              rating: 4.9,
              emoji: "📖",
              moodMatch: 91,
              reviews: 334,
              discount: 29,
            },
          ],
        },
      ],
      featured: [
        {
          name: "Complete Comfort Care Package",
          description: "Everything you need for a cozy self-care day including blanket, tea, candles, and journal",
          price: 124.99,
          originalPrice: 159.99,
          rating: 4.9,
          emoji: "💝",
          moodMatch: 96,
          reviews: 423,
          discount: 22,
        },
        {
          name: "Mindfulness & Meditation Kit",
          description: "Guided meditation app subscription, essential oils, and meditation cushion",
          price: 79.99,
          originalPrice: 99.99,
          rating: 4.8,
          emoji: "🧘",
          moodMatch: 92,
          reviews: 298,
          discount: 20,
        },
      ],
    },
    neutral: {
      categories: [
        {
          name: "Productivity",
          icon: "💼",
          description: "Enhance your efficiency",
          products: [
            {
              name: "Smart Desk Organizer",
              description: "Wireless charging station with compartments for all your essentials",
              price: 69.99,
              originalPrice: 89.99,
              category: "Office",
              rating: 4.7,
              emoji: "📱",
              moodMatch: 85,
              reviews: 234,
              discount: 22,
            },
          ],
        },
        {
          name: "Lifestyle",
          icon: "🏠",
          description: "Everyday essentials",
          products: [
            {
              name: "Minimalist Water Bottle",
              description: "Insulated stainless steel bottle with temperature display",
              price: 39.99,
              originalPrice: 49.99,
              category: "Lifestyle",
              rating: 4.6,
              emoji: "💧",
              moodMatch: 82,
              reviews: 567,
              discount: 20,
            },
          ],
        },
        {
          name: "Learning",
          icon: "🎓",
          description: "Expand your knowledge",
          products: [
            {
              name: "Online Course Bundle",
              description: "Access to premium courses in business, technology, and creativity",
              price: 99.99,
              originalPrice: 149.99,
              category: "Education",
              rating: 4.8,
              emoji: "💻",
              moodMatch: 88,
              reviews: 445,
              discount: 33,
            },
          ],
        },
      ],
      featured: [
        {
          name: "Productivity Starter Pack",
          description: "Desk organizer, planner, noise-canceling headphones, and productivity app subscriptions",
          price: 199.99,
          originalPrice: 249.99,
          rating: 4.8,
          emoji: "⚡",
          moodMatch: 90,
          reviews: 334,
          discount: 20,
        },
        {
          name: "Balanced Lifestyle Kit",
          description: "Curated items for work-life balance including wellness tracker and relaxation tools",
          price: 149.99,
          originalPrice: 189.99,
          rating: 4.7,
          emoji: "⚖️",
          moodMatch: 86,
          reviews: 267,
          discount: 21,
        },
      ],
    },
  }

  const defaultData = {
    categories: [
      {
        name: "General Recommendations",
        icon: "🛍️",
        description: "Popular items for any mood",
        products: enhancedProducts.slice(0, 3),
      },
    ],
    featured: enhancedProducts.slice(0, 2),
  }

  const moodData = moodCategories[mood as keyof typeof moodCategories] || defaultData

  return {
    message: `Based on your ${mood} mood with ${Math.round(confidence * 100)}% confidence, here are perfectly matched products:`,
    products: enhancedProducts,
    ...moodData,
  }
}

export function getProductSuggestions(emotion: string) {
  const suggestionMap: { [key: string]: any } = {
    happy: {
      message: "You're glowing! Here are some items to celebrate your good vibes:",
      products: [
        {
          name: "Party Snack Mix",
          description: "Perfect for sharing your happiness with friends",
          price: 12.99,
          category: "Food & Drinks",
          rating: 4.8,
          emoji: "🍿",
        },
        {
          name: "Colorful Phone Case",
          description: "Bright and cheerful, just like your mood",
          price: 24.99,
          category: "Accessories",
          rating: 4.6,
          emoji: "📱",
        },
        {
          name: "Feel-Good Playlist Vinyl",
          description: "Upbeat tunes to match your energy",
          price: 29.99,
          category: "Music",
          rating: 4.9,
          emoji: "🎵",
        },
      ],
    },
    sad: {
      message: "Sending you comfort — these might help brighten your day:",
      products: [
        {
          name: "Comfort Food Bundle",
          description: "Your favorite treats to lift your spirits",
          price: 27.99,
          category: "Food",
          rating: 4.8,
          emoji: "🍫",
        },
        {
          name: "Aromatherapy Candle",
          description: "Soothing scents to calm your mind",
          price: 19.99,
          category: "Wellness",
          rating: 4.7,
          emoji: "🕯️",
        },
        {
          name: "Inspirational Book",
          description: "Uplifting stories to restore hope",
          price: 16.99,
          category: "Books",
          rating: 4.9,
          emoji: "📚",
        },
      ],
    },
    neutral: {
      message: "Balanced and thoughtful — here are some versatile picks:",
      products: [
        {
          name: "Multi-Purpose Backpack",
          description: "Practical and stylish for any occasion",
          price: 79.99,
          category: "Bags",
          rating: 4.8,
          emoji: "🎒",
        },
        {
          name: "Wireless Charger",
          description: "Convenient charging for your devices",
          price: 29.99,
          category: "Tech",
          rating: 4.6,
          emoji: "🔋",
        },
        {
          name: "Classic White Sneakers",
          description: "Timeless style that goes with everything",
          price: 89.99,
          category: "Footwear",
          rating: 4.7,
          emoji: "👟",
        },
      ],
    },
    angry: {
      message: "Channel that energy positively with these stress-relief items:",
      products: [
        {
          name: "Stress Relief Punching Bag",
          description: "Safe way to release tension and anger",
          price: 49.99,
          category: "Fitness",
          rating: 4.5,
          emoji: "🥊",
        },
        {
          name: "Meditation App Subscription",
          description: "Guided sessions to find inner peace",
          price: 9.99,
          category: "Wellness",
          rating: 4.8,
          emoji: "🧘",
        },
        {
          name: "Calming Essential Oils",
          description: "Lavender and chamomile to soothe your mind",
          price: 24.99,
          category: "Aromatherapy",
          rating: 4.7,
          emoji: "🌿",
        },
      ],
    },
    surprised: {
      message: "Keep that sense of wonder alive with these exciting finds:",
      products: [
        {
          name: "Mystery Box Subscription",
          description: "Monthly surprises delivered to your door",
          price: 39.99,
          category: "Subscription",
          rating: 4.6,
          emoji: "📦",
        },
        {
          name: "Science Experiment Kit",
          description: "Discover amazing reactions and phenomena",
          price: 34.99,
          category: "Education",
          rating: 4.8,
          emoji: "🔬",
        },
        {
          name: "Adventure Travel Guide",
          description: "Plan your next unexpected journey",
          price: 22.99,
          category: "Travel",
          rating: 4.7,
          emoji: "🗺️",
        },
      ],
    },
    fearful: {
      message: "Find comfort and security with these reassuring items:",
      products: [
        {
          name: "Security Night Light",
          description: "Gentle illumination for peaceful sleep",
          price: 19.99,
          category: "Home",
          rating: 4.6,
          emoji: "💡",
        },
        {
          name: "Anxiety Relief Tea",
          description: "Herbal blend to calm nerves naturally",
          price: 14.99,
          category: "Wellness",
          rating: 4.8,
          emoji: "🍵",
        },
        {
          name: "Comfort Plush Toy",
          description: "Soft companion for emotional support",
          price: 29.99,
          category: "Comfort",
          rating: 4.9,
          emoji: "🧸",
        },
      ],
    },
    disgusted: {
      message: "Refresh and cleanse with these purifying products:",
      products: [
        {
          name: "Air Purifier",
          description: "Clean, fresh air for your living space",
          price: 89.99,
          category: "Home",
          rating: 4.7,
          emoji: "🌬️",
        },
        {
          name: "Detox Tea Collection",
          description: "Cleansing herbal teas for body and mind",
          price: 24.99,
          category: "Wellness",
          rating: 4.5,
          emoji: "🍃",
        },
        {
          name: "Organic Skincare Set",
          description: "Pure, natural ingredients for healthy skin",
          price: 45.99,
          category: "Beauty",
          rating: 4.8,
          emoji: "🧴",
        },
      ],
    },
  }

  return suggestionMap[emotion] || suggestionMap.neutral
}
