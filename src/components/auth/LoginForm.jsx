"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, Briefcase } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
    phone: "",
    position: "",
    role: "staff",
  })
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const { login, signup, signInWithGoogle, userProfile } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        if (userProfile) {
          switch (userProfile.role) {
            case "admin":
              navigate("/admin/dashboard")
              break
            case "staff":
              navigate("/staff/dashboard")
              break
            case "technician":
              navigate("/technician/dashboard")
              break
            default:
              navigate("/dashboard")
          }
        }
      } else {
        await signup(formData.email, formData.password, {
          name: formData.name,
          department: formData.department,
          phone: formData.phone,
          position: formData.position,
          role: formData.role,
        })
        navigate("/login")
      }
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google sign-in error:", error)
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const fillDemoCredentials = (role) => {
    const demoCredentials = {
      admin: { email: "hyelnamuninathan@gmail.com", password: "admin123" },
      staff: { email: "staff@demo.com", password: "staff123" },
      technician: { email: "tech@demo.com", password: "tech123" },
    }

    setFormData((prev) => ({
      ...prev,
      ...demoCredentials[role],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="text-gray-600">{isLogin ? "Sign in to your account" : "Join our platform today"}</p>
      </div>

      {/* Google Sign In Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center space-x-3 px-4 py-3 glass border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="text-gray-700 font-medium">{googleLoading ? "Signing in..." : "Continue with Google"}</span>
      </motion.button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Demo Credentials */}
      <div className="glass-card p-4 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-800 mb-3 font-medium">🚀 Demo Credentials:</p>
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            disabled={loading || googleLoading}
            className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-medium"
          >
            Admin
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => fillDemoCredentials("staff")}
            disabled={loading || googleLoading}
            className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-medium"
          >
            Staff
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => fillDemoCredentials("technician")}
            disabled={loading || googleLoading}
            className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-medium"
          >
            Tech
          </motion.button>
        </div>
        <p className="text-xs text-blue-600 mt-2">Click a button above to fill credentials, then sign in</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || googleLoading}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 bg-white/50"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading || googleLoading}
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 bg-white/50"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading || googleLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: loading || googleLoading ? 1 : 1.02 }}
          whileTap={{ scale: loading || googleLoading ? 1 : 0.98 }}
          type="submit"
          disabled={loading || googleLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </motion.button>
      </form>

      {/* Toggle Login/Register */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate("/register")}
          disabled={loading || googleLoading}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:opacity-50"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  )
}
