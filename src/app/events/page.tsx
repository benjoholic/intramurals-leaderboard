"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Clock, Users, Trophy, Filter } from "lucide-react";

export default function EventsPage() {
  const [selectedSport, setSelectedSport] = useState("All");

  const sports = [
    "All",
    "Basketball",
    "Volleyball",
    "Badminton",
    "Table Tennis",
    "Sepak Takraw",
    "Chess",
    "Track & Field",
  ];

  const [matches, setMatches] = useState<any[]>([])
  const [isLoadingMatches, setIsLoadingMatches] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [mRes, eRes, tRes] = await Promise.all([fetch('/api/matches'), fetch('/api/events'), fetch('/api/teams')])
        const [mJson, eJson, tJson] = await Promise.all([mRes.ok ? mRes.json() : [], eRes.ok ? eRes.json() : [], tRes.ok ? tRes.json() : []])

        const eventsMap = new Map((Array.isArray(eJson) ? eJson : []).map((ev: any) => [String(ev.id), ev]))
        const teamsMap = new Map((Array.isArray(tJson) ? tJson : []).map((t: any) => [String(t.id), t]))

        const mapped = (Array.isArray(mJson) ? mJson : []).map((m: any) => {
          const ev = eventsMap.get(String(m.event_id))
          const teamA = teamsMap.get(String(m.team_a_id))
          const teamB = teamsMap.get(String(m.team_b_id))
          const d = m.time ? new Date(m.time) : null
          const date = d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''
          const time = d ? d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''
          const status = m.status ?? ((typeof m.score_a === 'number' || typeof m.score_b === 'number') || (d ? d < new Date() : false) ? 'completed' : 'upcoming')
          return {
            id: m.id,
            sport: ev?.event_type ?? ev?.name ?? 'Event',
            // prefer explicit team.logo if available; otherwise try to load an admin-team image path
            team1: {
              id: teamA?.id ?? m.team_a_id,
              name: teamA?.name ?? (m.team_a_name ?? 'Team A'),
              logo: teamA?.logo ?? teamA?.logo_url ?? teamA?.image_url ?? teamA?.avatar_url ?? null,
              score: typeof m.score_a === 'number' ? m.score_a : 0,
            },
            team2: {
              id: teamB?.id ?? m.team_b_id,
              name: teamB?.name ?? (m.team_b_name ?? 'Team B'),
              logo: teamB?.logo ?? teamB?.logo_url ?? teamB?.image_url ?? teamB?.avatar_url ?? null,
              score: typeof m.score_b === 'number' ? m.score_b : 0,
            },
            date,
            time,
            venue: m.location ?? ev?.location ?? '',
            status,
          }
        })

        if (mounted) setMatches(mapped)
      } catch (err) {
        console.error('Failed loading matches for landing page', err)
      } finally {
        if (mounted) setIsLoadingMatches(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const filteredMatches =
    selectedSport === "All"
      ? matches
      : matches.filter((match) => match.sport === selectedSport);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "live":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-10 h-10 text-green-600" />
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
                Events & Matches
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View upcoming and past matches across all sports
            </p>
          </motion.div>

          {/* Sport Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">Filter by Sport</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {sports.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                      selectedSport === sport
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30 scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Match Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-gray-600 font-medium">
              Showing {filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""}
              {selectedSport !== "All" && ` for ${selectedSport}`}
            </p>
          </motion.div>

          {/* Matches Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSport}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-white" />
                        <span className="text-white font-bold">{match.sport}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          match.status
                        )}`}
                      >
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="p-6">
                    {/* Team 1 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center border-2 border-green-300 overflow-hidden">
                          {match.team1.logo ? (
                            <>
                              {/* try to show provided logo or admin-team image path */}
                              {/* plain <img> used to avoid Next.js image domain config for local/dev paths */}
                              <img
                                src={match.team1.logo}
                                alt={`${match.team1.name} logo`}
                                className="w-full h-full object-cover"
                              />
                            </>
                          ) : (
                            <Users className="w-6 h-6 text-green-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {match.team1.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-gray-900 ml-2">
                        {match.team1.score}
                      </div>
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center my-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                      <span className="px-4 text-sm font-bold text-gray-400">VS</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300 overflow-hidden">
                          {match.team2.logo ? (
                            <>
                              <img
                                src={match.team2.logo}
                                alt={`${match.team2.name} logo`}
                                className="w-full h-full object-cover"
                              />
                            </>
                          ) : (
                            <Users className="w-6 h-6 text-blue-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {match.team2.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-gray-900 ml-2">
                        {match.team2.score}
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{match.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>{match.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>{match.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6">
                    <button onClick={() => { setSelectedMatch(match); setShowDetails(true); }} className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-[1.02]">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredMatches.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No matches found
              </h3>
              <p className="text-gray-600">
                There are no matches for {selectedSport} at the moment.
              </p>
            </motion.div>
          )}
        </div>
      </div>
      {/* Match Details Modal (landing) */}
      {showDetails && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* decorative diagonal divider removed for landing modal */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedMatch.sport ?? 'Match Details'}</h3>
                <p className="text-sm text-gray-500">Match ID: {selectedMatch.id}</p>
              </div>
              <div>
                <button onClick={() => setShowDetails(false)} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-6">
              {/* Team A */}
              <div className="flex-1 flex flex-col items-center pr-6 relative z-20">
                {selectedMatch.team1?.logo ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden"><img src={selectedMatch.team1.logo} alt={selectedMatch.team1.name} className="w-28 h-28 object-cover" /></div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-xl">{(selectedMatch.team1?.name||'').split(' ').map((s:any)=>s[0]).slice(0,2).join('').toUpperCase()}</div>
                )}
                <p className="mt-3 text-lg font-semibold text-gray-900">{selectedMatch.team1?.name}</p>
                <p className="mt-1 text-3xl font-extrabold text-gray-900">{selectedMatch.team1?.score ?? '0'}</p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="text-7xl font-extrabold text-gray-900">VS</div>
              </div>

              {/* Team B */}
              <div className="flex-1 flex flex-col items-center pl-6 relative z-20">
                {selectedMatch.team2?.logo ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden"><img src={selectedMatch.team2.logo} alt={selectedMatch.team2.name} className="w-28 h-28 object-cover" /></div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-xl">{(selectedMatch.team2?.name||'').split(' ').map((s:any)=>s[0]).slice(0,2).join('').toUpperCase()}</div>
                )}
                <p className="mt-3 text-lg font-semibold text-gray-900">{selectedMatch.team2?.name}</p>
                <p className="mt-1 text-3xl font-extrabold text-gray-900">{selectedMatch.team2?.score ?? '0'}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-green-600" /><span>{selectedMatch.date}</span></div>
              <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-green-600" /><span>{selectedMatch.time}</span></div>
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-green-600" /><span>{selectedMatch.venue}</span></div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowDetails(false)} className="px-4 py-2 rounded-lg border">Close</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
