"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Play,
  Github,
  Award,
  Heart,
  Eye,
  Mic,
  ShoppingCart,
  Users,
  MessageSquare,
  ExternalLink,
  CheckCircle,
  Lightbulb,
  Rocket,
} from "lucide-react"
import Link from "next/link"

const featuresData = [
  {
    icon: <Heart className="w-8 h-8 text-cyan-400" />,
    title: "Product Explainer",
    description: "Get instant product information and mood-based suggestions using AI.",
    href: "/features/product-explainer",
    glance: "Speak or scan any product and get details instantly.",
  },
  {
    icon: <Eye className="w-8 h-8 text-cyan-400" />,
    title: "AR Mood Detection",
    description: "Shop with emotion-aware AR that adapts to your mood.",
    href: "/features/ar-mood-detection",
    glance: "Camera detects your emotion, AR tailors your shopping.",
  },
  {
    icon: <Mic className="w-8 h-8 text-cyan-400" />,
    title: "Voice-to-Vision",
    description: "Navigate using your voice with AR overlays and haptic feedback.",
    href: "/features/voice-to-vision",
    glance: "Voice guide and tactile cues for hands-free navigation.",
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-cyan-400" />,
    title: "Predictive Checkout",
    description: "Smart, accessible checkout with budget tracking and suggestions.",
    href: "/features/predictive-checkout",
    glance: "Checkout with spend tracking and AI suggestions.",
  },
]

const issuesList = [
  {
    title: "Product info not reading on some items",
    author: "user123",
    comments: 3,
    url: "#",
    status: "open",
  },
  {
    title: "Add support for dark mode",
    author: "blindcoder",
    comments: 2,
    url: "#",
    status: "open",
  },
  {
    title: "Checkout budget limit too low",
    author: "visionary",
    comments: 1,
    url: "#",
    status: "closed",
  },
]

const recentActivity = [
  {
    type: "update",
    message: "Improved AR Mood Detection accuracy",
    user: "Kritika",
    time: "2 hours ago",
  },
  {
    type: "feature",
    message: "Voice-to-Vision now supports Hindi commands",
    user: "Harpuneet",
    time: "1 day ago",
  },
  {
    type: "bug",
    message: "Fixed checkout crash bug on mobile",
    user: "Khushi",
    time: "3 days ago",
  },
]

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700 py-4 px-4 md:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-cyan-400" />
          <span className="text-lg font-bold text-white">OmniSense</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#community" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Community
          </Link>
          <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-gray-300 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </motion.a>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative h-[calc(100vh-64px)] flex items-center justify-center text-center overflow-hidden px-4 md:px-8 lg:px-12">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-90 z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              OmniSense: <span className="text-cyan-400">Shopping, Reimagined</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            >
              AI-powered assistant for accessible independence. Voice, emotion, AR – all in sync, for everyone.
            </motion.p>
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
            >
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 bg-transparent"
              >
                <Github className="w-5 h-5 mr-2" />
                Source Code
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section className="py-16 px-4 md:px-8 lg:px-12 bg-gray-800">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Card className="bg-gray-700 border border-gray-600 text-gray-200 p-6 rounded-lg shadow-xl h-full">
                <CardContent className="p-0">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-7 h-7 text-yellow-400" /> Problem
                  </h2>
                  <p className="text-base leading-relaxed">
                    Visually impaired shoppers struggle to get instant product information, navigate stores, and manage
                    purchases independently and confidently. This leads to frustration and limits their shopping
                    experience.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeIn}>
              <Card className="bg-gray-700 border border-gray-600 text-gray-200 p-6 rounded-lg shadow-xl h-full">
                <CardContent className="p-0">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                    <Rocket className="w-7 h-7 text-green-400" /> Solution
                  </h2>
                  <p className="text-base leading-relaxed">
                    OmniSense uses cutting-edge AI, AR, and intuitive voice interfaces to provide real-time product
                    info, emotion-based suggestions, hands-free navigation, and smart checkout. Our platform is built
                    for accessibility, fostering independence and a delightful shopping experience for everyone.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 md:px-8 lg:px-12 bg-gray-900">
          <motion.h2
            className="text-4xl font-bold text-center text-white mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            Key <span className="text-cyan-400">Features</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {featuresData.map((feature, idx) => (
              <motion.div
                key={feature.title}
                className="relative group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeIn}
              >
                <Card className="bg-gray-800 border border-gray-700 text-gray-200 p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:border-cyan-500 h-full flex flex-col justify-between min-h-[220px]">
                  <CardContent className="p-0 flex flex-col items-center text-center flex-grow">
                    <div className="mb-4 p-3 rounded-full bg-gray-700 group-hover:bg-cyan-500 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{feature.glance}</p>
                    <Link href={feature.href} className="mt-auto">
                      <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out">
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Community/Recent Activity Section */}
        <section id="community" className="py-16 px-4 md:px-8 lg:px-12 bg-gray-800">
          <motion.h2
            className="text-4xl font-bold text-center text-white mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            Join Our <span className="text-cyan-400">Community</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeIn}>
              <Card className="bg-gray-700 border border-gray-600 text-gray-200 p-6 rounded-lg shadow-xl h-full">
                <CardContent className="p-0">
                  <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-white">
                    <MessageSquare className="w-6 h-6 text-cyan-400" /> Recent Discussions
                  </h3>
                  <ul className="space-y-4">
                    {issuesList.map((issue, i) => (
                      <li key={i} className="border-b border-gray-600 pb-3 last:border-b-0">
                        <Link href={issue.url} className="block hover:text-cyan-400 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-lg">{issue.title}</span>
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                issue.status === "open" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                              }`}
                            >
                              {issue.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-400 gap-4">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" /> {issue.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" /> {issue.comments} comments
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeIn}>
              <Card className="bg-gray-700 border border-gray-600 text-gray-200 p-6 rounded-lg shadow-xl h-full">
                <CardContent className="p-0">
                  <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 text-white">
                    <CheckCircle className="w-6 h-6 text-purple-400" /> Latest Updates
                  </h3>
                  <ul className="space-y-4">
                    {recentActivity.map((act, i) => (
                      <li key={i} className="border-b border-gray-600 pb-3 last:border-b-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-lg">{act.message}</span>
                          <Badge
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              act.type === "update"
                                ? "bg-blue-500"
                                : act.type === "feature"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            } text-white`}
                          >
                            {act.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          By <span className="font-medium">{act.user}</span>, {act.time}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4 md:px-8 lg:px-12 text-gray-400 text-center border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-6 mb-4 font-semibold flex-wrap">
            {featuresData.map((f) => (
              <Link key={f.title} href={f.href} className="hover:text-white transition-colors">
                {f.title}
              </Link>
            ))}
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a href="#" whileHover={{ scale: 1.1 }} className="text-gray-400 hover:text-white transition-colors">
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          </div>
          <div className="text-sm">&copy; 2024 OmniSense. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
