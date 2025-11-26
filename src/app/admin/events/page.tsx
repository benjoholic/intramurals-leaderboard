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

export default function EventsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showSignOutLoading, setShowSignOutLoading] = useState(false)
  type EventItem = { id: string; event_type?: string; time?: string; date?: string; location?: string; matchup?: string; team_a_id?: number | string | null; team_b_id?: number | string | null }
  const [events, setEvents] = useState<EventItem[]>([
    { id: "e1", event_type: "Basketball", time: "2025-12-01T18:00", location: "Main Court", matchup: "Eagles vs Tigers" },
    { id: "e2", event_type: "Volleyball", time: "2025-12-10T15:00", location: "Gym 2", matchup: "Blue Team vs Red Team" },
  ])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newName, setNewName] = useState("Basketball")
  const [newTime, setNewTime] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newMatchup, setNewMatchup] = useState("")
  const [teamsList, setTeamsList] = useState<{ id: string; name: string }[]>([])
  const [newTeamA, setNewTeamA] = useState<string | null>(null)
  const [newTeamB, setNewTeamB] = useState<string | null>(null)
  const [viewEvent, setViewEvent] = useState<EventItem | null>(null)
  const [editEvent, setEditEvent] = useState<EventItem | null>(null)
  const [editName, setEditName] = useState("")
  const [editTime, setEditTime] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editMatchup, setEditMatchup] = useState("")
  const [editTeamA, setEditTeamA] = useState<string | null>(null)
  const [editTeamB, setEditTeamB] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/events')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setEvents(data.map((d: any) => ({ id: String(d.id), event_type: d.event_type, time: d.time, location: d.location, matchup: d.matchup })))
        }
      } catch (err) {
        console.error('Failed to load events', err)
      }
    }
    load()
    // load teams for matchup selects
    ;(async function loadTeams(){
      try{
        const r = await fetch('/api/teams')
        if(r.ok){
          const ts = await r.json()
          if(Array.isArray(ts)) setTeamsList(ts.map((t: any) => ({ id: String(t.id), name: t.name })))
        }
      }catch(e){
        console.error('Failed to load teams for event matchup', e)
      }
    })()
  }, [])

  async function addEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!newName || !newTime) return
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: newName,
          time: newTime,
          location: newLocation,
          matchup: newMatchup,
          team_a_id: newTeamA || null,
          team_b_id: newTeamB || null,
        })
      })
        if (!res.ok) {
        console.error('Failed to create event', await res.text())
        setEvents((s) => [{ id: String(Date.now()), event_type: newName, time: newTime, location: newLocation, matchup: newMatchup }, ...s])
      } else {
        const created = await res.json()
        setEvents((s) => [{ id: String(created.id), event_type: created.event_type ?? '', time: created.time, location: created.location, matchup: created.matchup }, ...s])
      }
    } catch (err) {
      console.error('Create event error', err)
      setEvents((s) => [{ id: String(Date.now()), event_type: newName, time: newTime, location: newLocation, matchup: newMatchup }, ...s])
    }

    setNewName("Basketball")
    setNewTime("")
    setNewLocation("")
    setNewMatchup("")
    setShowAddEvent(false)
  }

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
    { title: "Events", icon: Calendar, url: "/admin/events", isActive: true },
    { title: "Standings", icon: Trophy, url: "/admin/standings", isActive: false },
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
                <p className="text-green-700 font-semibold text-xl tracking-wide">Loading Events...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Events</h2>
                  <p className="text-sm text-gray-500">Schedule and manage events</p>
                </div>
                <div>
                  <button onClick={() => setShowAddEvent(true)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg">Add Event</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((ev) => (
                    <div key={ev.id} className="bg-white rounded-2xl p-6 shadow relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{ev.event_type}</h3>
                          {ev.matchup ? <p className="text-sm text-gray-700">{ev.matchup}</p> : null}
                          <p className="text-sm text-gray-500">{ev.location}</p>
                        </div>
                        <div className="text-sm text-gray-600">{ev.time ?? ev.date}</div>
                      </div>

                      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                        <button className="inline-flex items-center rounded-md border px-3 py-1 text-sm bg-white/90" onClick={() => setViewEvent(ev)}>View</button>
                        <button className="inline-flex items-center rounded-md border px-3 py-1 text-sm bg-white/90" onClick={() => {
                          setEditEvent(ev)
                          setEditName(ev.event_type ?? "")
                          setEditTime(ev.time ?? ev.date ?? "")
                          setEditLocation(ev.location ?? "")
                          setEditMatchup(ev.matchup ?? "")
                          setEditTeamA(ev.team_a_id ? String(ev.team_a_id) : null)
                          setEditTeamB(ev.team_b_id ? String(ev.team_b_id) : null)
                        }}>Edit</button>
                        <button className="inline-flex items-center rounded-md border px-3 py-1 text-sm text-red-600" onClick={async () => {
                          const ok = window.confirm(`Delete event \"${ev.event_type}\"?`)
                          if (!ok) return
                          try {
                            const res = await fetch('/api/events', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: ev.id }) })
                            const j = await res.json()
                            if (!res.ok) throw new Error(j?.error || 'Failed to delete')
                            setEvents((s) => s.filter(e => e.id !== ev.id))
                          } catch (err) {
                            console.error(err)
                            alert('Failed to delete event')
                          }
                        }}>Delete</button>
                      </div>
                    </div>
                  ))}
              </div>

              {showAddEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-semibold mb-4">Create Event</h3>
                    <form onSubmit={addEvent} className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700">Event Type</label>
                        <select value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2">
                          <option>Basketball</option>
                          <option>Volleyball</option>
                          <option>Soccer</option>
                          <option>Baseball</option>
                          <option>Tennis</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Time</label>
                        <input type="datetime-local" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Location</label>
                        <input value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">Matchup</label>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                          <select value={newTeamA ?? ""} onChange={(e) => {
                            const id = e.target.value || null
                            setNewTeamA(id)
                            const a = teamsList.find(t => t.id === id)
                            const b = teamsList.find(t => t.id === newTeamB)
                            setNewMatchup(a && b ? `${a.name} vs ${b.name}` : "")
                          }} className="block w-full rounded-lg border px-3 py-2">
                            <option value="">Select Team A</option>
                            {teamsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                          <select value={newTeamB ?? ""} onChange={(e) => {
                            const id = e.target.value || null
                            setNewTeamB(id)
                            const a = teamsList.find(t => t.id === newTeamA)
                            const b = teamsList.find(t => t.id === id)
                            setNewMatchup(a && b ? `${a.name} vs ${b.name}` : "")
                          }} className="block w-full rounded-lg border px-3 py-2">
                            <option value="">Select Team B</option>
                            {teamsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowAddEvent(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg">Create</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

                {/* View Event Modal */}
                {viewEvent ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-extrabold">{(viewEvent as any).event_type}</h3>
                            {viewEvent.matchup ? <p className="text-sm text-gray-700 mt-2">{viewEvent.matchup}</p> : null}
                            <p className="text-sm text-gray-500 mt-2">{viewEvent.location}</p>
                          </div>
                          <div className="text-sm text-gray-600">{viewEvent.time ?? viewEvent.date}</div>
                        </div>
                      </div>
                      <div className="p-6 flex justify-end gap-3">
                        <button className="rounded-md border px-3 py-1" onClick={() => {
                          // open edit modal prefilled
                          setEditEvent(viewEvent)
                          setViewEvent(null)
                          setEditName((viewEvent as any).event_type ?? "")
                          setEditTime(viewEvent.time ?? viewEvent.date ?? "")
                          setEditLocation(viewEvent.location ?? "")
                          setEditMatchup(viewEvent.matchup ?? "")
                          setEditTeamA((viewEvent as any).team_a_id ? String((viewEvent as any).team_a_id) : null)
                          setEditTeamB((viewEvent as any).team_b_id ? String((viewEvent as any).team_b_id) : null)
                        }}>Edit</button>
                        <button className="rounded-md px-3 py-1 bg-gray-100" onClick={() => setViewEvent(null)}>Close</button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Edit Event Modal */}
                {editEvent ? (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6">
                      <h3 className="text-lg font-semibold mb-4">Edit Event</h3>
                      <div className="space-y-3">
                        <label className="block">
                          <span className="text-sm">Event Type</span>
                          <input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Time</span>
                          <input type="datetime-local" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Location</span>
                          <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">Matchup</span>
                          <div className="mt-1 grid grid-cols-2 gap-2">
                            <select value={editTeamA ?? ""} onChange={(e) => { const id = e.target.value || null; setEditTeamA(id); const a = teamsList.find(t => t.id === id); const b = teamsList.find(t => t.id === editTeamB); setEditMatchup(a && b ? `${a.name} vs ${b.name}` : ''); }} className="block w-full rounded-lg border px-3 py-2">
                              <option value="">Select Team A</option>
                              {teamsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <select value={editTeamB ?? ""} onChange={(e) => { const id = e.target.value || null; setEditTeamB(id); const a = teamsList.find(t => t.id === editTeamA); const b = teamsList.find(t => t.id === id); setEditMatchup(a && b ? `${a.name} vs ${b.name}` : ''); }} className="block w-full rounded-lg border px-3 py-2">
                              <option value="">Select Team B</option>
                              {teamsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                          </div>
                        </label>
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button className="rounded-md border px-3 py-1" onClick={() => setEditEvent(null)}>Cancel</button>
                        <button className="rounded bg-primary px-3 py-1 text-white" onClick={async () => {
                          try {
                            const res = await fetch('/api/events', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editEvent.id, event_type: editName, time: editTime, location: editLocation, matchup: editMatchup, team_a_id: editTeamA, team_b_id: editTeamB }) })
                            const j = await res.json()
                            if (!res.ok) throw new Error(j?.error || 'Failed to update')
                            // update local state
                            setEvents((s) => s.map(ev => ev.id === editEvent.id ? { id: String(j.id ?? editEvent.id), event_type: j.event_type ?? editName, time: j.time ?? editTime, location: j.location ?? editLocation, matchup: j.matchup ?? editMatchup } : ev))
                            setEditEvent(null)
                          } catch (err) {
                            console.error(err)
                            alert('Failed to update event')
                          }
                        }}>Save</button>
                      </div>
                    </div>
                  </div>
                ) : null}
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

