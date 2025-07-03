"use client"

import { motion } from "framer-motion"
import { Eye, Edit, Trash2, MapPin, Calendar, User, Package } from "lucide-react"

export default function EquipmentCard({ equipment, onView, userRole, viewMode = "grid" }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100 border-green-200"
      case "in-use":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "maintenance":
        return "text-orange-600 bg-orange-100 border-orange-200"
      case "retired":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case "excellent":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "fair":
        return "text-orange-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        className="glass-card rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center space-x-6">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={equipment.image_url || "/placeholder.svg?height=80&width=80"}
              alt={equipment.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-lg truncate">{equipment.name}</h3>
                <p className="text-sm text-gray-600">{equipment.serial_number}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(equipment.status)}`}>
                {equipment.status?.replace("-", " ")}
              </span>
            </div>

            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Package className="w-4 h-4" />
                <span>{equipment.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{equipment.location}</span>
              </div>
              {equipment.assigned_to && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{equipment.assigned_to}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onView}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <img
          src={equipment.image_url || "/placeholder.svg?height=300&width=400"}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(equipment.status)}`}
          >
            {equipment.status?.replace("-", " ")}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-blue-600 transition-colors">
              {equipment.name}
            </h3>
            <p className="text-sm text-gray-600">{equipment.serial_number}</p>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg ml-2">{equipment.category}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{equipment.description}</p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{equipment.location}</span>
          </div>

          {equipment.assigned_to && (
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Assigned to {equipment.assigned_to}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              Last maintained: {new Date(equipment.last_maintenance).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Condition */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Condition:</span>
          <span className={`text-sm font-medium capitalize ${getConditionColor(equipment.condition)}`}>
            {equipment.condition}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </motion.button>

          {userRole === "admin" && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 glass border border-white/20 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 glass border border-red-200 text-red-600 rounded-xl hover:shadow-lg hover:bg-red-50 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
