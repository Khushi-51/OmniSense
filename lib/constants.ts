export const FEATURES = [
  {
    id: "empathy-engine",
    title: "AI-Powered Empathy Engine",
    description: "Smart assistant that understands user mood and provides caring suggestions",
    icon: "🧠",
    href: "/features/empathy-engine",
    developer: "Team Member 1",
    status: "development" as const,
  },
  {
    id: "ar-mood-detection",
    title: "AR/VR Mood Detection",
    description: "Face scanning for personalized shopping experience",
    icon: "📱",
    href: "/features/ar-mood-detection",
    developer: "Khushi",
    status: "development" as const,
  },
  {
    id: "voice-to-vision",
    title: "Voice-to-Vision Mode",
    description: "Voice commands for visually impaired shopping",
    icon: "🗣️",
    href: "/features/voice-to-vision",
    developer: "Harpuneet",
    status: "development" as const,
  },
  {
    id: "predictive-checkout",
    title: "Predictive Checkout Concierge",
    description: "Smart checkout with budget and preference tracking",
    icon: "🛒",
    href: "/features/predictive-checkout",
    developer: "Kritika",
    status: "development" as const,
  },
  {
    id: "planet-points",
    title: "Planet Points",
    description: "Eco-friendly shopping rewards system",
    icon: "🌍",
    href: "/features/planet-points",
    developer: "Team Member 1 + Khushi",
    status: "development" as const,
  },
] as const

export const PROJECT_INFO = {
  name: "VisionAI Shop",
  description: "LLM Assistant for Visually Impaired Shoppers",
  version: "1.0.0",
  repository: "https://github.com/your-team/visionai-shop",
} as const
