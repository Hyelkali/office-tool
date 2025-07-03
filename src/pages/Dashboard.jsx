"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import StatsCard from "@/components/dashboard/StatsCard"
import QuickActions from "@/components/dashboard/QuickActions"
import RecentActivity from "@/components/dashboard/RecentActivity"
import EquipmentChart from "@/components/dashboard/EquipmentChart"
import { Package, Users, FileText, TrendingUp, AlertTriangle } from "lucide-react"

export default function Dashboard() {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    pendingRequests: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch equipment stats
      const { data: equipment } = await supabase.from("equipment").select("status")
      const totalEquipment = equipment?.length || 0
      const availableEquipment = equipment?.filter((item) => item.status === "available").length || 0

      // Fetch request stats
      const { data: requests } = await supabase.from("requests").select("status")
      const pendingRequests = requests?.filter((req) => req.status === "pending").length || 0

      // Fetch user stats
      const { data: users } = await supabase.from("users").select("is_active")
      const activeUsers = users?.filter((user) => user.is_active).length || 0

      setStats({
        totalEquipment,
        availableEquipment,
        pendingRequests,
        activeUsers,
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Total Equipment",
      value: stats.totalEquipment,
      icon: Package,
      color: "blue",
      change: "+12%",
    },
    {
      title: "Available Equipment",
      value: stats.availableEquipment,
      icon: Package,
      color: "green",
      change: "+8%",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: FileText,
      color: "orange",
      change: "-5%",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      color: "purple",
      change: "+15%",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning, {userProfile?.name}! 👋</h1>
            <p className="text-gray-600 text-lg">Here's what's happening with your equipment today.</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="bento-grid">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatsCard {...stat} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <EquipmentChart />
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RecentActivity />
          </motion.div>
        </div>

        {/* Right Column - Quick Actions and Alerts */}
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <QuickActions userRole={userProfile?.role} />
          </motion.div>

          {/* Alerts Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-orange-800">Equipment Maintenance Due</p>
                  <p className="text-xs text-orange-600">3 items require maintenance this week</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-blue-800">New Requests</p>
                  <p className="text-xs text-blue-600">5 new equipment requests pending approval</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
