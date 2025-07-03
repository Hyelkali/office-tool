"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Package, Users, BarChart3, Shield, Zap, Globe } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Package,
      title: "Equipment Management",
      description: "Track and manage all your office equipment with ease",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Role-based access control for your team members",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Get insights into equipment usage and trends",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your data",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Lightning-fast performance with modern tech stack",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Globe,
      title: "Cloud-Based",
      description: "Access your data from anywhere, anytime",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-0 border-b glass-card border-white/20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                OfficeTools
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/login"
                className="px-6 py-2 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden lg:py-32">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 text-5xl font-bold text-gray-900 lg:text-7xl"
            >
              Modern Equipment
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Management System
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl mx-auto mb-8 text-xl leading-relaxed text-gray-600"
            >
              Streamline your office equipment management with our powerful, intuitive platform. 
              Track assets, manage requests, and gain valuable insights with beautiful analytics.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/login"
                className="flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-white transition-all duration-300 group bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:shadow-2xl"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <button className="px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 glass-card rounded-2xl hover:shadow-xl">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute w-20 h-20 rounded-full top-20 left-10 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 float"></div>
        <div className="absolute w-16 h-16 rounded-full top-40 right-20 bg-gradient-to-r from-pink-400 to-red-400 opacity-20 float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute w-12 h-12 rounded-full bottom-20 left-20 bg-gradient-to-r from-green-400 to-blue-400 opacity-20 float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
              Everything you need to manage
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                your office equipment
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Powerful features designed to make equipment management effortless and efficient
            </p>
          </motion.div>

          <div className="bento-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="cursor-pointer bento-item group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="relative z-10 max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-4xl font-bold text-white lg:text-5xl"
          >
            Ready to transform your
            <span className="block">equipment management?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8 text-xl text-blue-100"
          >
            Join thousands of companies already using OfficeTools to streamline their operations
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 space-x-2 text-lg font-semibold text-blue-600 transition-all duration-300 bg-white rounded-2xl hover:shadow-2xl group"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23ffffff&#39; fill-opacity=&#39;0.1&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;2&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center mb-4 space-x-2 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">OfficeTools</span>
            </div>
            <p className="text-gray-400">© 2025 OfficeTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
