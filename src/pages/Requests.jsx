"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import RequestCard from "@/components/requests/RequestCard"
import RequestModal from "@/components/requests/RequestModal"
import NewRequestModal from "@/components/requests/NewRequestModal"
import toast from "react-hot-toast"

export default function Requests() {
  const { userProfile } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)

  const statuses = ["all", "pending", "approved", "rejected", "completed"]

  useEffect(() => {
    fetchRequests()
  }, [userProfile])

  const fetchRequests = async () => {
    try {
      let query = supabase
        .from("requests")
        .select(`
          *,
          equipment:equipment_id(name, category, image_url),
          requester:user_id(name, email, department)
        `)
        .order("created_at", { ascending: false })

      // If not admin, only show user's own requests
      if (userProfile?.role !== "admin") {
        query = query.eq("user_id", userProfile?.id)
      }

      const { data, error } = await query

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRequest = async (requestData) => {
    try {
      const { data, error } = await supabase
        .from("requests")
        .insert([
          {
            ...requestData,
            user_id: userProfile.id,
            status: "pending",
            created_at: new Date().toISOString(),
          },
        ])
        .select(`
          *,
          equipment:equipment_id(name, category, image_url),
          requester:user_id(name, email, department)
        `)

      if (error) throw error

      setRequests((prev) => [data[0], ...prev])
      toast.success("Request submitted successfully!")
    } catch (error) {
      console.error("Error creating request:", error)
      toast.error("Failed to submit request")
      throw error
    }
  }

  const handleUpdateRequestStatus = async (requestId, newStatus, notes = "") => {
    try {
      const { error } = await supabase
        .from("requests")
        .update({
          status: newStatus,
          admin_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (error) throw error

      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: newStatus, admin_notes: notes } : req)),
      )

      toast.success(`Request ${newStatus} successfully!`)
    } catch (error) {
      console.error("Error updating request:", error)
      toast.error("Failed to update request")
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusStats = () => {
    return {
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
      completed: requests.filter((r) => r.status === "completed").length,
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Equipment Requests</h1>
          <p className="text-gray-600 mt-1">
            {userProfile?.role === "admin" ? "Manage all equipment requests" : "Track your equipment requests"}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewRequestModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </motion.button>
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
            <div className="p-2 bg-orange-100 rounded-xl">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
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
            <div className="p-2 bg-red-100 rounded-xl">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
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
            <div className="p-2 bg-blue-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
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
                placeholder="Search requests..."
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
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Requests List */}
      <AnimatePresence mode="wait">
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No requests found matching your criteria</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <RequestCard
                  request={request}
                  onView={() => setSelectedRequest(request)}
                  userRole={userProfile?.role}
                  onUpdateStatus={handleUpdateRequestStatus}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {selectedRequest && (
          <RequestModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            userRole={userProfile?.role}
            onUpdateStatus={handleUpdateRequestStatus}
          />
        )}

        {showNewRequestModal && (
          <NewRequestModal onClose={() => setShowNewRequestModal(false)} onSubmit={handleCreateRequest} />
        )}
      </AnimatePresence>
    </div>
  )
}
