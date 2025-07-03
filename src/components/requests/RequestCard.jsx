"use client"

import { motion } from "framer-motion"
import { Eye, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User, Package } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function RequestCard({ request, onView, userRole, onUpdateStatus }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return Clock
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      case "completed":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-orange-600 bg-orange-100 border-orange-200"
      case "approved":
        return "text-green-600 bg-green-100 border-green-200"
      case "rejected":
        return "text-red-600 bg-red-100 border-red-200"
      case "completed":
        return "text-blue-600 bg-blue-100 border-blue-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const StatusIcon = getStatusIcon(request.status)

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-6 border border-white/20 hover:shadow-xl cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        {/* Equipment Image */}
        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={request.equipment?.image_url || "/placeholder.svg?height=64&width=64"}
            alt={request.equipment?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800 text-lg truncate">{request.equipment?.name}</h3>
              <p className="text-sm text-gray-600">{request.purpose}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(request.status)}`}
            >
              <StatusIcon className="w-3 h-3" />
              <span>{request.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{request.requester?.name}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>{request.equipment?.category}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDateTime(request.created_at)}</span>
            </div>
          </div>

          {/* Date Range */}
          {(request.start_date || request.end_date) && (
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Duration: </span>
                {request.start_date && new Date(request.start_date).toLocaleDateString()}
                {request.start_date && request.end_date && " - "}
                {request.end_date && new Date(request.end_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Admin Notes */}
          {request.admin_notes && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Admin Notes: </span>
                {request.admin_notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onView}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </motion.button>

            {/* Admin Actions */}
            {userRole === "admin" && request.status === "pending" && (
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateStatus(request.id, "approved")}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateStatus(request.id, "rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Reject
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
