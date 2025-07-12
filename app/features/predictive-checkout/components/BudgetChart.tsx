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
              budget.percentage > 90 ? "#ef4444" : budget.percentage > 70 ? "#f59e0b" : "#10b981",
              "#1e293b",
            ],
            borderColor: ["rgba(0, 0, 0, 0.1)"],
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
              color: "#e2e8f0",
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
        <p className="text-sm text-gray-400">Budget</p>
        <p className="text-2xl font-bold text-white">{budget.percentage.toFixed(0)}%</p>
        <p className="text-sm text-gray-400">used</p>
      </div>
    </div>
  )
}
