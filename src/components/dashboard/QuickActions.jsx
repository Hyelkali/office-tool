"use client"

import { motion } from "framer-motion"
import { Plus, FileText, Package, Users, Search, Settings } from "lucide-react"
import { Link } from "react-router-dom"

export default function QuickActions({ userRole }) {
  const actions = [
    {
      title: "New Request",
      description: "Request equipment access",
      icon: FileText,
      href: "/requests",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Browse Equipment",
      description: "View available equipment",
      icon: Package,
      href: "/equipment",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Search Items",
      description: "Find specific equipment",
      icon: Search,
      href: "/equipment",
      color: "from-purple-500 to-pink-500",
    },
  ]

  if (userRole === "admin") {
    actions.push(
      {
        title: "Add Equipment",
        description: "Register new equipment",
        icon: Plus,
        href: "/equipment",
        color: "from-orange-500 to-red-500",
      },
      {
        title: "Manage Users",
        description: "User management",
        icon: Users,
        href: "/users",
        color: "from-indigo-500 to-purple-500",
      },
      {
        title: "System Settings",
        description: "Configure system",
        icon: Settings,
        href: "/settings",
        color: "from-gray-500 to-slate-500",
      },
    )
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link to={action.href} className="group block">
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-300`}
              >
                <action.icon className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
