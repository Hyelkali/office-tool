"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Package, MapPin, Calendar, User, Settings, Edit, Trash2 } from "lucide-react"

export default function EquipmentModal({ equipment, onClose, userRole }) {
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
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{equipment.name}</h2>
                <p className="text-gray-600">{equipment.serial_number}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl transition-colors">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image */}
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                  <img
                    src={equipment.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={equipment.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(equipment.status)}`}
                  >
                    {equipment.status?.replace("-", " ")}
                  </span>

                  {userRole === "admin" && (
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="ml-2 font-medium text-gray-900 capitalize">{equipment.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="ml-2 font-medium text-gray-900">{equipment.location}</span>
                      </div>
                    </div>

                    {equipment.assigned_to && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">Assigned to:</span>
                          <span className="ml-2 font-medium text-gray-900">{equipment.assigned_to}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Condition:</span>
                        <span className={`ml-2 font-medium capitalize ${getConditionColor(equipment.condition)}`}>
                          {equipment.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {equipment.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{equipment.description}</p>
                  </div>
                )}

                {/* Specifications */}
                {equipment.specifications && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
                    <div className="glass-card p-4 rounded-xl border border-white/20">
                      <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono">
                        {equipment.specifications}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Maintenance Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Last Maintenance:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {new Date(equipment.last_maintenance).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Next Maintenance:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {equipment.next_maintenance
                            ? new Date(equipment.next_maintenance).toLocaleDateString()
                            : "Not scheduled"}
                        </span>
                      </div>
                    </div>

                    {equipment.purchase_date && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">Purchase Date:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(equipment.purchase_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {equipment.warranty_expiry && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-600">Warranty Expires:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {new Date(equipment.warranty_expiry).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchase Info */}
                {(equipment.purchase_price || equipment.vendor) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Information</h3>
                    <div className="space-y-3">
                      {equipment.purchase_price && (
                        <div>
                          <span className="text-sm text-gray-600">Purchase Price:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            ${equipment.purchase_price.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {equipment.vendor && (
                        <div>
                          <span className="text-sm text-gray-600">Vendor:</span>
                          <span className="ml-2 font-medium text-gray-900">{equipment.vendor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
