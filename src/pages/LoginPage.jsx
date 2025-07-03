"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Package } from "lucide-react"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
  })

  const { login, signup, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await signup(formData.email, formData.password, {
          name: formData.name,
          department: formData.department,
        })
      }
      navigate("/dashboard")
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate("/dashboard")
    } catch (error) {
      console.error("Google sign-in error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23000000&#39; fill-opacity=&#39;0.1&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;2&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute w-20 h-20 rounded-full top-20 left-10 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 float"></div>
      <div className="absolute w-16 h-16 rounded-full top-40 right-20 bg-gradient-to-r from-pink-400 to-red-400 opacity-20 float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute w-12 h-12 rounded-full bottom-20 left-20 bg-gradient-to-r from-green-400 to-blue-400 opacity-20 float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center mb-4 space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Package className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              OfficeTools
            </span>
          </div>
          <p className="text-gray-600">Welcome back to your workspace</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 shadow-2xl glass-card rounded-3xl"
        >
          <LoginForm />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-sm text-center text-gray-500"
        >
          <p>© 2025 OfficeTools. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  )
}
