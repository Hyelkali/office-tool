"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { Download, TrendingUp, Package, Users, FileText, Filter } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatCurrency } from "@/lib/utils"

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("month")
  const [reportData, setReportData] = useState({
    equipmentStats: [],
    requestTrends: [],
    departmentUsage: [],
    maintenanceCosts: [],
    utilizationRates: [],
  })

  const dateRanges = [
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
    { value: "quarter", label: "Last 3 Months" },
    { value: "year", label: "Last Year" },
  ]

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      // Calculate date range
      const now = new Date()
      const startDate = new Date()

      switch (dateRange) {
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setDate(now.getDate() - 30)
          break
        case "quarter":
          startDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Fetch equipment data
      const { data: equipment } = await supabase.from("equipment").select("*")

      // Fetch requests data
      const { data: requests } = await supabase
        .from("requests")
        .select("*, equipment:equipment_id(category), requester:user_id(department)")
        .gte("created_at", startDate.toISOString())

      // Fetch users data
      const { data: users } = await supabase.from("users").select("*")

      // Process equipment stats
      const equipmentByCategory = {}
      const equipmentByStatus = {}

      equipment?.forEach((item) => {
        equipmentByCategory[item.category] = (equipmentByCategory[item.category] || 0) + 1
        equipmentByStatus[item.status] = (equipmentByStatus[item.status] || 0) + 1
      })

      const equipmentStats = Object.entries(equipmentByCategory).map(([category, count]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count,
        value: count,
      }))

      // Process request trends
      const requestsByDate = {}
      requests?.forEach((request) => {
        const date = new Date(request.created_at).toLocaleDateString()
        requestsByDate[date] = (requestsByDate[date] || 0) + 1
      })

      const requestTrends = Object.entries(requestsByDate)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, count]) => ({
          date,
          requests: count,
        }))

      // Process department usage
      const departmentStats = {}
      requests?.forEach((request) => {
        const dept = request.requester?.department || "Unknown"
        departmentStats[dept] = (departmentStats[dept] || 0) + 1
      })

      const departmentUsage = Object.entries(departmentStats).map(([department, count]) => ({
        department,
        requests: count,
        value: count,
      }))

      // Generate mock maintenance costs data
      const maintenanceCosts = [
        { month: "Jan", cost: 1200, equipment: 15 },
        { month: "Feb", cost: 800, equipment: 12 },
        { month: "Mar", cost: 1500, equipment: 18 },
        { month: "Apr", cost: 950, equipment: 14 },
        { month: "May", cost: 1100, equipment: 16 },
        { month: "Jun", cost: 1300, equipment: 17 },
      ]

      // Generate utilization rates
      const utilizationRates = equipmentStats.map((item) => ({
        ...item,
        utilization: Math.floor(Math.random() * 40) + 60, // 60-100%
      }))

      setReportData({
        equipmentStats,
        requestTrends,
        departmentUsage,
        maintenanceCosts,
        utilizationRates,
      })
    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    // Create CSV content
    const csvContent = [
      ["Equipment Report", new Date().toLocaleDateString()],
      [],
      ["Equipment by Category"],
      ["Category", "Count"],
      ...reportData.equipmentStats.map((item) => [item.category, item.count]),
      [],
      ["Department Usage"],
      ["Department", "Requests"],
      ...reportData.departmentUsage.map((item) => [item.department, item.requests]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `equipment-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into equipment usage and performance</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportReport}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.equipmentStats.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.requestTrends.reduce((sum, item) => sum + item.requests, 0)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Departments</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.departmentUsage.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  reportData.utilizationRates.reduce((sum, item) => sum + item.utilization, 0) /
                    reportData.utilizationRates.length || 0,
                )}
                %
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.equipmentStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.departmentUsage}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`}
              >
                {reportData.departmentUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Request Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.requestTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                }}
              />
              <Area type="monotone" dataKey="requests" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Maintenance Costs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Costs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.maintenanceCosts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                }}
                formatter={(value) => [formatCurrency(value), "Cost"]}
              />
              <Line type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={3} dot={{ fill: "#F59E0B" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Utilization Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-card rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Utilization Rates</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total Equipment</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Utilization Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.utilizationRates.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.category}</td>
                  <td className="py-3 px-4 text-gray-600">{item.count}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.utilization >= 80
                              ? "bg-green-500"
                              : item.utilization >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${item.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.utilization}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.utilization >= 80
                          ? "bg-green-100 text-green-800"
                          : item.utilization >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.utilization >= 80 ? "Excellent" : item.utilization >= 60 ? "Good" : "Poor"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
