"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Filter, Grid, List } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import EquipmentCard from "@/components/equipment/EquipmentCard"
import EquipmentModal from "@/components/equipment/EquipmentModal"
import AddEquipmentModal from "@/components/equipment/AddEquipmentModal"
import toast from "react-hot-toast"

export default function Equipment() {
  const { userProfile } = useAuth()
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const categories = ["all", "laptop", "desktop", "monitor", "printer", "phone", "tablet", "other"]
  const statuses = ["all", "available", "in-use", "maintenance", "retired"]

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase.from("equipment").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setEquipment(data || [])
    } catch (error) {
      console.error("Error fetching equipment:", error)
      toast.error("Failed to load equipment")
    } finally {
      setLoading(false)
    }
  }

  const handleAddEquipment = async (equipmentData) => {
    try {
      const { data, error } = await supabase.from("equipment").insert([equipmentData]).select()

      if (error) throw error

      setEquipment((prev) => [data[0], ...prev])
      toast.success("Equipment added successfully!")
    } catch (error) {
      console.error("Error adding equipment:", error)
      toast.error("Failed to add equipment")
      throw error
    }
  }

  const handleUpdateEquipment = async (equipmentData) => {
    try {
      const { data, error } = await supabase.from("equipment").update(equipmentData).eq("id", equipmentData.id).select()

      if (error) throw error

      setEquipment((prev) => prev.map((item) => (item.id === data[0].id ? data[0] : item)))
      toast.success("Equipment updated successfully!")
    } catch (error) {
      console.error("Error updating equipment:", error)
      toast.error("Failed to update equipment")
      throw error
    }
  }

  const handleDeleteEquipment = (equipmentId) => {
    setEquipment((prev) => prev.filter((item) => item.id !== equipmentId))
  }

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

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
          <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all your office equipment</p>
        </div>
        {userProfile?.role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add Equipment</span>
          </motion.button>
        )}
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
                placeholder="Search equipment..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 glass border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

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

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Equipment Grid/List */}
      <AnimatePresence mode="wait">
        {filteredEquipment.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No equipment found matching your criteria</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={viewMode === "grid" ? "bento-grid" : "space-y-4"}
          >
            {filteredEquipment.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <EquipmentCard
                  equipment={item}
                  onView={() => setSelectedEquipment(item)}
                  userRole={userProfile?.role}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {selectedEquipment && (
          <EquipmentModal
            equipment={selectedEquipment}
            onClose={() => setSelectedEquipment(null)}
            userRole={userProfile?.role}
            onUpdate={handleUpdateEquipment}
            onDelete={handleDeleteEquipment}
          />
        )}

        {showAddModal && <AddEquipmentModal onClose={() => setShowAddModal(false)} onSubmit={handleAddEquipment} />}
      </AnimatePresence>
    </div>
  )
}
