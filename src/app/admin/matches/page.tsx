"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Home, Users, Calendar, Trophy, Settings, BarChart3, LogOut, Shuffle, Clock, MapPin, X } from "lucide-react"
import DefaultCard from '../matches_cards/DefaultCard'
import BasketballCard from '../matches_cards/BasketballCard'
import VolleyballCard from '../matches_cards/VolleyballCard'
import RunningCard from '../matches_cards/RunningCard'
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
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

export default function MatchesPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showSignOutLoading, setShowSignOutLoading] = useState(false)

  const [teamsList, setTeamsList] = useState<{ id: string; name: string; logo?: string | null; department?: string | null }[]>([])
  const [eventsList, setEventsList] = useState<{ id: string; event_type?: string; location?: string | null }[]>([])
  const [matchesList, setMatchesList] = useState<any[]>([])

  const [showAddMatch, setShowAddMatch] = useState(false)
  const [newTeamA, setNewTeamA] = useState<string | null>(null)
  const [newTeamB, setNewTeamB] = useState<string | null>(null)
  const [newEventId, setNewEventId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState<string>("")
  const [newTime, setNewTime] = useState<string>("")
  const [newGender, setNewGender] = useState<string | null>(null)
  const [newLocation, setNewLocation] = useState<string>("")
  const [participants, setParticipants] = useState<string[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null)

  const navItems = [
    { title: "Dashboard", icon: Home, url: "/admin/dashboard", isActive: false },
    { title: "Teams", icon: Users, url: "/admin/teams", isActive: false },
    { title: "Events", icon: Calendar, url: "/admin/events", isActive: false },
    { title: "Matches", icon: Shuffle, url: "/admin/matches", isActive: true },
    { title: "Standings", icon: Trophy, url: "/admin/standings", isActive: false },
    { title: "Reports", icon: BarChart3, url: "/admin/reports", isActive: false },
    { title: "Settings", icon: Settings, url: "/admin/settings", isActive: false },
  ]

  async function loadLookups() {
    try {
      const [tRes, eRes, mRes] = await Promise.all([fetch("/api/teams"), fetch("/api/events"), fetch("/api/matches")])
      if (tRes.ok) {
        const ts = await tRes.json()
        if (Array.isArray(ts)) setTeamsList(ts.map((t: any) => ({ id: String(t.id), name: t.name, logo: t.logo_url ?? t.logo ?? t.image_url ?? t.avatar_url ?? null, department: t.department ?? t.dept ?? null })))
      }
      if (eRes.ok) {
        const es = await eRes.json()
        if (Array.isArray(es)) setEventsList(es.map((ev: any) => ({ id: String(ev.id), event_type: ev.event_type ?? ev.name ?? ev.title, location: ev.location ?? null })))
      }
      if (mRes.ok) {
        const ms = await mRes.json()
        if (Array.isArray(ms)) setMatchesList(ms)
      }
    } catch (err) {
      console.error('loadLookups error', err)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    loadLookups().finally(() => setIsLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-400"
      case "completed":
        return "bg-green-400"
      case "live":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  const getEventStyle = (eventType?: string) => {
    const t = (eventType ?? '').toLowerCase()
    switch (t) {
      case 'basketball':
        return { header: 'bg-orange-600', bannerFrom: 'from-orange-700', bannerTo: 'to-orange-500' }
      case 'volleyball':
        return { header: 'bg-emerald-600', bannerFrom: 'from-emerald-700', bannerTo: 'to-emerald-500' }
      case 'running':
      case 'track':
        return { header: 'bg-sky-600', bannerFrom: 'from-sky-700', bannerTo: 'to-sky-500' }
      case 'football':
      case 'soccer':
        return { header: 'bg-red-600', bannerFrom: 'from-red-700', bannerTo: 'to-red-500' }
      default:
        return { header: 'bg-green-600', bannerFrom: 'from-emerald-700', bannerTo: 'to-emerald-500' }
    }
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r-2 border-green-600">
        <SidebarHeader className="border-b border-green-100 p-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-20 h-20 rounded-full shadow-xl ring-4 ring-green-100 overflow-hidden">
              <Image src="/images/Benj.jpg" alt="Admin Avatar" width={80} height={80} className="w-full h-full object-cover" />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-semibold text-gray-900 truncate">Administrator</p>
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
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-green-50/30 via-white to-green-50/30">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '-0.3s' }}></div>
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '-0.15s' }}></div>
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg"></div>
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.15s' }}></div>
                </div>
                <p className="text-green-700 font-semibold text-xl tracking-wide">Loading Matches...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Matches</h2>
                  <p className="text-sm text-gray-500">Manage scheduled matches</p>
                </div>
                <div>
                  <button onClick={() => setShowAddMatch(true)} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg">Add Match</button>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchesList.length === 0 ? (
                  <div className="bg-white rounded-2xl p-6 shadow text-center">
                    <p className="text-sm text-gray-600">No matches yet. Create one using the button above.</p>
                  </div>
                ) : (
                  matchesList.map((m) => {
                    const teamA = teamsList.find(t => String(t.id) === String(m.team_a_id))
                    const teamB = teamsList.find(t => String(t.id) === String(m.team_b_id))
                    const ev = eventsList.find(e => String(e.id) === String(m.event_id))
                    const d = m.time ? new Date(m.time) : null
                    const formattedDate = d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''
                    const formattedTime = d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''
                    const isCompleted = (typeof m.score_a === 'number' || typeof m.score_b === 'number') || (d ? d < new Date() : false)
                    const status = m.status ?? (isCompleted ? 'completed' : 'upcoming')

                    const cardProps = { m, ev, teamA, teamB, formattedDate, formattedTime, status, evtStyle: getEventStyle(ev?.event_type), onView: () => { setSelectedMatch(m); setShowDetails(true); }, onDelete: async () => {
                        if (!confirm('Delete this match? This action cannot be undone.')) return
                        try {
                          const res = await fetch('/api/matches', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.id }) })
                          if (!res.ok) {
                            const err = await res.json().catch(() => ({}))
                            alert('Failed to delete match: ' + (err?.error || res.statusText))
                            return
                          }
                          // remove locally
                          setMatchesList(prev => prev.filter(x => String(x.id) !== String(m.id)))
                        } catch (err) {
                          console.error('Delete match error', err)
                          alert('Failed to delete match')
                        }
                      } }
                    const et = (ev?.event_type ?? '').toLowerCase()
                    const CardComponent = et.includes('basketball') ? BasketballCard : et.includes('running') || et.includes('track') ? RunningCard : et.includes('volleyball') ? VolleyballCard : DefaultCard
                    return <CardComponent key={m.id} {...cardProps} />
                  })
                )}
              </div>
            </>
          )}
        </main>
      </SidebarInset>

      {showAddMatch && (
        <div className="fixed inset-0 z-50 overflow-auto py-8 sm:py-12 flex items-start sm:items-center justify-center bg-black/40">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-2xl p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Match</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const selectedEvent = eventsList.find(ev => String(ev.id) === String(newEventId))
              const isRunning = ((selectedEvent?.event_type ?? '').toLowerCase().includes('running') || (selectedEvent?.event_type ?? '').toLowerCase().includes('track'))
              if (!newEventId || !newDate || !newTime) return alert('Please choose an event, date, and time')
              if (!isRunning) {
                if (!newTeamA || !newTeamB) return alert('Please choose both teams')
                if (newTeamA === newTeamB) return alert('Please choose two different teams')
              } else {
                // running event: require at least one participant name
                if (!participants || participants.length === 0 || participants.every(p => !p || p.trim() === '')) return alert('Please add at least one participant name')
              }
              // combine date and time into an ISO-like string matching datetime-local format
              const combined = `${newDate}T${newTime}`
              const payload: any = {
                event_id: newEventId,
                time: combined,
              }
              if (!isRunning) {
                if (newTeamA) payload.team_a_id = newTeamA
                if (newTeamB) payload.team_b_id = newTeamB
              } else {
                // include participants array
                payload.participants = participants.map((p) => p.trim()).filter((p) => p && p.length > 0)
              }
              if (newGender && newGender !== '') payload.gender = newGender
              if (newLocation && newLocation.trim() !== '') payload.location = newLocation.trim()
              try{
                const res = await fetch('/api/matches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                if (!res.ok) {
                  // fallback: just close and show success locally
                  console.warn('POST /api/matches failed, falling back to local behavior')
                  setShowAddMatch(false)
                  return
                }
                const created = await res.json()
                setMatchesList(s => [created, ...s])
                setShowAddMatch(false)
              }catch(err){
                console.error('Create match error', err)
                setShowAddMatch(false)
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Event</label>
                <select value={newEventId ?? ""} onChange={(e) => {
                  const val = e.target.value || null
                  setNewEventId(val)
                  const selected = eventsList.find(ev => String(ev.id) === String(val))
                  setNewLocation(selected?.location ?? "")
                }} className="mt-1 block w-full rounded-lg border px-3 py-2">
                  <option value="">Select Event</option>
                  {eventsList.map(ev => <option key={ev.id} value={ev.id}>{ev.event_type}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700">Category</label>
                <select value={newGender ?? ""} onChange={(e) => setNewGender(e.target.value || null)} className="mt-1 block w-full rounded-lg border px-3 py-2">
                  <option value="">Select Category</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {/* If event is a running/track event, show participant input boxes instead of Team selects */}
              {((eventsList.find(ev => String(ev.id) === String(newEventId))?.event_type) ?? '').toLowerCase().includes('running') || ((eventsList.find(ev => String(ev.id) === String(newEventId))?.event_type) ?? '').toLowerCase().includes('track') ? (
                <div>
                  <label className="block text-sm text-gray-700">Participants</label>
                  <div className="space-y-2 mt-1">
                    {participants.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input value={p} onChange={(e) => setParticipants(ps => ps.map((x,i) => i===idx ? e.target.value : x))} placeholder={`Player ${idx+1} name`} className="block w-full rounded-lg border px-3 py-2" />
                        <button type="button" onClick={() => setParticipants(ps => ps.filter((_,i) => i!==idx))} className="px-3 py-2 bg-red-100 text-red-700 rounded">-</button>
                      </div>
                    ))}
                    <div>
                      <button type="button" onClick={() => setParticipants(ps => [...ps, ''])} className="px-3 py-2 bg-green-600 text-white rounded">+ Add player</button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter player names for running events. Add as many as needed.</p>
                  </div>
                </div>
                ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">Team A</label>
                    <Select value={newTeamA ?? ""} onValueChange={(val) => setNewTeamA(val || null)}>
                      {(() => {
                        const selA = teamsList.find(t => String(t.id) === String(newTeamA))
                        return (
                          <SelectTrigger className="mt-1 block w-full rounded-lg border px-3 py-2">
                            <div className="w-full flex items-center justify-between">
                              <span className="truncate">{selA?.name ?? 'Select Team A'}</span>
                              <span className="ml-4 text-gray-500">{selA?.department ?? ''}</span>
                            </div>
                          </SelectTrigger>
                        )
                      })()}
                      <SelectContent side="bottom" align="start" position="popper">
                        {teamsList.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <div className="w-full flex items-center justify-between">
                              <span className="truncate">{t.name}</span>
                              <span className="ml-4 text-gray-500">{t.department ?? ''}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">Team B</label>
                    <Select value={newTeamB ?? ""} onValueChange={(val) => setNewTeamB(val || null)}>
                      {(() => {
                        const selB = teamsList.find(t => String(t.id) === String(newTeamB))
                        return (
                          <SelectTrigger className="mt-1 block w-full rounded-lg border px-3 py-2">
                            <div className="w-full flex items-center justify-between">
                              <span className="truncate">{selB?.name ?? 'Select Team B'}</span>
                              <span className="ml-4 text-gray-500">{selB?.department ?? ''}</span>
                            </div>
                          </SelectTrigger>
                        )
                      })()}
                      <SelectContent side="bottom" align="start" position="popper">
                        {teamsList.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            <div className="w-full flex items-center justify-between">
                              <span className="truncate">{t.name}</span>
                              <span className="ml-4 text-gray-500">{t.department ?? ''}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700">Date</label>
                  <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Time</label>
                  <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="mt-1 block w-full rounded-lg border px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700">Location</label>
                <input value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="Enter location or keep event default" className="mt-1 block w-full rounded-lg border px-3 py-2" />
                <p className="text-xs text-gray-500 mt-1">Defaults from the selected event but can be edited here.</p>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddMatch(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to sign out? You will need to log in again to access the admin panel.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { setShowSignOutDialog(false); setShowSignOutLoading(true); await supabase.auth.signOut(); setTimeout(() => router.push('/admin/login'), 800) }} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Match Details Modal */}
      {showDetails && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Themed gradient banner with date/time/location */}
            <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-r ${getEventStyle(eventsList.find(e => String(e.id) === String(selectedMatch?.event_id))?.event_type).bannerFrom} ${getEventStyle(eventsList.find(e => String(e.id) === String(selectedMatch?.event_id))?.event_type).bannerTo} text-white`}>
              <div className="h-full px-8 pr-20 flex items-center justify-between">
                <div className="text-sm text-white/90">Match ID: {selectedMatch.id}</div>
                <div className="flex items-center gap-6 text-sm text-white/95">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/95" />
                    <span className="whitespace-nowrap">{selectedMatch.time ? new Date(selectedMatch.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/95" />
                    <span className="whitespace-nowrap">{selectedMatch.time ? new Date(selectedMatch.time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/95" />
                    <span className="whitespace-nowrap">{selectedMatch.location ?? eventsList.find(e => String(e.id) === String(selectedMatch.event_id))?.location ?? ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-8">
              <button aria-label="Close details" onClick={() => setShowDetails(false)} className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-50 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* add top padding so content sits below the themed banner */}
            <div className="px-8 pt-12 pb-6">
              <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900">{(eventsList.find(e => String(e.id) === String(selectedMatch.event_id))?.event_type) ?? 'Match Details'}</h3>
                    {/* date/time/location now shown in the colored banner header */}
                  </div>
                <div className="inline-flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">{eventsList.find(e => String(e.id) === String(selectedMatch.event_id))?.event_type}</span>
                </div>
              </div>

              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              <div className="mt-8 flex items-center justify-between gap-6">
                {(((eventsList.find(e => String(e.id) === String(selectedMatch.event_id))?.event_type) ?? '').toLowerCase().includes('running') || ((eventsList.find(e => String(e.id) === String(selectedMatch.event_id))?.event_type) ?? '').toLowerCase().includes('track')) ? (
                  <div className="w-full">
                    <h4 className="text-lg font-bold text-gray-900">Participants</h4>
                    <div className="mt-4 space-y-3">
                      {(selectedMatch.participants && Array.isArray(selectedMatch.participants) && selectedMatch.participants.length > 0) ? (
                        selectedMatch.participants.map((p: string, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center font-bold text-sky-700">{i+1}</div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{p}</div>
                              </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-900">--:--</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">No entrants yet</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Team A */}
                    <div className="flex-1 flex flex-col items-center text-center">
                      {(() => {
                        const teamA = teamsList.find(t => String(t.id) === String(selectedMatch.team_a_id))
                        if (teamA?.logo) return (<div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-emerald-50 shadow-md"><Image src={teamA.logo} alt={teamA.name} width={128} height={128} className="w-32 h-32 object-cover" /></div>)
                        return (<div className="w-32 h-32 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-2xl ring-4 ring-emerald-50 shadow-md">{(teamA?.name||'').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>)
                      })()}
                      <div className="w-20 h-px bg-gray-100 mt-4" />
                      <p className="mt-4 text-lg font-semibold text-gray-900">{teamsList.find(t => String(t.id) === String(selectedMatch.team_a_id))?.name}</p>
                      {/* Result selector for Team A */}
                      <div className="mt-2">
                        <label className="sr-only">Team A result</label>
                        <select value={selectedMatch.team_a_result ?? (selectedMatch.score_a != null && selectedMatch.score_b != null ? (selectedMatch.score_a > selectedMatch.score_b ? 'Win' : selectedMatch.score_a < selectedMatch.score_b ? 'Lose' : 'Draw') : '')} onChange={(e) => setSelectedMatch((s: any) => ({ ...s, team_a_result: e.target.value }))} className="block w-32 rounded-md border px-2 py-1 text-sm">
                          <option value="">Result</option>
                          <option value="Win">Win</option>
                          <option value="Lose">Lose</option>
                          <option value="Draw">Draw</option>
                        </select>
                      </div>
                      <p className="mt-2 text-4xl font-extrabold text-gray-900">{selectedMatch.score_a ?? '0'}</p>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-400 shadow-md flex items-center justify-center">
                        <div className="text-6xl font-extrabold text-white">VS</div>
                      </div>
                    </div>

                    {/* Team B */}
                    <div className="flex-1 flex flex-col items-center text-center">
                      {(() => {
                        const teamB = teamsList.find(t => String(t.id) === String(selectedMatch.team_b_id))
                        if (teamB?.logo) return (<div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-sky-50 shadow-md"><Image src={teamB.logo} alt={teamB.name} width={128} height={128} className="w-32 h-32 object-cover" /></div>)
                        return (<div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-2xl ring-4 ring-sky-50 shadow-md">{(teamB?.name||'').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>)
                      })()}
                      <div className="w-20 h-px bg-gray-100 mt-4" />
                      <p className="mt-4 text-lg font-semibold text-gray-900">{teamsList.find(t => String(t.id) === String(selectedMatch.team_b_id))?.name}</p>
                      {/* Result selector for Team B */}
                      <div className="mt-2">
                        <label className="sr-only">Team B result</label>
                        <select value={selectedMatch.team_b_result ?? (selectedMatch.score_a != null && selectedMatch.score_b != null ? (selectedMatch.score_b > selectedMatch.score_a ? 'Win' : selectedMatch.score_b < selectedMatch.score_a ? 'Lose' : 'Draw') : '')} onChange={(e) => setSelectedMatch((s: any) => ({ ...s, team_b_result: e.target.value }))} className="block w-32 rounded-md border px-2 py-1 text-sm">
                          <option value="">Result</option>
                          <option value="Win">Win</option>
                          <option value="Lose">Lose</option>
                          <option value="Draw">Draw</option>
                        </select>
                      </div>
                      <p className="mt-2 text-4xl font-extrabold text-gray-900">{selectedMatch.score_b ?? '0'}</p>
                    </div>
                  </>
                )}
              </div>

              {/* date/time/location moved to header */}

              <div className="mt-8 flex justify-end">
                <button onClick={() => setShowDetails(false)} className="px-4 py-2 rounded-full border bg-white hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSignOutLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex space-x-3">
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '-0.3s' }}></div>
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '-0.15s' }}></div>
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg"></div>
              <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.15s' }}></div>
            </div>
            <p className="text-green-700 font-semibold text-xl tracking-wide">Signing Out...</p>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}
