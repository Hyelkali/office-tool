"use client"

import { motion } from "framer-motion"
import { Eye, Edit, Trash2, Phone, Building, Shield, User, Clock } from "lucide-react"

export default function UserCard({ user, onView, onEdit, onDelete, onToggleStatus, currentUserId }) {
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-purple-600 bg-purple-100 border-purple-200"
      case "technician":
        return "text-orange-600 bg-orange-100 border-orange-200"
      case "staff":
        return "text-blue-600 bg-blue-100 border-blue-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return Shield
      case "technician":
        return User
      case "staff":
        return User
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon(user.role)

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl cursor-pointer group"
    >
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            {user.photo_url ? (
              <img
                src={user.photo_url || "/placeholder.svg"}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">{user.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg truncate">{user.name}</h3>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getRoleColor(user.role)}`}
              >
                <RoleIcon className="w-3 h-3" />
                <span>{user.role}</span>
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.is_active ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Details */}
        <div className="space-y-3 mb-4">
          {user.department && (
            <div className="flex items-center space-x-2 text-sm">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{user.department}</span>
            </div>
          )}

          {user.position && (
            <div className="flex items-center space-x-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{user.position}</span>
            </div>
          )}

          {user.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{user.phone}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Joined: {new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onView}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </motion.button>

          {currentUserId !== user.id && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className="px-3 py-2 glass border border-white/20 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleStatus}
                className={`px-3 py-2 rounded-xl hover:shadow-lg transition-all duration-300 ${
                  user.is_active
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                }`}
              >
                {user.is_active ? "Deactivate" : "Activate"}
              </motion.button>

              {!user.is_default_admin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onDelete}
                  className="px-3 py-2 glass border border-red-200 text-red-600 rounded-xl hover:shadow-lg hover:bg-red-50 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
