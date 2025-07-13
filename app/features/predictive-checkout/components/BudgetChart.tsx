"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import type { BudgetData } from "../types/checkout.types"

interface BudgetChartProps {
  budget: BudgetData
}

export default function BudgetChart({ budget }: BudgetChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Spent", "Remaining"],
        datasets: [
          {
            data: [budget.spent, Math.max(0, budget.remaining)],
            backgroundColor: [
              budget.percentage > 90 ? "#ef4444" : budget.percentage > 70 ? "#f59e0b" : "#10b981", // Keep status colors
              "#e2e8f0", // Light gray for remaining budget (slate-200)
            ],
            borderColor: ["rgba(255, 255, 255, 0.1)"], // Lighter border for light theme
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#4a5568", // Darker text for light theme
              font: {
                size: 12,
              },
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw as number
                return `${label}: ₹${value.toFixed(2)}`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [budget])

  return (
    <div className="relative h-64">
      <canvas ref={chartRef} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-sm text-gray-600">Budget</p>
        <p className="text-2xl font-bold text-gray-900">{budget.percentage.toFixed(0)}%</p>
        <p className="text-sm text-gray-600">used</p>
      </div>
    </div>
  )
}
