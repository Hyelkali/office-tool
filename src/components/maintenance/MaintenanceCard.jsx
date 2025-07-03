"use client"

import { motion } from "framer-motion"
import { Calendar, User, Wrench, MapPin, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext" // Import useAuth to access userProfile

export default function MaintenanceCard({ record, onView, onUpdateStatus, userRole }) {
  const { userProfile } = useAuth() // Declare userProfile using useAuth hook
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return Calendar
      case "in-progress":
        return Clock
      case "completed":
        return CheckCircle
      case "overdue":
        return AlertTriangle
      default:
        return Wrench
    }
  }

  const StatusIcon = getStatusIcon(record.status)

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="p-6 transition-all duration-300 border glass-card rounded-2xl border-white/20 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1 space-x-4">
          {/* Equipment Image */}
          <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-xl">
            <img
              src={record.equipment?.image_url || "/placeholder.svg?height=64&width=64"}
              alt={record.equipment?.name}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{record.equipment?.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{record.type} Maintenance</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(record.status)}`}
              >
                <StatusIcon className="w-3 h-3" />
                <span>{record.status.replace("-", " ")}</span>
              </span>
            </div>

            <p className="mb-4 text-sm text-gray-600 line-clamp-2">{record.description}</p>

            {/* Details */}
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Scheduled: {new Date(record.scheduled_date).toLocaleDateString()}</span>
              </div>

              {record.technician && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{record.technician.name}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{record.equipment?.location}</span>
              </div>

              {record.estimated_duration && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{record.estimated_duration} hours</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col ml-4 space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            View Details
          </motion.button>

          {(userRole === "admin" || userProfile?.role === "technician") && record.status === "scheduled" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateStatus(record.id, "in-progress")}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-600 rounded-xl hover:bg-orange-700"
            >
              Start
            </motion.button>
          )}

          {(userRole === "admin" || userProfile?.role === "technician") && record.status === "in-progress" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onUpdateStatus(record.id, "completed")}
              className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700"
            >
              Complete
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
