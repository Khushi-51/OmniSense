"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import "./globals.css"
import {
  ArrowRight,
  Play,
  Github,
  ExternalLink,
  Award,
  Users,
  Zap,
  Heart,
  Eye,
  Mic,
  ShoppingCart,
  Leaf,
  Star,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  // ...existing code...
return (
  <div className="min-h-screen overflow-hidden">
    {/* Hero Section */}
    <section className="relative min-h-screen flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden"></div>
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Hackathon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Badge className="px-6 py-2 text-lg font-bold">
            <Award className="w-5 h-5 mr-2" />
            2025
          </Badge>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          OmniSense
        </motion.h1>

        {/* Animated Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <p className="text-xl md:text-2xl mb-4">Empowering Visually Impaired Shoppers with</p>
          <div className="text-3xl md:text-4xl font-bold">
            AI-Powered Shopping Assistant
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Revolutionary LLM assistant that combines voice commands, emotion detection, and AR guidance to make
          shopping accessible, independent, and delightful for everyone.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div {...scaleOnHover}>
            <Button size="lg" className="px-8 py-4 text-lg font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Try Live Demo
            </Button>
          </motion.div>
          <motion.div {...scaleOnHover}>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
              <Github className="w-5 h-5 mr-2" />
              View Source
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* About Section */}
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Problem We Solve
          </h2>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed">
            Over 285 million people worldwide are visually impaired, facing daily challenges in independent shopping.
            Traditional shopping experiences lack accessibility, forcing dependence on others and limiting personal
            autonomy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="p-8 rounded-2xl border backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">Current Challenges</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3"></span>Lack of product information accessibility
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3"></span>Difficulty navigating store layouts
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3"></span>Dependence on others for shopping
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3"></span>Limited personalized recommendations
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="p-8 rounded-2xl border backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3"></span>Voice-activated shopping assistant
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3"></span>AR guidance for product location
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3"></span>Emotion-aware recommendations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-3"></span>Complete shopping independence
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Key Features */}
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Revolutionary Features
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Five groundbreaking AI-powered features that transform the shopping experience
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <Heart className="w-8 h-8" />,
              title: "Empathy Engine",
              description:
                "AI detects your mood and provides caring, personalized suggestions with emotional intelligence.",
              href: "/features/empathy-engine",
            },
            {
              icon: <Eye className="w-8 h-8" />,
              title: "AR Mood Detection",
              description:
                "Camera-based emotion recognition for personalized shopping experiences based on your feelings.",
              href: "/features/ar-mood-detection",
            },
            {
              icon: <Mic className="w-8 h-8" />,
              title: "Voice-to-Vision",
              description: "Voice commands with AR guidance and haptic feedback for complete accessibility.",
              href: "/features/voice-to-vision",
            },
            {
              icon: <ShoppingCart className="w-8 h-8" />,
              title: "Predictive Checkout",
              description:
                "Smart checkout concierge that tracks preferences, budget, and suggests perfect additions.",
              href: "/features/predictive-checkout",
            },
            {
              icon: <Leaf className="w-8 h-8" />,
              title: "Planet Points",
              description: "Eco-friendly rewards system that gamifies sustainable shopping choices.",
              href: "/features/planet-points",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Link href={feature.href}>
                <Card className="hover:border transition-all duration-300 backdrop-blur-sm group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:underline transition-colors">
                      {feature.title}
                    </h3>
                    <p>{feature.description}</p>
                    <div className="mt-4 flex items-center group-hover:underline">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Simple, intuitive workflow designed for maximum accessibility and independence
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full rounded-full hidden md:block"></div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Voice Activation",
                description: "Simply speak your shopping needs - 'Find gluten-free snacks under ₹200'",
                icon: <Mic className="w-6 h-6" />,
                side: "left",
              },
              {
                step: "02",
                title: "AI Processing",
                description: "Our empathy engine analyzes your mood and preferences for personalized suggestions",
                icon: <Zap className="w-6 h-6" />,
                side: "right",
              },
              {
                step: "03",
                title: "AR Guidance",
                description: "Get visual and haptic guidance to locate products with precise directions",
                icon: <Eye className="w-6 h-6" />,
                side: "left",
              },
              {
                step: "04",
                title: "Smart Checkout",
                description:
                  "Predictive checkout suggests additional items while tracking your budget and preferences",
                icon: <ShoppingCart className="w-6 h-6" />,
                side: "right",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: item.side === "left" ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center ${item.side === "right" ? "md:flex-row-reverse" : ""}`}
              >
                <div className={`flex-1 ${item.side === "right" ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <div className="p-6 rounded-2xl border backdrop-blur-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <span className="font-bold text-sm">STEP {item.step}</span>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </div>
                {/* Timeline Dot */}
                <div className="hidden md:block w-4 h-4 rounded-full border-4 relative z-10"></div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powered by Modern Tech
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Built with cutting-edge technologies for performance, scalability, and accessibility
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8"
        >
          {[
            { name: "Next.js", icon: "⚛️" },
            { name: "OpenAI", icon: "🤖" },
            { name: "Tailwind", icon: "🎨" },
            { name: "Framer Motion", icon: "🎭" },
            { name: "TypeScript", icon: "📘" },
            { name: "Vercel", icon: "▲" },
          ].map((tech, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-6 rounded-2xl border backdrop-blur-sm text-center group cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{tech.icon}</div>
              <h3 className="font-semibold group-hover:underline transition-colors">{tech.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Team Section */}
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Our Team
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Passionate developers and designers committed to making technology accessible for everyone
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              name: "Kritika",
              role: "AI/ML Engineer",
              feature: "Predictive Checkout",
              avatar: "👩‍💻",
              github: "#",
              linkedin: "#",
            },
            {
              name: "Khushi",
              role: "Frontend Developer",
              feature: "AR Mood Detection",
              avatar: "👩‍🎨",
              github: "#",
              linkedin: "#",
            },
            {
              name: "Harpuneet",
              role: "Voice Tech Specialist",
              feature: "Voice-to-Vision",
              avatar: "👨‍💻",
              github: "#",
              linkedin: "#",
            },
            {
              name: "Team Lead",
              role: "Full Stack Developer",
              feature: "System Architecture",
              avatar: "👨‍🚀",
              github: "#",
              linkedin: "#",
            },
          ].map((member, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="hover:border transition-all duration-300 backdrop-blur-sm group">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{member.avatar}</div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="font-medium mb-2">{member.role}</p>
                  <p className="text-sm mb-4">Working on {member.feature}</p>
                  <div className="flex justify-center space-x-4">
                    <motion.a
                      href={member.github}
                      whileHover={{ scale: 1.2 }}
                      className="transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href={member.linkedin}
                      whileHover={{ scale: 1.2 }}
                      className="transition-colors"
                    >
                      <Users className="w-5 h-5" />
                    </motion.a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="p-12 rounded-3xl border backdrop-blur-sm"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already shopping with complete independence and confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div {...scaleOnHover}>
              <Button size="lg" className="px-8 py-4 text-lg font-semibold">
                <Play className="w-5 h-5 mr-2" />
                Try Live Demo
              </Button>
            </motion.div>
            <motion.div {...scaleOnHover}>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                <ExternalLink className="w-5 h-5 mr-2" />
                View Project
              </Button>
            </motion.div>
          </div>

          <div className="mt-8 flex justify-center items-center space-x-6 text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span>Hackathon Winner</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>1000+ Users</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span>Accessibility First</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 px-4 border-t">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              VisionAI Shop
            </h3>
            <p className="mb-4 max-w-md">
              Making shopping accessible and independent for visually impaired users through AI-powered assistance.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="transition-colors"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="transition-colors"
              >
                <ExternalLink className="w-6 h-6" />
              </motion.a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features/empathy-engine" className="transition-colors">
                  Empathy Engine
                </Link>
              </li>
              <li>
                <Link href="/features/ar-mood-detection" className="transition-colors">
                  AR Mood Detection
                </Link>
              </li>
              <li>
                <Link href="/features/voice-to-vision" className="transition-colors">
                  Voice-to-Vision
                </Link>
              </li>
              <li>
                <Link href="/features/predictive-checkout" className="transition-colors">
                  Predictive Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p>&copy; 2024 VisionAI Shop. Built with ❤️ for accessibility. Hackathon Winner 2024.</p>
        </div>
      </div>
    </footer>
  </div>
)
}
