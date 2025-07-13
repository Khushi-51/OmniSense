"use client"

import { useState } from "react"
import type { BudgetData } from "../types/checkout.types"
import { BudgetAnalyzer } from "../lib/budget-analysis"
import { TrendingUp, TrendingDown, DollarSign, Target, Lightbulb } from "lucide-react"
import BudgetChart from "./BudgetChart"

interface BudgetMonitorProps {
  budget: BudgetData
}

export default function BudgetMonitor({ budget }: BudgetMonitorProps) {
  const [showTips, setShowTips] = useState(false)

  const status = BudgetAnalyzer.getBudgetStatus(budget)
  const message = BudgetAnalyzer.getBudgetMessage(budget)
  const tips = BudgetAnalyzer.getBudgetTips(budget)

  const getStatusIcon = () => {
    switch (status) {
      case "safe":
        return <TrendingUp className="w-5 h-5 text-green-400" />
      case "warning":
        return <Target className="w-5 h-5 text-yellow-400" />
      case "exceeded":
        return <TrendingDown className="w-5 h-5 text-red-400" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "safe":
        return "bg-green-50 border-green-200 text-green-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "exceeded":
        return "bg-red-50 border-red-200 text-red-800"
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 mx-2 my-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-900 rounded-lg">
            <DollarSign className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Budget Monitor</h2>
            <p className="text-xs text-gray-600">Track your spending in real-time</p>
          </div>
        </div>

        {tips.length > 0 && (
          <button
            onClick={() => setShowTips(!showTips)}
            className="p-1.5 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center mb-4">
        {/* Chart visualization */}
        <div className="relative h-40 w-full flex justify-center">
          <BudgetChart budget={budget} />
        </div>

        {/* Fixed the overlapping text issue */}
        <div className="grid grid-cols-2 gap-3 w-full text-center mt-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Spent</p>
            <p className="text-lg font-bold text-gray-900 break-words">₹{budget.spent.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Remaining</p>
            <p className="text-lg font-bold text-gray-900 break-words">₹{budget.remaining.toFixed(2)}</p>
          </div>
        </div>

        <div className="w-full mt-3 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 flex-shrink-0">Budget Limit:</span>
            <span className="font-semibold text-gray-900 text-right">₹{budget.limit.toFixed(2)}</span>
          </div>

          {budget.savings > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 flex-shrink-0">Total Savings:</span>
              <span className="font-semibold text-green-600 text-right">₹{budget.savings.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 flex-shrink-0">Projected Total (with tax):</span>
            <span className="font-semibold text-gray-900 text-right">₹{budget.projectedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={`p-3 rounded-lg border ${getStatusColor()} mb-3`}>
        <div className="flex items-start space-x-2">
          {getStatusIcon()}
          <div className="flex-1">
            <p className="font-medium text-xs mb-1">Budget Status</p>
            <p className="text-xs leading-relaxed">{message}</p>
          </div>
        </div>
      </div>

      {showTips && tips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center text-sm">
            <Lightbulb className="w-3 h-3 mr-1" />
            Smart Shopping Tips
          </h4>
          <ul className="space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="text-xs text-blue-700 flex items-start">
                <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
