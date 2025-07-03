"use client"

import { motion } from "framer-motion"

export default function StatsCard({ title, value, icon: Icon, color, change, loading }) {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-600 bg-blue-50",
    green: "bg-green-500 text-green-600 bg-green-50",
    orange: "bg-orange-500 text-orange-600 bg-orange-50",
    purple: "bg-purple-500 text-purple-600 bg-purple-50",
    red: "bg-red-500 text-red-600 bg-red-50",
  }

  const [bgColor, textColor, lightBg] = colorClasses[color]?.split(" ") || colorClasses.blue.split(" ")

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="mt-4 h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-6 border border-white/20 hover:shadow-xl cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${lightBg}`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <span className={`text-sm font-medium ${change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
            {change} from last month
          </span>
        </div>
      )}
    </motion.div>
  )
}
