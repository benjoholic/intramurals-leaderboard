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
  LogOut,
  Shuffle,
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

type Team = { id: string; name: string; color?: string; image?: string; department?: string; event?: string }

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function hexToRgba(hex?: string, alpha = 1) {
  if (!hex) return undefined
  try {
    const { r, g, b } = hexToRgb(hex)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } catch (e) {
    return undefined
  }
}

function readableTextColor(hex?: string) {
  if (!hex) return '#ffffff'
  try {
    const { r, g, b } = hexToRgb(hex)
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    return luminance > 0.6 ? '#0f172a' : '#ffffff'
  } catch (e) {
    return '#ffffff'
  }
}

export default function CoordinatorTeamsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showSignOutLoading, setShowSignOutLoading] = useState(false)

  const [teams, setTeams] = useState<Team[]>([])
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [viewTeam, setViewTeam] = useState<Team | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/teams')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setTeams(data.map((t: any) => ({ id: String(t.id), name: t.name, color: t.color, image: t.logo || null, department: t.department || undefined, event: t.event || undefined })))
        }
      } catch (err) {
        console.error('Failed to load teams', err)
      } finally {
        setTeamsLoading(false)
      }
    }
    load()
  }, [])

  const checkUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
      } else {
        setUser(user)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/admin/login')
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

    setTimeout(() => {
      router.push('/admin/login')
    }, 800)
  }

  const navItems = [
    { title: 'Dashboard', icon: Home, url: '/coordinator/dashboard', isActive: false },
    { title: 'Teams', icon: Users, url: '/coordinator/teams', isActive: true },
    { title: 'Events', icon: Calendar, url: '/coordinator/events', isActive: false },
    { title: 'Matches', icon: Shuffle, url: '/coordinator/matches', isActive: false },
    { title: 'Standings', icon: Trophy, url: '/coordinator/standings', isActive: false },
    { title: 'Reports', icon: BarChart3, url: '/coordinator/reports', isActive: false },
    { title: 'Settings', icon: Settings, url: '/coordinator/settings', isActive: false },
  ]

  return (
    <SidebarProvider>
      <Sidebar className="border-r-2 border-green-600">
        <SidebarHeader className="border-b border-green-100 p-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-20 h-20 rounded-full shadow-xl ring-4 ring-green-100 overflow-hidden">
              <Image src="/images/Benj.jpg" alt="Coordinator Avatar" width={80} height={80} className="w-full h-full object-cover" />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-semibold text-gray-900 truncate">Coordinator</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive} className="h-11 px-3 data-[active=true]:bg-gradient-to-r data-[active=true]:from-green-600 data-[active=true]:to-green-700 data-[active=true]:text-white data-[active=true]:shadow-md hover:bg-green-50 rounded-lg transition-all duration-200">
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
          <button onClick={() => setShowSignOutDialog(true)} className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md group">
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
                <Image src="/Logos/Minsu.png" alt="Minsu Logo" width={36} height={36} className="relative rounded-full border border-emerald-500/30" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-200 to-emerald-300 bg-clip-text text-transparent leading-tight">INTRAM</h1>
                <span className="text-xs text-emerald-400/70 hidden md:block">Management System</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center px-3 py-1.5 bg-green-800/50 rounded-lg border border-green-700/50">
              <span className="text-xs text-emerald-300 font-medium">Coordinator Panel</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-green-50/30 via-white to-green-50/30">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '-0.3s' }} />
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '-0.15s' }} />
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" />
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.15s' }} />
                </div>
                <p className="text-green-700 font-semibold text-xl tracking-wide">Loading Teams...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
                  <p className="text-sm text-gray-500">View-only list of teams assigned to you (read-only).</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamsLoading ? (
                  <div className="col-span-full bg-white rounded-2xl p-8 shadow text-center">
                    <p className="text-gray-500">Loading, please wait...</p>
                  </div>
                ) : teams.length === 0 ? (
                  <div className="col-span-full bg-white rounded-2xl p-8 shadow text-center">
                    <p className="text-gray-500">No teams yet.</p>
                  </div>
                ) : (
                  teams.map((team) => (
                    <div key={team.id} className="relative rounded-2xl p-0 shadow overflow-hidden bg-white">
                      <div className="flex">
                        <div className="w-4 rounded-l-2xl" style={{ background: team.color || '#10b981' }} />
                        <div className="flex-1 p-6 pb-14">
                          <div className="relative mb-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-4">
                                {team.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={team.image} alt={`${team.name} logo`} className="w-12 h-12 rounded-xl object-cover" />
                                ) : (
                                  <div style={{ backgroundColor: hexToRgba(team.color, 0.9) }} className="w-12 h-12 rounded-xl shadow-inner flex items-center justify-center text-white font-semibold">{(team.name || '').slice(0,2).toUpperCase()}</div>
                                )}
                              </div>
                              <div className="flex-1" />
                            </div>

                            <h3 className="absolute left-1/2 top-6 transform -translate-x-1/2 text-2xl font-extrabold truncate w-[70%] text-center text-gray-900">{team.name}</h3>

                            <div className="mt-10 flex items-center justify-center gap-2">
                              {team.event ? <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-sm font-medium">{team.event}</span> : null}
                              {team.department ? <span className="rounded-full bg-slate-50 text-slate-700 px-3 py-1 text-sm font-medium">{team.department}</span> : null}
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-700">Team details are view-only for coordinators.</p>
                          </div>

                          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                            <button className="inline-flex items-center rounded-md border px-3 py-1 text-sm bg-white/90" style={{ borderColor: hexToRgba(team.color, 0.2) }} onClick={() => setViewTeam(team)}>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </SidebarInset>

      {/* View Team Modal (admin-style, read-only) */}
      {viewTeam ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div
              className="p-6"
              style={{ background: viewTeam.color || '#10b981' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="h-20 w-20 rounded-full ring-4 ring-white overflow-hidden flex items-center justify-center text-white text-xl font-bold"
                  style={{ background: viewTeam.color || '#10b981' }}
                >
                  {viewTeam.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={viewTeam.image} alt={viewTeam.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="uppercase">{(viewTeam.name || '').slice(0, 2)}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-2xl font-extrabold truncate" style={{ color: readableTextColor(viewTeam.color) }}>{viewTeam.name}</h3>
                  <p className="mt-1 text-sm truncate" style={{ color: readableTextColor(viewTeam.color) }}>{viewTeam.department ?? 'No department'}</p>
                </div>

                <div className="ml-auto text-sm hidden sm:block" style={{ color: readableTextColor(viewTeam.color) }}>ID: {viewTeam.id}</div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                {viewTeam.event ? (
                  <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-sm font-medium">{viewTeam.event}</span>
                ) : null}
                {viewTeam.department ? (
                  <span className="rounded-full bg-slate-50 text-slate-700 px-3 py-1 text-sm font-medium">{viewTeam.department}</span>
                ) : null}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button className="rounded-md px-3 py-1 bg-gray-100" onClick={() => setViewTeam(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to sign out? You will need to log in again to access the coordinator panel.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showSignOutLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="text-green-700 font-semibold">Signing Out…</div>
        </div>
      )}
    </SidebarProvider>
  )
}
