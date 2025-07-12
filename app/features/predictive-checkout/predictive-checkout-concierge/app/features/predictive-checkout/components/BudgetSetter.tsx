"use client"

import { useState } from "react"
import { BudgetAnalyzer } from "../lib/budget-analysis"
import { Target, Check, X } from "lucide-react"

interface BudgetSetterProps {
  onBudgetSet: (budget: number) => void
  currentBudget: number
}

export default function BudgetSetter({ onBudgetSet, currentBudget }: BudgetSetterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [budgetInput, setBudgetInput] = useState(currentBudget.toString())

  const handleSaveBudget = () => {
    const newBudget = Number(budgetInput)
    if (newBudget > 0) {
      BudgetAnalyzer.setBudgetLimit(newBudget)
      onBudgetSet(newBudget)
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setBudgetInput(currentBudget.toString())
    setIsOpen(false)
  }

  const presetBudgets = [500, 1000, 2000, 5000, 10000]

  return (
    <>
      {/* Budget Setting Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-gray-700"
      >
        <Target className="w-4 h-4" />
        <span className="text-sm">Set Budget: ₹{currentBudget}</span>
      </button>

      {/* Budget Setting Modal - Fixed z-index and positioning */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleCancel} />
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-2xl relative z-[10000] w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-900 rounded-lg">
                  <Target className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-white">Set Your Budget</h3>
              </div>
              <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Enter your shopping budget (₹)</label>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Quick presets:</p>
                <div className="grid grid-cols-3 gap-2">
                  {presetBudgets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setBudgetInput(preset.toString())}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        budgetInput === preset.toString()
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBudget}
                  disabled={!budgetInput || Number(budgetInput) <= 0}
                  className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  <span>Set Budget</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
