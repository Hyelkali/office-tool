"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardLayout from "./layouts/DashboardLayout"
import AdminLayout from "./layouts/AdminLayout"
import Dashboard from "./pages/Dashboard"
import Equipment from "./pages/Equipment"
import Requests from "./pages/Requests"
import ActivityLogs from "./pages/ActivityLogs"
import LoadingSpinner from "./components/ui/LoadingSpinner"
import AdminDashboard from "./pages/admin/Dashboard"
import StaffDashboard from "./pages/staff/Dashboard"
import TechnicianDashboard from "./pages/technician/Dashboard"

function ProtectedRoute({ children, roles }) {
  const { currentUser, userProfile, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (roles && !roles.includes(userProfile?.role)) {
    return <Navigate to="/dashboard" />
  }

  return children
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return !currentUser ? children : <Navigate to="/dashboard" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute roles={["staff"]}>
                <DashboardLayout>
                  <StaffDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician/dashboard"
            element={
              <ProtectedRoute roles={["technician"]}>
                <DashboardLayout>
                  <TechnicianDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipment"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Equipment />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Requests />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ActivityLogs />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
