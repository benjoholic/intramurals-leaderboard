"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { 
  Home,
  Trophy,
  Calendar as CalendarIcon,
  Users,
  Activity,
  Award,
  Clock,
  MapPin,
  LogOut,
  Sparkles,
  ChevronRight,
  Play
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { DayButtonProps } from "react-day-picker"

type UserMetadata = {
  avatar?: string
  full_name?: string
  name?: string
}

type UserProfile = {
  email?: string
  id?: string
  user_metadata?: UserMetadata
}

export default function UserHome() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showSignOutLoading, setShowSignOutLoading] = useState(false)
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const checkUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/user/login")
      } else {
        setUser(user)
        // Load saved avatar from user metadata
        if (user.user_metadata?.avatar) {
          setSelectedAvatar(user.user_metadata.avatar)
        }
      }
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/user/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleAvatarSelect = async (avatar: string) => {
    if (!user?.id) return
    
    setIsUpdatingAvatar(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { avatar }
      })
      
      if (error) {
        console.error("Error updating avatar:", error)
      } else {
        setSelectedAvatar(avatar)
        setUser(prev => prev ? {
          ...prev,
          user_metadata: { ...(prev.user_metadata ?? {}), avatar }
        } : null)
        setShowAvatarDialog(false)
      }
    } catch (error) {
      console.error("Error updating avatar:", error)
    } finally {
      setIsUpdatingAvatar(false)
    }
  }

  // Avatar options - using emoji as placeholders
  const avatarOptions = [
    "👤", "👨", "👩", "🧑", "👨‍💼", "👩‍💼", "👨‍🎓", "👩‍🎓",
    "👨‍⚕️", "👩‍⚕️", "👨‍🏫", "👩‍🏫", "👨‍🔬", "👩‍🔬", "👨‍💻", "👩‍💻",
    "🧑‍🎨", "🧑‍🚀", "🧑‍✈️", "🧑‍🔧", "🧑‍🏭", "🧑‍🎤", "🧑‍🎬", "🧑‍🎪",
    "😊", "😎", "🤓", "😄", "😃", "😁", "🙂", "😉",
    "🏀", "⚽", "🏐", "🎾", "🏊", "🏃", "🏋️", "🤸"
  ]

  useEffect(() => {
    checkUser()
  }, [checkUser])

  const handleSignOut = async () => {
    setShowSignOutDialog(false)
    setShowSignOutLoading(true)
    
    await supabase.auth.signOut()
    
    setTimeout(() => {
      router.push("/user/login")
    }, 1000)
  }

  // Navigation items
  const navItems = [
    { title: "Home", icon: Home, url: "/user/home", isActive: true },
    { title: "Games", icon: Play, url: "#", isActive: false },
    { title: "My Teams", icon: Users, url: "#", isActive: false },
    { title: "Standings", icon: Trophy, url: "#", isActive: false },
    { title: "Activity", icon: Activity, url: "#", isActive: false },
  ]

  // Mock data - replace with actual data from your database
  const upcomingMatches = [
    { id: 1, sport: "Basketball", opponent: "Team Alpha", date: "2024-01-15", time: "3:00 PM", venue: "Court A" },
    { id: 2, sport: "Volleyball", opponent: "Team Beta", date: "2024-01-18", time: "4:00 PM", venue: "Court B" },
    { id: 3, sport: "Football", opponent: "Team Gamma", date: "2024-01-20", time: "2:00 PM", venue: "Field 1" },
  ]

  // Convert dates to Date objects for calendar
  const eventDates = upcomingMatches.map(match => new Date(match.date))
  
  // Check if a date has an event
  const hasEvent = (date: Date) => {
    return eventDates.some(eventDate => 
      format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return upcomingMatches.filter(match => 
      format(new Date(match.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  const recentResults = [
    { id: 1, sport: "Basketball", team: "Team Alpha", opponent: "Team Delta", result: "W", score: "45-38", date: "2024-01-10" },
    { id: 2, sport: "Tennis", team: "Team Beta", opponent: "Team Echo", result: "L", score: "2-3", date: "2024-01-08" },
    { id: 3, sport: "Volleyball", team: "Team Gamma", opponent: "Team Foxtrot", result: "W", score: "3-1", date: "2024-01-05" },
  ]

  // Top 3 teams for ranking
  const topTeams = [
    { rank: 1, name: "Team Alpha", points: 125 },
    { rank: 2, name: "Team Beta", points: 118 },
    { rank: 3, name: "Team Gamma", points: 112 },
  ]
  const currentGame = "Basketball" // Current game/sport name

  if (isLoading || showSignOutLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
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
    )
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r-2 border-green-600">
        <SidebarHeader className="border-b border-green-100 p-6">
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={() => setShowAvatarDialog(true)}
              className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95"
              aria-label="Change avatar"
            >
              <Avatar className="w-20 h-20 border-4 border-green-200 shadow-lg ring-4 ring-green-100 group-hover:ring-green-200 transition-all">
                {selectedAvatar ? (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-50 to-green-100">
                    {selectedAvatar}
                  </div>
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-700 text-white text-3xl font-bold">
                    {user?.user_metadata?.full_name?.charAt(0) || 
                     user?.user_metadata?.name?.charAt(0) || 
                     (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </button>
            <div className="text-center w-full">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.user_metadata?.full_name || 
                 user?.user_metadata?.name || 
                 (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User')}
              </p>
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
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={item.isActive}
                        className="h-11 px-3 data-[active=true]:bg-gradient-to-r data-[active=true]:from-green-600 data-[active=true]:to-green-700 data-[active=true]:text-white data-[active=true]:shadow-md hover:bg-green-50 rounded-lg transition-all duration-200"
                      >
                        <Link href={item.url} className="flex items-center space-x-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
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
                <span className="text-xs text-emerald-400/70 hidden md:block">User Portal</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center px-3 py-1.5 bg-green-800/50 rounded-lg border border-green-700/50">
              <span className="text-xs text-emerald-300 font-medium">User Account</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-green-50/30 via-white to-green-50/30">
          <div className="flex flex-1 flex-col gap-4">
          {/* Welcome Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="md:col-span-2 lg:col-span-4 border-green-200 bg-gradient-to-br from-green-600 to-green-800 text-white shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black mb-2">
                      Welcome back! 👋
                    </CardTitle>
                    <CardDescription className="text-green-100 text-lg">
                      {user?.email || "User"}
                    </CardDescription>
                  </div>
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 text-base">
                  Track your intramural activities, view upcoming matches, and check your team standings.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Teams</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">3</div>
                <p className="text-xs text-gray-500 mt-1">Active teams</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Upcoming Matches</CardTitle>
                <CalendarIcon className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{upcomingMatches.length}</div>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ongoing</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">5</div>
                <p className="text-xs text-gray-500 mt-1">Active games</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Top Teams</CardTitle>
                <Trophy className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="mb-3 pb-2 border-b border-green-100">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">{currentGame}</p>
                </div>
                <div className="space-y-2">
                  {topTeams.map((team) => (
                    <div key={team.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          team.rank === 1 ? 'bg-yellow-500 text-white' :
                          team.rank === 2 ? 'bg-gray-400 text-white' :
                          'bg-amber-600 text-white'
                        }`}>
                          {team.rank}
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate">{team.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{team.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar with Events */}
          <div className="grid gap-4">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                  Event Calendar
                </CardTitle>
                <CardDescription>Upcoming matches and events</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
                  classNames={{
                    day: "h-9 w-9 text-xs font-normal aria-selected:opacity-100",
                  }}
                  components={{
                    DayButton: ({ day, ...props }: DayButtonProps) => {
                      const dateStr = format(day.date, 'yyyy-MM-dd')
                      const hasEvents = hasEvent(day.date)
                      const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateStr
                      
                      return (
                        <button
                          {...props}
                          onClick={(e) => {
                            e?.preventDefault?.()
                            if (hasEvents) {
                              setSelectedDate(day.date)
                            }
                            if (props.onClick) {
                              props.onClick(e)
                            }
                          }}
                          className={`relative h-9 w-9 rounded-md text-sm font-normal transition-colors hover:bg-green-100 ${
                            day.date.toDateString() === new Date().toDateString()
                              ? 'bg-green-100 text-green-900 font-semibold'
                              : 'text-gray-900'
                          } ${
                            hasEvents ? 'bg-green-50 border border-green-300 cursor-pointer' : ''
                          } ${
                            isSelected ? 'ring-2 ring-green-600 ring-offset-2' : ''
                          }`}
                        >
                          {day.date.getDate()}
                          {hasEvents && (
                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                          )}
                        </button>
                      )
                    }
                  }}
                />
                {selectedDate && getEventsForDate(selectedDate).length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Matches on {format(selectedDate, 'MMMM d, yyyy')}
                    </p>
                    <div className="space-y-3">
                      {getEventsForDate(selectedDate).map((match) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-600 rounded-lg text-white font-bold text-sm">
                              {match.sport.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{match.sport}</p>
                              <p className="text-xs text-gray-600">vs {match.opponent}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-900 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {match.time}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {match.venue}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Legend:</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    <span>Event scheduled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Matches and Recent Results */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Upcoming Matches
                </CardTitle>
                <CardDescription>Your next scheduled games</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600 rounded-lg text-white font-bold text-sm">
                          {match.sport.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{match.sport}</p>
                          <p className="text-sm text-gray-600">vs {match.opponent}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{match.date}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {match.time}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {match.venue}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="#"
                  className="mt-4 flex items-center justify-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                >
                  View all matches
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Recent Results
                </CardTitle>
                <CardDescription>Your latest game outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg font-bold text-sm ${
                            result.result === "W"
                              ? "bg-green-600 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {result.result}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{result.sport}</p>
                          <p className="text-sm text-gray-600">{result.team} vs {result.opponent}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{result.score}</p>
                        <p className="text-xs text-gray-500">{result.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="#"
                  className="mt-4 flex items-center justify-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                >
                  View all results
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
          </div>
        </main>
      </SidebarInset>

      {/* Avatar Selection Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose Your Avatar</DialogTitle>
            <DialogDescription>
              Select an avatar to represent your profile
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-8 gap-3 p-4 max-h-[400px] overflow-y-auto">
            {avatarOptions.map((avatar, index) => (
              <button
                key={index}
                onClick={() => handleAvatarSelect(avatar)}
                disabled={isUpdatingAvatar}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-3xl
                  transition-all duration-200 hover:scale-110 active:scale-95
                  border-2 ${
                    selectedAvatar === avatar
                      ? 'border-green-600 bg-green-50 ring-2 ring-green-200'
                      : 'border-gray-200 bg-white hover:border-green-400 hover:bg-green-50'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                aria-label={`Select avatar ${avatar}`}
              >
                {avatar}
              </button>
            ))}
          </div>
          {isUpdatingAvatar && (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="ml-2 text-sm text-gray-600">Updating avatar...</span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sign Out Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  )
}

