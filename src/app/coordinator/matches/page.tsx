"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Home, Users, Calendar, Trophy, Settings, BarChart3, LogOut, Shuffle, Clock, MapPin, X } from "lucide-react"
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

export default function CoordinatorMatchesPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showSignOutLoading, setShowSignOutLoading] = useState(false)

  const [teamsList, setTeamsList] = useState<{ id: string; name: string; logo?: string | null }[]>([])
  const [eventsList, setEventsList] = useState<{ id: string; event_type?: string; location?: string | null }[]>([])
  const [matchesList, setMatchesList] = useState<any[]>([])

  const [showDetails, setShowDetails] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null)
  const [editScoreA, setEditScoreA] = useState<number | null>(null)
  const [editScoreB, setEditScoreB] = useState<number | null>(null)

  async function loadLookups() {
    try {
      // fetch teams
      try {
        const tRes = await fetch('/api/teams')
        if (tRes.ok) {
          const ts = await tRes.json()
          if (Array.isArray(ts)) setTeamsList(ts.map((t: any) => ({ id: String(t.id), name: t.name, logo: t.logo_url ?? t.logo ?? t.image_url ?? t.avatar_url ?? null })))
        } else {
          const raw = await tRes.text()
          console.error('/api/teams error', tRes.status, raw)
        }
      } catch (e) {
        console.error('Failed to fetch /api/teams', e)
      }

      // fetch events
      try {
        const eRes = await fetch('/api/events')
        if (eRes.ok) {
          const es = await eRes.json()
          if (Array.isArray(es)) setEventsList(es.map((ev: any) => ({ id: String(ev.id), event_type: ev.event_type ?? ev.name ?? ev.title, location: ev.location ?? null })))
        } else {
          const raw = await eRes.text()
          console.error('/api/events error', eRes.status, raw)
        }
      } catch (e) {
        console.error('Failed to fetch /api/events', e)
      }

      // fetch matches
      try {
        const mRes = await fetch('/api/matches')
        if (mRes.ok) {
          const ms = await mRes.json()
          if (Array.isArray(ms)) setMatchesList(ms)
        } else {
          const raw = await mRes.text()
          console.error('/api/matches error', mRes.status, raw)
        }
      } catch (e) {
        console.error('Failed to fetch /api/matches', e)
      }
    } catch (err) {
      // generic fallback
      console.error('loadLookups unexpected error', err)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    loadLookups().finally(() => setIsLoading(false))
  }, [])

  const handleSignOut = async () => {
    setShowSignOutDialog(false)
    setShowSignOutLoading(true)
    await supabase.auth.signOut()
    setTimeout(() => router.push('/admin/login'), 800)
  }

  const openDetails = (m: any) => {
    setSelectedMatch(m)
    setEditScoreA(typeof m.score_a === 'number' ? m.score_a : null)
    setEditScoreB(typeof m.score_b === 'number' ? m.score_b : null)
    setShowDetails(true)
  }

  const saveScores = async () => {
    if (!selectedMatch) return
    const payload: any = { id: selectedMatch.id }
    if (Number.isFinite(editScoreA)) payload.score_a = editScoreA
    if (Number.isFinite(editScoreB)) payload.score_b = editScoreB

    try {
      const res = await fetch('/api/matches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to update')
      }
      const updated = await res.json()

      // update local lists
      setMatchesList((s) => s.map((x) => (String(x.id) === String(updated.id) ? updated : x)))
      setSelectedMatch(updated)
      setShowDetails(false)
    } catch (err) {
      console.error('Failed to save scores', err)
      alert('Failed to save scores')
    }
  }

  const navItems = [
    { title: 'Dashboard', icon: Home, url: '/coordinator/dashboard', isActive: false },
    { title: 'Teams', icon: Users, url: '/coordinator/teams', isActive: false },
    { title: 'Events', icon: Calendar, url: '/coordinator/events', isActive: false },
    { title: 'Matches', icon: Shuffle, url: '/coordinator/matches', isActive: true },
    { title: 'Standings', icon: Trophy, url: '/coordinator/standings', isActive: false },
    { title: 'Reports', icon: BarChart3, url: '/coordinator/reports', isActive: false },
    { title: 'Settings', icon: Settings, url: '/coordinator/settings', isActive: false },
  ]

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
                  <p className="text-sm text-gray-500">View matches and update scores from here.</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchesList.length === 0 ? (
                  <div className="bg-white rounded-2xl p-6 shadow text-center">
                    <p className="text-sm text-gray-600">No matches found.</p>
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

                    return (
                      <div key={m.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-semibold">{ev?.event_type ?? 'Event'}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} text-white/95 bg-white/10 border-white/20`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {teamA?.logo ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                  <Image src={teamA.logo} alt={`${teamA.name} logo`} width={48} height={48} className="w-12 h-12 object-cover" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-semibold text-lg">{(teamA?.name||'').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>
                              )}
                              <div className="min-w-0">
                                <p className="text-lg font-bold text-gray-900 truncate">{teamA?.name}</p>
                              </div>
                            </div>
                            <div className="text-2xl font-extrabold text-gray-900">{m.score_a ?? '0'}</div>
                          </div>

                          <div className="flex items-center justify-center my-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="px-4 text-sm font-bold text-gray-400">VS</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {teamB?.logo ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                  <Image src={teamB.logo} alt={`${teamB.name} logo`} width={48} height={48} className="w-12 h-12 object-cover" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-semibold text-lg">{(teamB?.name||'').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>
                              )}
                              <div className="min-w-0">
                                <p className="text-lg font-bold text-gray-900 truncate">{teamB?.name}</p>
                              </div>
                            </div>
                            <div className="text-2xl font-extrabold text-gray-900">{m.score_b ?? '0'}</div>
                          </div>

                          <div className="mt-4 h-px bg-gray-100" />

                          <div className="mt-4 text-sm text-gray-600">
                            <div className="bg-transparent">
                              <div className="flex items-center gap-3 py-2 px-2"><Calendar className="w-4 h-4 text-green-600" /><span>{formattedDate}</span></div>
                              <div className="flex items-center gap-3 py-2 px-2"><Clock className="w-4 h-4 text-green-600" /><span>{formattedTime}</span></div>
                              <div className="flex items-center gap-3 py-2 px-2"><MapPin className="w-4 h-4 text-green-600" /><span>{m.location ?? ev?.location ?? ''}</span></div>
                            </div>

                            <div className="mt-6 px-0">
                              <button onClick={() => openDetails(m)} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-sm">View / Score</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </main>
      </SidebarInset>

      {/* Match Details Modal with scoring */}
      {showDetails && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-emerald-700 to-emerald-500" />

            <div className="absolute top-4 right-4">
              <button onClick={() => setShowDetails(false)} className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-50 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="px-8 pt-12 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900">{(eventsList.find(e => String(e.id) === String(selectedMatch.event_id))?.event_type) ?? 'Match Details'}</h3>
                  <p className="text-sm text-gray-500">Match ID: {selectedMatch.id}</p>
                </div>
                <div className="inline-flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">{eventsList.find(e => String(e.id) === String(selectedMatch.event_id))?.event_type}</span>
                </div>
              </div>

              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              <div className="mt-8 flex items-center justify-between gap-6">
                <div className="flex-1 flex flex-col items-center text-center">
                  {(() => {
                    const teamA = teamsList.find(t => String(t.id) === String(selectedMatch.team_a_id))
                    if (teamA?.logo) return (<div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-emerald-50 shadow-md"><Image src={teamA.logo} alt={teamA.name} width={128} height={128} className="w-32 h-32 object-cover" /></div>)
                    return (<div className="w-32 h-32 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-2xl ring-4 ring-emerald-50 shadow-md">{(teamA?.name||'').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>)
                  })()}
                  <div className="w-20 h-px bg-gray-100 mt-4" />
                  <p className="mt-4 text-lg font-semibold text-gray-900">{teamsList.find(t => String(t.id) === String(selectedMatch.team_a_id))?.name}</p>
                  <div className="mt-2">
                    <label className="text-sm text-gray-500 block mb-2">Score</label>
                    <input type="number" value={editScoreA ?? ''} onChange={(e) => setEditScoreA(e.target.value === '' ? null : Number(e.target.value))} className="w-24 text-center text-4xl font-extrabold" />
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-400 shadow-md flex items-center justify-center">
                    <div className="text-6xl font-extrabold text-white">VS</div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center text-center">
                  {(() => {
                    const teamB = teamsList.find(t => String(t.id) === String(selectedMatch.team_b_id))
                    if (teamB?.logo) return (<div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-sky-50 shadow-md"><Image src={teamB.logo} alt={teamB.name} width={128} height={128} className="w-32 h-32 object-cover" /></div>)
                    return (<div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-2xl ring-4 ring-sky-50 shadow-md">{(teamB?.name||'').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div>)
                  })()}
                  <div className="w-20 h-px bg-gray-100 mt-4" />
                  <p className="mt-4 text-lg font-semibold text-gray-900">{teamsList.find(t => String(t.id) === String(selectedMatch.team_b_id))?.name}</p>
                  <div className="mt-2">
                    <label className="text-sm text-gray-500 block mb-2">Score</label>
                    <input type="number" value={editScoreB ?? ''} onChange={(e) => setEditScoreB(e.target.value === '' ? null : Number(e.target.value))} className="w-24 text-center text-4xl font-extrabold" />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-green-600" /><span>{selectedMatch.time ? new Date(selectedMatch.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span></div>
                <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-green-600" /><span>{selectedMatch.time ? new Date(selectedMatch.time).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''}</span></div>
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-green-600" /><span>{selectedMatch.location ?? eventsList.find(e => String(e.id) === String(selectedMatch.event_id))?.location ?? ''}</span></div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => setShowDetails(false)} className="px-4 py-2 rounded-full border bg-white hover:bg-gray-50">Cancel</button>
                <button onClick={saveScores} className="px-4 py-2 rounded-full bg-emerald-600 text-white">Save Scores</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
