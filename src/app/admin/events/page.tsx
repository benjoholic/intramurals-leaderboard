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
  Shuffle
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
  type EventItem = { id: string; event_type?: string; time?: string; date?: string; location?: string; points?: number | null; first_point?: number | null; second_point?: number | null; third_point?: number | null }
  const [events, setEvents] = useState<EventItem[]>([])
  const [eventsError, setEventsError] = useState<string | null>(null)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newName, setNewName] = useState("")
  const [newTime, setNewTime] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newPoints, setNewPoints] = useState<number | "">("")
  const [newPoints1, setNewPoints1] = useState<string>("")
  const [newPoints2, setNewPoints2] = useState<string>("")
  const [newPoints3, setNewPoints3] = useState<string>("")
  const [viewEvent, setViewEvent] = useState<EventItem | null>(null)
  const [editEvent, setEditEvent] = useState<EventItem | null>(null)
  const [editName, setEditName] = useState("")
  const [editTime, setEditTime] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editPoints, setEditPoints] = useState<number | "">("")
  const [editFirst, setEditFirst] = useState<string>("")
  const [editSecond, setEditSecond] = useState<string>("")
  const [editThird, setEditThird] = useState<string>("")

  // Debug: log when editEvent changes to help diagnose UI clicks
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('editEvent state changed:', editEvent)
    } catch (e) {}
  }, [editEvent])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/events')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) setEvents(data.map((d: any) => ({ id: String(d.id), event_type: d.event_type, time: d.time, location: d.location, points: d.points ?? d.points_per_win ?? null, first_point: d.first_point ?? d.points_first ?? (d.points_breakdown?.first ?? null), second_point: d.second_point ?? d.points_second ?? (d.points_breakdown?.second ?? null), third_point: d.third_point ?? d.points_third ?? (d.points_breakdown?.third ?? null) })))
          setEventsError(null)
        } else {
          const raw = await res.text()
          let msg = raw
          try { const j = JSON.parse(raw); msg = j?.error || JSON.stringify(j) } catch (e) {}
          console.error('/api/events returned error', res.status, msg)
          setEventsError(msg)
        }
      } catch (err) {
        console.error('Failed to load events', err)
        setEventsError((err as any)?.message ?? String(err))
      }
    }
    load()
  }, [])

  async function addEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!newName) return
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: newName,
          // send separate point columns using requested names
          first_point: (newPoints1 !== '' && !Number.isNaN(Number(newPoints1))) ? Number(newPoints1) : null,
          second_point: (newPoints2 !== '' && !Number.isNaN(Number(newPoints2))) ? Number(newPoints2) : null,
          third_point: (newPoints3 !== '' && !Number.isNaN(Number(newPoints3))) ? Number(newPoints3) : null,
        })
      })
        if (!res.ok) {
        const raw = await res.text()
        let msg = raw
        try {
          const j = JSON.parse(raw)
          msg = j?.error || JSON.stringify(j)
        } catch (e) {
          // leave raw text
        }
        console.error('Failed to create event:', msg)
        // show user-friendly alert
        try { alert(`Failed to create event: ${msg}`) } catch (e) {}
      } else {
        const created = await res.json()
        // attach separate point fields to created record for UI display (new names)
        const createdWithPoints = { ...created, first_point: created.first_point ?? created.points_first ?? ((newPoints1 !== '' && !Number.isNaN(Number(newPoints1))) ? Number(newPoints1) : null), second_point: created.second_point ?? created.points_second ?? ((newPoints2 !== '' && !Number.isNaN(Number(newPoints2))) ? Number(newPoints2) : null), third_point: created.third_point ?? created.points_third ?? ((newPoints3 !== '' && !Number.isNaN(Number(newPoints3))) ? Number(newPoints3) : null) }
        setEvents((s) => [{ id: String(created.id), event_type: created.event_type ?? '', points: created.points ?? null, first_point: createdWithPoints.first_point, second_point: createdWithPoints.second_point, third_point: createdWithPoints.third_point }, ...s])
      }
    } catch (err) {
      console.error('Create event error', err)
      try { alert(`Failed to create event: ${(err as any)?.message ?? String(err)}`) } catch (e) {}
    }

    setNewName("")
    setNewPoints("")
    setNewPoints1("")
    setNewPoints2("")
    setNewPoints3("")
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
    { title: "Matches", icon: Shuffle, url: "/admin/matches", isActive: false },
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

              {eventsError ? (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-700">
                  <strong>Failed to load events:</strong> {eventsError}
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((ev) => (
                    <div key={ev.id} className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 pb-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 relative overflow-hidden border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-900">{ev.event_type}</h3>
                            <p className="text-sm text-gray-500 mt-1">{ev.location}</p>
                            { (ev.first_point != null || ev.second_point != null || ev.third_point != null) ? (
                              <div className="mt-3 inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                <Trophy className="w-3 h-3" />
                                <span>1st: {ev.first_point ?? ev.points ?? 0}</span>
                                <span className="opacity-70">•</span>
                                <span>2nd: {ev.second_point ?? 0}</span>
                                <span className="opacity-70">•</span>
                                <span>3rd: {ev.third_point ?? 0}</span>
                              </div>
                            ) : typeof ev.points === 'number' ? (
                              <div className="mt-3 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                                <Trophy className="w-3 h-3" />
                                <span>Points: {ev.points}</span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{ev.time ?? ev.date}</div>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-3">
                        <div className="flex-1 text-sm text-gray-500">&nbsp;</div>
                        <div className="flex gap-2">
                          <button className="inline-flex items-center rounded-full border px-3 py-2 text-sm bg-white/95 hover:bg-white" onClick={() => setViewEvent(ev)}>View</button>
                          <button className="inline-flex items-center rounded-full border px-3 py-2 text-sm bg-white/95 hover:bg-white" onClick={() => {
                            try { console.log('Edit button clicked for event', ev?.id) } catch (e) {}
                            setEditEvent(ev)
                            setEditName(ev.event_type ?? "")
                            // Prefill first/second/third point values (fallback to single points)
                            setEditFirst(ev.first_point != null ? String(ev.first_point) : (ev.points != null ? String(ev.points) : ""))
                            setEditSecond(ev.second_point != null ? String(ev.second_point) : "")
                            setEditThird(ev.third_point != null ? String(ev.third_point) : "")
                          }}>Edit</button>
                          <button className="inline-flex items-center rounded-full border px-3 py-2 text-sm text-red-600 bg-white/95 hover:bg-white" onClick={async () => {
                            const ok = window.confirm(`Delete event \"${ev.event_type}\"?`)
                            if (!ok) return

                            // If this is a local-only placeholder id (e.g. "e1"), just remove locally
                            const idStr = String(ev.id)
                            if (!/^-?\d+$/.test(idStr)) {
                              setEvents((s) => s.filter(e => e.id !== ev.id))
                              return
                            }

                            try {
                              // send id as query param (also accepted from JSON body on server)
                              const url = `/api/events?id=${encodeURIComponent(idStr)}`
                              const res = await fetch(url, { method: 'DELETE' })
                              const raw = await res.text()
                              let j: any = null
                              try { j = JSON.parse(raw) } catch (e) { j = null }
                              if (!res.ok) {
                                const msg = j?.error || raw || 'Failed to delete'
                                throw new Error(msg)
                              }
                              setEvents((s) => s.filter(e => e.id !== ev.id))
                            } catch (err: any) {
                              console.error('Delete event failed', err)
                              try { alert(`Failed to delete event: ${err?.message || String(err)}`) } catch (e) {}
                            }
                          }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {showAddEvent && (
                <div style={{ zIndex: 10000 }} className="fixed inset-0 flex items-center justify-center bg-black/40">
                  <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-semibold mb-4">Create Event</h3>
                    <form onSubmit={addEvent} className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-700">Event Type</label>
                        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Basketball" className="mt-1 block w-full rounded-lg border px-3 py-2" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm text-gray-700">1st (points)</label>
                          <input type="text" inputMode="numeric" value={newPoints1} onChange={(e) => setNewPoints1(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700">2nd (points)</label>
                          <input type="text" inputMode="numeric" value={newPoints2} onChange={(e) => setNewPoints2(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700">3rd (points)</label>
                          <input type="text" inputMode="numeric" value={newPoints3} onChange={(e) => setNewPoints3(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
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
                  <div style={{ zIndex: 10000 }} className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-extrabold">{(viewEvent as any).event_type}</h3>
                            <p className="text-sm text-gray-500 mt-2">{(viewEvent as any).location}</p>
                          </div>
                          <div className="text-sm text-gray-600">{(viewEvent as any).time ?? (viewEvent as any).date}</div>
                        </div>
                      </div>
                      <div className="p-6 flex justify-end gap-3">
                        <button className="rounded-md border px-3 py-1" onClick={() => {
                          // open edit modal prefilled
                          setEditEvent(viewEvent)
                          setViewEvent(null)
                          setEditName((viewEvent as any).event_type ?? "")
                          setEditFirst((viewEvent as any).first_point != null ? String((viewEvent as any).first_point) : ((viewEvent as any).points != null ? String((viewEvent as any).points) : ""))
                          setEditSecond((viewEvent as any).second_point != null ? String((viewEvent as any).second_point) : "")
                          setEditThird((viewEvent as any).third_point != null ? String((viewEvent as any).third_point) : "")
                        }}>Edit</button>
                        <button className="rounded-md px-3 py-1 bg-gray-100" onClick={() => setViewEvent(null)}>Close</button>
                      </div>
                    </div>
                  </div>
                ) : null}

              {/* Edit Event Modal */}
              {editEvent && (
                <div style={{ zIndex: 10000 }} className="fixed inset-0 flex items-center justify-center bg-black/40">
                  <div className="w-full max-w-md rounded-2xl bg-white p-6">
                    <h3 className="text-lg font-semibold mb-4">Edit Event</h3>
                    <div className="space-y-3">
                      <label className="block">
                        <span className="text-sm">Event Type</span>
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <label className="block">
                          <span className="text-sm">1st (points)</span>
                          <input type="text" inputMode="numeric" value={editFirst} onChange={(e) => setEditFirst(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">2nd (points)</span>
                          <input type="text" inputMode="numeric" value={editSecond} onChange={(e) => setEditSecond(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </label>
                        <label className="block">
                          <span className="text-sm">3rd (points)</span>
                          <input type="text" inputMode="numeric" value={editThird} onChange={(e) => setEditThird(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                        </label>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button className="rounded-md border px-3 py-1" onClick={() => setEditEvent(null)}>Cancel</button>
                      <button className="rounded bg-primary px-3 py-1 text-white" onClick={async () => {
                        try {
                          const body: any = { id: editEvent.id, event_type: editName }
                          if (editFirst !== '') body.first_point = !Number.isNaN(Number(editFirst)) ? Number(editFirst) : null
                          if (editSecond !== '') body.second_point = !Number.isNaN(Number(editSecond)) ? Number(editSecond) : null
                          if (editThird !== '') body.third_point = !Number.isNaN(Number(editThird)) ? Number(editThird) : null

                          const res = await fetch('/api/events', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                          const j = await res.json()
                          if (!res.ok) throw new Error(j?.error || 'Failed to update')
                          setEvents((s) => s.map(ev => ev.id === editEvent.id ? { ...ev, event_type: j.event_type ?? editName, first_point: j.first_point ?? body.first_point ?? ev.first_point, second_point: j.second_point ?? body.second_point ?? ev.second_point, third_point: j.third_point ?? body.third_point ?? ev.third_point } : ev))
                          setEditEvent(null)
                        } catch (err) {
                          console.error(err)
                          try { alert('Failed to update event') } catch (e) {}
                        }
                      }}>Save</button>
                    </div>
                  </div>
                </div>
              )}
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
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
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

