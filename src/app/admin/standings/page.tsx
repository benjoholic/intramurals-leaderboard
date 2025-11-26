"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  Home,
  Users,
  Calendar,
  Trophy,
  Settings,
  BarChart3,
  LogOut
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function StandingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showSignOutLoading, setShowSignOutLoading] = useState(false)
  type Standing = { rank: number; team: string; played: number; won: number; lost: number; pts: number }
  const [standings, setStandings] = useState<Standing[]>([
    { rank: 1, team: "Eagles", played: 6, won: 5, lost: 1, pts: 15 },
    { rank: 2, team: "Tigers", played: 6, won: 4, lost: 2, pts: 12 },
    { rank: 3, team: "Blue Team", played: 6, won: 3, lost: 3, pts: 9 },
  ])

  const checkUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/admin/login")
      } else {
        setUser(user)
      }
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/admin/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkUser()
  }, [checkUser])

  const handleSignOut = async () => {
    setShowSignOutDialog(false)
    setShowSignOutLoading(true)
    
    await supabase.auth.signOut()
    
    // Keep loading overlay for a moment before redirect
    setTimeout(() => {
      router.push("/admin/login")
    }, 1000)
  }

  // Navigation items
  const navItems = [
    { title: "Dashboard", icon: Home, url: "/admin/dashboard", isActive: false },
    { title: "Teams", icon: Users, url: "/admin/teams", isActive: false },
    { title: "Events", icon: Calendar, url: "/admin/events", isActive: false },
    { title: "Standings", icon: Trophy, url: "/admin/standings", isActive: true },
    { title: "Reports", icon: BarChart3, url: "/admin/reports", isActive: false },
    { title: "Settings", icon: Settings, url: "/admin/settings", isActive: false },
  ]

  return (
    <SidebarProvider>
      <Sidebar className="border-r-2 border-green-600">
        <SidebarHeader className="border-b border-green-100 p-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-20 h-20 rounded-full shadow-xl ring-4 ring-green-100 overflow-hidden">
              <Image
                src="/images/Benj.jpg"
                alt="Admin Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-semibold text-gray-900 truncate">Administrator</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      className="h-11 px-3 data-[active=true]:bg-gradient-to-r data-[active=true]:from-green-600 data-[active=true]:to-green-700 data-[active=true]:text-white data-[active=true]:shadow-md hover:bg-green-50 rounded-lg transition-all duration-200"
                    >
                      <Link href={item.url} className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-green-100 p-4">
          <button
            onClick={() => setShowSignOutDialog(true)}
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mr-2 shadow-md group-hover:shadow-lg transition-all">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            Sign Out
          </button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-green-700 bg-gradient-to-r from-green-900/95 to-green-800/95 backdrop-blur-lg px-4 shadow-lg">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 text-white hover:bg-green-800 hover:text-emerald-200" />
            <Separator orientation="vertical" className="h-6 bg-green-700" />
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md"></div>
                <Image
                  src="/Logos/Minsu.png"
                  alt="Minsu Logo"
                  width={36}
                  height={36}
                  className="relative rounded-full border border-emerald-500/30"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-200 to-emerald-300 bg-clip-text text-transparent leading-tight">
                  INTRAM
                </h1>
                <span className="text-xs text-emerald-400/70 hidden md:block">Management System</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center px-3 py-1.5 bg-green-800/50 rounded-lg border border-green-700/50">
              <span className="text-xs text-emerald-300 font-medium">Admin Panel</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-green-50/30 via-white to-green-50/30">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
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
                <p className="text-green-700 font-semibold text-xl tracking-wide">Loading Standings...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Standings</h2>
                  <p className="text-sm text-gray-500">Current leaderboard</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b">
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Team</th>
                      <th className="py-2 px-3">P</th>
                      <th className="py-2 px-3">W</th>
                      <th className="py-2 px-3">L</th>
                      <th className="py-2 px-3">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((s) => (
                      <tr key={s.rank} className="border-b last:border-b-0">
                        <td className="py-3 px-3">{s.rank}</td>
                        <td className="py-3 px-3 font-medium">{s.team}</td>
                        <td className="py-3 px-3">{s.played}</td>
                        <td className="py-3 px-3">{s.won}</td>
                        <td className="py-3 px-3">{s.lost}</td>
                        <td className="py-3 px-3">{s.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </SidebarInset>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to log in again to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sign Out Loading Overlay */}
      {showSignOutLoading && (
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
            <p className="text-green-700 font-semibold text-xl tracking-wide">Signing Out...</p>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}

