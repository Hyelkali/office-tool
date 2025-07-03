"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const determineUserRole = useCallback((email) => {
    if (email === "hyelnamuninathan@gmail.com") {
      return "admin"
    }
    const adminEmails = ["admin@company.com", "hyelnamuninathan@gmail.com"]
    if (adminEmails.includes(email)) {
      return "admin"
    }
    return "staff"
  }, [])

  const createUserProfile = useCallback(
    async (user, additionalData = {}) => {
      const userRole = determineUserRole(user.email)
      const isDefaultAdmin = user.email === "hyelnamuninathan@gmail.com"

      const userProfile = {
        id: user.uid,
        email: user.email,
        name: additionalData.name || user.displayName || "User",
        role: additionalData.role || userRole,
        department: additionalData.department || (isDefaultAdmin ? "IT Administration" : "General"),
        phone: additionalData.phone || null,
        position: additionalData.position || null,
        photo_url: user.photoURL || null,
        is_active: true,
        is_default_admin: isDefaultAdmin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("users").upsert(userProfile, { onConflict: "id" })

      if (error) {
        console.error("Error creating user profile:", error)
        throw error
      }

      return userProfile
    },
    [determineUserRole],
  )

  const fetchUserProfile = useCallback(
    async (user) => {
      try {
        let { data: profile, error } = await supabase.from("users").select("*").eq("id", user.uid).single()

        if (error && error.code === "PGRST116") {
          // User doesn't exist, create profile
          profile = await createUserProfile(user)
        } else if (error) {
          throw error
        } else {
          // Update last login time
          await supabase
            .from("users")
            .update({
              updated_at: new Date().toISOString(),
              photo_url: user.photoURL,
            })
            .eq("id", user.uid)
        }

        return profile
      } catch (error) {
        console.error("Error fetching user profile:", error)
        throw error
      }
    },
    [createUserProfile],
  )

  async function signup(email, password, userData) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update Firebase profile with display name
      if (userData.name) {
        await updateProfile(result.user, {
          displayName: userData.name,
        })
      }

      toast.success("Account created successfully!")
      return result
    } catch (error) {
      console.error("Signup error:", error)
      toast.error(error.message)
      throw error
    }
  }

  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      toast.success("Logged in successfully!")
      return result
    } catch (error) {
      console.error("Login error:", error)
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("No account found with this email. Please sign up first.")
          break
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again.")
          break
        case "auth/invalid-email":
          toast.error("Invalid email address.")
          break
        case "auth/too-many-requests":
          toast.error("Too many failed attempts. Please try again later.")
          break
        case "auth/invalid-credential":
          toast.error("Invalid email or password. Please try again.")
          break
        default:
          toast.error("Login failed. Please try again.")
      }
      throw error
    }
  }

  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      toast.success("Signed in with Google successfully!")
      return result
    } catch (error) {
      console.error("Google sign-in error:", error)
      switch (error.code) {
        case "auth/popup-closed-by-user":
          toast.error("Sign-in cancelled.")
          break
        case "auth/popup-blocked":
          toast.error("Popup blocked. Please allow popups and try again.")
          break
        case "auth/cancelled-popup-request":
          break
        default:
          toast.error("Failed to sign in with Google. Please try again.")
      }
      throw error
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      setUserProfile(null)
      toast.success("Logged out successfully!")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        try {
          const profileData = await fetchUserProfile(user)
          setUserProfile(profileData)
        } catch (error) {
          console.error("Error loading user profile:", error)
          toast.error("Error loading user profile")
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [fetchUserProfile])

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    signInWithGoogle,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
