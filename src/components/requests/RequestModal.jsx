"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, Package, Calendar, User, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function RequestModal({ request, onClose, userRole, onUpdateStatus }) {
  const [adminNotes, setAdminNotes] = useState(request.admin_notes || "")
  const [updating, setUpdating] = useState(false)

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

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await onUpdateStatus(request.id, newStatus, adminNotes)
      onClose()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                <p className="text-gray-600">#{request.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl transition-colors">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Request Info */}
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </span>
                </div>

                {/* Equipment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment</h3>
                  <div className="flex items-center space-x-4 p-4 glass-card rounded-xl border border-white/20">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={request.equipment?.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={request.equipment?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{request.equipment?.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{request.equipment?.category}</p>
                    </div>
                  </div>
                </div>

                {/* Requester Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requester</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.requester?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.requester?.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Department:</span>
                        <span className="ml-2 font-medium text-gray-900">{request.requester?.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Purpose:</span>
                      <p className="font-medium text-gray-900 mt-1">{request.purpose}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Requested on:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatDateTime(request.created_at)}</span>
                      </div>
                    </div>

                    {(request.start_date || request.end_date) && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-1">Duration:</p>
                        <p className="font-medium text-gray-900">
                          {request.start_date && new Date(request.start_date).toLocaleDateString()}
                          {request.start_date && request.end_date && " - "}
                          {request.end_date && new Date(request.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {request.notes && (
                      <div>
                        <span className="text-sm text-gray-600">Additional Notes:</span>
                        <p className="font-medium text-gray-900 mt-1 p-3 bg-gray-50 rounded-xl">{request.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Admin Actions */}
              <div className="space-y-6">
                {userRole === "admin" && (
                  <>
                    {/* Admin Notes */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="Add notes for this request..."
                      />
                    </div>

                    {/* Admin Actions */}
                    {request.status === "pending" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate("approved")}
                            disabled={updating}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>{updating ? "Updating..." : "Approve Request"}</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate("rejected")}
                            disabled={updating}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                          >
                            <XCircle className="w-5 h-5" />
                            <span>{updating ? "Updating..." : "Reject Request"}</span>
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {request.status === "approved" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark as Completed</h3>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStatusUpdate("completed")}
                          disabled={updating}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        >
                          <Clock className="w-5 h-5" />
                          <span>{updating ? "Updating..." : "Mark as Completed"}</span>
                        </motion.button>
                      </div>
                    )}
                  </>
                )}

                {/* Request Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Request Created</p>
                        <p className="text-xs text-gray-500">{formatDateTime(request.created_at)}</p>
                      </div>
                    </div>

                    {request.status !== "pending" && (
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            request.status === "approved"
                              ? "bg-green-500"
                              : request.status === "rejected"
                                ? "bg-red-500"
                                : "bg-blue-500"
                          }`}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">Request {request.status}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(request.updated_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
