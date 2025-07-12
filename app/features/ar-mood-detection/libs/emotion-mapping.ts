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
    tired: {
      message: "You look tired — here are some cozy comfort items:",
      products: [
        {
          name: "Ultra Soft Blanket",
          description: "Wrap yourself in comfort and warmth",
          price: 39.99,
          category: "Home & Living",
          rating: 4.9,
          emoji: "🛋️",
        },
        {
          name: "Chamomile Tea Set",
          description: "Relaxing herbal blend for better sleep",
          price: 18.99,
          category: "Wellness",
          rating: 4.7,
          emoji: "🍵",
        },
        {
          name: "Memory Foam Pillow",
          description: "For the perfect night's rest",
          price: 49.99,
          category: "Sleep",
          rating: 4.8,
          emoji: "😴",
        },
      ],
    },
    focused: {
      message: "Today you're: Focused Monk 😌 — productivity items for you:",
      products: [
        {
          name: "Minimalist Desk Organizer",
          description: "Keep your workspace clean and focused",
          price: 34.99,
          category: "Office",
          rating: 4.7,
          emoji: "📝",
        },
        {
          name: "Noise-Canceling Headphones",
          description: "Block distractions, enhance focus",
          price: 199.99,
          category: "Electronics",
          rating: 4.9,
          emoji: "🎧",
        },
        {
          name: "Productivity Planner",
          description: "Organize your thoughts and goals",
          price: 22.99,
          category: "Stationery",
          rating: 4.6,
          emoji: "📅",
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
  }

  return suggestionMap[emotion] || suggestionMap.neutral
}
