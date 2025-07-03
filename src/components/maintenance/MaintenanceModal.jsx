"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Wrench, Calendar, User, MapPin, Clock, CheckCircle } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function MaintenanceModal({ record, onClose, onUpdateStatus, userRole }) {
  const [notes, setNotes] = useState(record.notes || "")
  const [updating, setUpdating] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "in-progress":
        return "text-orange-600 bg-orange-100 border-orange-200"
      case "completed":
        return "text-green-600 bg-green-100 border-green-200"
      case "overdue":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await onUpdateStatus(record.id, newStatus, notes)
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
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Maintenance Details</h2>
                <p className="text-gray-600">#{record.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl transition-colors">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Equipment & Details */}
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(record.status)}`}
                  >
                    {record.status.replace("-", " ")}
                  </span>
                </div>

                {/* Equipment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment</h3>
                  <div className="flex items-center space-x-4 p-4 glass-card rounded-xl border border-white/20">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={record.equipment?.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={record.equipment?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{record.equipment?.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{record.equipment?.category}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{record.equipment?.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="font-medium text-gray-900 capitalize">{record.type}</p>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Description:</span>
                      <p className="font-medium text-gray-900 mt-1">{record.description}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Scheduled Date:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatDateTime(record.scheduled_date)}</span>
                      </div>
                    </div>

                    {record.estimated_duration && (
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">Estimated Duration:</span>
                          <span className="ml-2 font-medium text-gray-900">{record.estimated_duration} hours</span>
                        </div>
                      </div>
                    )}

                    {record.technician && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">Assigned Technician:</span>
                          <span className="ml-2 font-medium text-gray-900">{record.technician.name}</span>
                        </div>
                      </div>
                    )}

                    {record.completed_date && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">Completed Date:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {formatDateTime(record.completed_date)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Notes */}
              <div className="space-y-6">
                {/* Actions */}
                {(userRole === "admin" || userRole === "technician") && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                    <div className="space-y-3">
                      {record.status === "scheduled" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStatusUpdate("in-progress")}
                          disabled={updating}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                        >
                          <Clock className="w-5 h-5" />
                          <span>{updating ? "Updating..." : "Start Maintenance"}</span>
                        </motion.button>
                      )}

                      {record.status === "in-progress" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStatusUpdate("completed")}
                          disabled={updating}
                          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>{updating ? "Updating..." : "Mark as Completed"}</span>
                        </motion.button>
                      )}

                      {record.status === "overdue" && (
                        <div className="space-y-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate("in-progress")}
                            disabled={updating}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                          >
                            <Clock className="w-5 h-5" />
                            <span>{updating ? "Updating..." : "Start Now"}</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStatusUpdate("completed")}
                            disabled={updating}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>{updating ? "Updating..." : "Mark as Completed"}</span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  {userRole === "admin" || userRole === "technician" ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Add maintenance notes..."
                    />
                  ) : (
                    <div className="glass-card p-4 rounded-xl border border-white/20">
                      <p className="text-gray-600">{record.notes || "No notes available"}</p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Maintenance Scheduled</p>
                        <p className="text-xs text-gray-500">{formatDateTime(record.created_at)}</p>
                      </div>
                    </div>

                    {record.status !== "scheduled" && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Maintenance Started</p>
                          <p className="text-xs text-gray-500">{formatDateTime(record.updated_at)}</p>
                        </div>
                      </div>
                    )}

                    {record.status === "completed" && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Maintenance Completed</p>
                          <p className="text-xs text-gray-500">{formatDateTime(record.completed_date)}</p>
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
