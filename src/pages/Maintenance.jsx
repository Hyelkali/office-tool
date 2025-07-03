"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Filter, Calendar, Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationContext"
import { supabase } from "@/lib/supabase"
import MaintenanceCard from "@/components/maintenance/MaintenanceCard"
import MaintenanceModal from "@/components/maintenance/MaintenanceModal"
import ScheduleMaintenanceModal from "@/components/maintenance/ScheduleMaintenanceModal"
import toast from "react-hot-toast"

export default function Maintenance() {
  const { userProfile } = useAuth()
  const { createNotification } = useNotifications()
  const [maintenanceRecords, setMaintenanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  const statuses = ["all", "scheduled", "in-progress", "completed", "overdue"]

  useEffect(() => {
    fetchMaintenanceRecords()
  }, [])

  const fetchMaintenanceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from("maintenance_records")
        .select(`
          *,
          equipment:equipment_id(name, category, image_url, location),
          technician:technician_id(name, email)
        `)
        .order("scheduled_date", { ascending: false })

      if (error) throw error

      // Calculate status based on dates
      const recordsWithStatus =
        data?.map((record) => {
          const now = new Date()
          const scheduledDate = new Date(record.scheduled_date)

          let status = record.status
          if (record.status === "scheduled" && scheduledDate < now) {
            status = "overdue"
          }

          return { ...record, status }
        }) || []

      setMaintenanceRecords(recordsWithStatus)
    } catch (error) {
      console.error("Error fetching maintenance records:", error)
      toast.error("Failed to load maintenance records")
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleMaintenance = async (maintenanceData) => {
    try {
      const { data, error } = await supabase
        .from("maintenance_records")
        .insert([
          {
            ...maintenanceData,
            status: "scheduled",
            created_by: userProfile.id,
            created_at: new Date().toISOString(),
          },
        ])
        .select(`
          *,
          equipment:equipment_id(name, category, image_url, location),
          technician:technician_id(name, email)
        `)

      if (error) throw error

      setMaintenanceRecords((prev) => [data[0], ...prev])

      // Create notification for technician
      if (maintenanceData.technician_id) {
        await createNotification(
          maintenanceData.technician_id,
          "maintenance_scheduled",
          "New Maintenance Scheduled",
          `Maintenance has been scheduled for ${data[0].equipment?.name}`,
          { maintenance_id: data[0].id },
        )
      }

      toast.success("Maintenance scheduled successfully!")
    } catch (error) {
      console.error("Error scheduling maintenance:", error)
      toast.error("Failed to schedule maintenance")
      throw error
    }
  }

  const handleUpdateStatus = async (recordId, newStatus, notes = "") => {
    try {
      const { error } = await supabase
        .from("maintenance_records")
        .update({
          status: newStatus,
          notes: notes,
          completed_date: newStatus === "completed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", recordId)

      if (error) throw error

      setMaintenanceRecords((prev) =>
        prev.map((record) =>
          record.id === recordId
            ? {
                ...record,
                status: newStatus,
                notes,
                completed_date: newStatus === "completed" ? new Date().toISOString() : record.completed_date,
              }
            : record,
        ),
      )

      toast.success(`Maintenance ${newStatus} successfully!`)
    } catch (error) {
      console.error("Error updating maintenance status:", error)
      toast.error("Failed to update maintenance status")
    }
  }

  const getStatusStats = () => {
    return {
      scheduled: maintenanceRecords.filter((r) => r.status === "scheduled").length,
      inProgress: maintenanceRecords.filter((r) => r.status === "in-progress").length,
      completed: maintenanceRecords.filter((r) => r.status === "completed").length,
      overdue: maintenanceRecords.filter((r) => r.status === "overdue").length,
    }
  }

  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      record.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.technician?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const stats = getStatusStats()

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
          <h1 className="text-3xl font-bold text-gray-900">Equipment Maintenance</h1>
          <p className="text-gray-600 mt-1">Schedule and track equipment maintenance activities</p>
        </div>
        {(userProfile?.role === "admin" || userProfile?.role === "technician") && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowScheduleModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Maintenance</span>
          </motion.button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
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
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search maintenance records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Maintenance Records */}
      <AnimatePresence mode="wait">
        {filteredRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No maintenance records found</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MaintenanceCard
                  record={record}
                  onView={() => setSelectedRecord(record)}
                  onUpdateStatus={handleUpdateStatus}
                  userRole={userProfile?.role}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {selectedRecord && (
          <MaintenanceModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onUpdateStatus={handleUpdateStatus}
            userRole={userProfile?.role}
          />
        )}

        {showScheduleModal && (
          <ScheduleMaintenanceModal onClose={() => setShowScheduleModal(false)} onSubmit={handleScheduleMaintenance} />
        )}
      </AnimatePresence>
    </div>
  )
}
