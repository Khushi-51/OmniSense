import termData from "../data.json"
import type { Term, ExplanationResponse } from "../types/ter.types"

// Mock OpenAI API response
const mockAIExplanation = async (term: string): Promise<ExplanationResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    term,
    explanation: `${term} is a product term that refers to specific characteristics or benefits. This is a mock explanation generated when the term isn't found in our local database.`,
    simpleExplanation: `${term} is something special about a product that makes it different from regular ones!`,
    source: "ai",
  }
}

export const explainTerm = async (searchTerm: string): Promise<ExplanationResponse> => {
  const normalizedTerm = searchTerm.toLowerCase().trim()

  // First, try to find in local data
  const localTerm = termData.terms.find(
    (term: Term) =>
      term.name.toLowerCase() === normalizedTerm ||
      term.name.toLowerCase().includes(normalizedTerm) ||
      normalizedTerm.includes(term.name.toLowerCase()),
  )

  if (localTerm) {
    return {
      term: localTerm.name,
      explanation: localTerm.explanation,
      simpleExplanation: localTerm.simpleExplanation,
      source: "local",
    }
  }

  // Fallback to mock AI explanation
  return await mockAIExplanation(searchTerm)
}

export const getRandomTip = (): string => {
  const tips = [
    "💧 Today's Tip: Drink more water throughout the day!",
    "🥗 Today's Tip: Add colorful vegetables to your meals!",
    "🚶 Today's Tip: Take a 10-minute walk after eating!",
    "😴 Today's Tip: Get 7-8 hours of sleep for better health!",
    "🧘 Today's Tip: Take 5 deep breaths when you feel stressed!",
    "🍎 Today's Tip: Choose whole fruits over fruit juices!",
    "📱 Today's Tip: Take breaks from screens every hour!",
    "💝 Today's Tip: Practice self-compassion - treat yourself kindly!",
    "🤗 Today's Tip: Reach out to someone you care about!",
    "🌱 Today's Tip: Take a moment to appreciate something beautiful today!",
  ]

  return tips[Math.floor(Math.random() * tips.length)]
}

export const getAllTerms = (): Term[] => {
  return termData.terms
}
