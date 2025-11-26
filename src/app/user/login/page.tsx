"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Trophy, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { isAdmin } from "@/lib/auth-helpers"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
      >
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="url(#path-gradient)"
            strokeWidth={path.width}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function UserLogin() {
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
        // Check if the user is an admin
        const userIsAdmin = await isAdmin(data.user.id)
        
        if (userIsAdmin) {
          // Sign out the user since they're trying to use the wrong login page
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

        // Show success toast
        toast.success("Welcome back!", {
          description: "Successfully signed in",
          icon: <CheckCircle className="w-5 h-5" />,
          closeButton: false,
          duration: 3000,
        })

        // Show loading overlay
        setShowLoadingOverlay(true)

        // Redirect to user dashboard after toast disappears (3 seconds)
        setTimeout(() => {
          router.push("/")
        }, 3000)
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
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
        <div className="absolute top-0 left-0 w-full h-20 bg-white opacity-5 transform -skew-y-3"></div>
        <div className="absolute bottom-0 right-0 w-full h-20 bg-white opacity-5 transform skew-y-3"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.05]"></div>
      </div>

      {/* Logo/Header Section */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center space-x-3 group transition-transform duration-300 hover:scale-105 z-20"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-lg shadow-green-500/20">
            <Image
              src="/Logos/Minsu.png"
              alt="Minsu Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white">
            INTRAM
          </span>
          <span className="text-sm text-green-200">Intramural Tracker</span>
        </div>
      </Link>

      {/* Main Login Card */}
      <div className="w-full max-w-sm relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-100 p-6 md:p-8 relative overflow-hidden">
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-400/10 to-green-600/10 rounded-full blur-3xl -z-10"></div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg shadow-green-500/25 mb-4 relative group">
              <Shield className="w-8 h-8 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-green-800 mb-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              User Login
            </h1>
            
            <p className="text-gray-600 text-xs md:text-sm">
              Sign in to track your intramural activities
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-green-800 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 bg-white/50 ${
                    error 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-green-600 focus:ring-green-500 focus:border-green-600'
                  }`}
                  placeholder="user@intramurals.edu"
                  suppressHydrationWarning
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
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-12 py-3 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 bg-white/50 ${
                    error 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-green-600 focus:ring-green-500 focus:border-green-600'
                  }`}
                  placeholder="••••••••"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
                  suppressHydrationWarning
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
                href="/user/forgot-password"
                className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative overflow-hidden"
              suppressHydrationWarning
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
          <div className="mt-6 pt-4 border-t border-green-200">
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/user/signup"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
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
            <p className="text-green-700 font-semibold text-xl tracking-wide">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}

