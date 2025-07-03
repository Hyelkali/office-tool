"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Search, Filter, Calendar, Package, FileText, User, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatDateTime } from "@/lib/utils"

export default function ActivityLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const logTypes = [
    "all",
    "equipment_added",
    "equipment_updated",
    "request_created",
    "request_approved",
    "request_rejected",
    "user_created",
  ]
  const dateFilters = ["all", "today", "week", "month"]

  useEffect(() => {
    fetchActivityLogs()
  }, [])

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error("Error fetching activity logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "equipment_added":
      case "equipment_updated":
        return Package
      case "request_created":
      case "request_approved":
      case "request_rejected":
        return FileText
      case "user_created":
        return User
      default:
        return Activity
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case "equipment_added":
        return "text-green-600 bg-green-100"
      case "equipment_updated":
        return "text-blue-600 bg-blue-100"
      case "request_created":
        return "text-blue-600 bg-blue-100"
      case "request_approved":
        return "text-green-600 bg-green-100"
      case "request_rejected":
        return "text-red-600 bg-red-100"
      case "user_created":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const filterLogsByDate = (logs, filter) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    switch (filter) {
      case "today":
        return logs.filter((log) => new Date(log.created_at) >= today)
      case "week":
        return logs.filter((log) => new Date(log.created_at) >= weekAgo)
      case "month":
        return logs.filter((log) => new Date(log.created_at) >= monthAgo)
      default:
        return logs
    }
  }

  const filteredLogs = filterLogsByDate(
    logs.filter((log) => {
      const matchesSearch =
        log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === "all" || log.type === selectedType

      return matchesSearch && matchesType
    }),
    dateFilter,
  )

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
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-1">Track all system activities and changes</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {logTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {dateFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === "all" ? "All Time" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 border border-white/20"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No activities found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log, index) => {
              const Icon = getActivityIcon(log.type)
              const colorClass = getActivityColor(log.type)

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/50 transition-colors"
                >
                  <div className={`p-3 rounded-full ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{log.message}</p>
                        {log.details && <p className="text-sm text-gray-600 mt-1">{log.details}</p>}
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-xs text-gray-500">{formatDateTime(log.created_at)}</p>
                          {log.user_id && <p className="text-xs text-gray-500">User ID: {log.user_id}</p>}
                        </div>
                      </div>

                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg ml-4">
                        {log.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Equipment Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter((log) => log.type.includes("equipment")).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Request Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter((log) => log.type.includes("request")).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">User Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter((log) => log.type.includes("user")).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
