"use client"

import { useState } from "react"
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Trophy, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { isAdmin, getUserRole } from "@/lib/auth-helpers"

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        throw signInError
      }

      if (data.user) {
        // Prefer role from DB `admin_users.role` but fall back to user metadata
        const dbRole = await getUserRole(data.user.id)
        const metaRole = (data.user.user_metadata as any)?.role as string | undefined
        const role = dbRole ?? metaRole

        // Check if the user is an admin via admin_users table (or role)
        const userIsAdmin = (role === 'admin') || await isAdmin(data.user.id)

        // If user is admin, go to admin dashboard
        if (userIsAdmin) {
          toast.success("Welcome back, Admin!", {
            description: "Successfully signed in",
            icon: <CheckCircle className="w-5 h-5" />,
            closeButton: false,
            duration: 3000,
          })

          setShowLoadingOverlay(true)

          setTimeout(() => {
            router.push("/admin/dashboard")
          }, 3000)
          return
        }

        // If user is a coordinator (from DB role or metadata), allow and redirect to coordinator dashboard
        if (role === "coordinator") {
          toast.success("Welcome back, Coordinator!", {
            description: "Successfully signed in",
            icon: <CheckCircle className="w-5 h-5" />,
            closeButton: false,
            duration: 1500,
          })

          setShowLoadingOverlay(true)
          setTimeout(() => {
            router.push("/coordinator/dashboard")
          }, 800)
          return
        }

        // Otherwise deny access
        await supabase.auth.signOut()
        const errorMessage = "Invalid credentials or insufficient permissions. Please check your login details."
        setError(errorMessage)

        toast.error("Authentication Failed", {
          description: errorMessage,
          icon: <AlertCircle className="w-5 h-5" />,
          closeButton: false,
        })

        setIsLoading(false)
        return
      }
    } catch (err: unknown) {
      console.error("Login error:", err)
      
      // Provide more specific error messages
      const error = err as { message?: string }
      let errorMessage = error.message || "Failed to sign in. Please check your credentials."
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again."
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email address before signing in."
      } else if (error.message?.includes("User not found")) {
        errorMessage = "No account found with this email. Please check your email or create an account."
      }
      
      setError(errorMessage)
      
      toast.error("Authentication Failed", {
        description: errorMessage,
        icon: <AlertCircle className="w-5 h-5" />,
        closeButton: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-100/50 rounded-bl-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-green-100/30 rounded-tr-[80px] -z-10"></div>
        <div className="absolute top-1/4 left-10 w-32 h-32 border border-green-200 rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 border border-green-200 rounded-full -z-10 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.03]"></div>
      </div>

      {/* Logo/Header Section */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center space-x-3 group transition-transform duration-300 hover:scale-105"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-300/20 rounded-full blur-xl"></div>
          <div className="relative">
            <Image
              src="/Logos/Minsu.png"
              alt="Minsu Logo"
              width={48}
              height={48}
              className="rounded-full border-2 border-green-500/20"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            INTRAM
          </span>
          <span className="text-sm text-gray-500">Intramural Tracker</span>
        </div>
      </Link>

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-100 p-8 md:p-10 relative overflow-hidden">
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-400/10 to-green-600/10 rounded-full blur-3xl -z-10"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg shadow-green-500/25 mb-6 relative group">
              <Shield className="w-10 h-10 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-green-800 mb-3 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            
            <p className="text-gray-600 text-sm md:text-base">
              Sign in to manage the intramural system
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-green-800 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-green-600/50" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                    error 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-green-200 focus:ring-green-500 focus:border-transparent'
                  }`}
                  placeholder="admin@intramurals.edu"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-green-800 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-green-600/50" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-12 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                    error 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-green-200 focus:ring-green-500 focus:border-transparent'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                />
                <span className="ml-2 text-gray-600 group-hover:text-green-700 transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10 flex items-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-green-200">
            <p className="text-center text-sm text-gray-600">
              Not an admin?{" "}
              <Link
                href="/user/login"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
              >
                User Login
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100/80 backdrop-blur-sm rounded-full text-sm text-green-700 shadow-sm">
            <Trophy className="w-4 h-4 mr-2" />
            Secure Admin Access
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-8 text-center text-sm text-gray-500">
        <p>© 2025 Intramurals. All rights reserved.</p>
      </div>

      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-3">
              <div 
                className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" 
                style={{ animationDelay: '-0.3s' }}
              ></div>
              <div 
                className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" 
                style={{ animationDelay: '-0.15s' }}
              ></div>
              <div 
                className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg"
              ></div>
              <div 
                className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" 
                style={{ animationDelay: '0.15s' }}
              ></div>
            </div>
            <p className="text-green-700 font-semibold text-xl tracking-wide">Loading Dashboard...</p>
          </div>
        </div>
      )}
    </div>
  )
}

