"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trophy, Calendar, Users, Target, TrendingUp, Award, Flame, Star } from "lucide-react"
import { useState, useEffect } from "react"

// Sample data - replace with actual data fetching
const sportsData: Record<string, any> = {
  "basketball": {
    name: "Basketball",
    icon: "🏀",
    teams: [
      { rank: 1, name: "Thunder Hawks", wins: 12, losses: 2, points: 1240, winRate: 85.7 },
      { rank: 2, name: "Phoenix Flames", wins: 11, losses: 3, points: 1180, winRate: 78.6 },
      { rank: 3, name: "Storm Riders", wins: 10, losses: 4, points: 1120, winRate: 71.4 },
      { rank: 4, name: "Lightning Bolts", wins: 9, losses: 5, points: 1050, winRate: 64.3 },
      { rank: 5, name: "Crimson Warriors", wins: 7, losses: 7, points: 980, winRate: 50.0 },
      { rank: 6, name: "Blue Dragons", wins: 6, losses: 8, points: 920, winRate: 42.9 },
      { rank: 7, name: "Golden Eagles", wins: 5, losses: 9, points: 850, winRate: 35.7 },
      { rank: 8, name: "Silver Sharks", wins: 4, losses: 10, points: 780, winRate: 28.6 },
    ]
  },
  "football": {
    name: "Football",
    icon: "⚽",
    teams: [
      { rank: 1, name: "United FC", wins: 10, losses: 1, points: 890, winRate: 90.9 },
      { rank: 2, name: "City Strikers", wins: 9, losses: 2, points: 850, winRate: 81.8 },
      { rank: 3, name: "Royal Rangers", wins: 8, losses: 3, points: 810, winRate: 72.7 },
      { rank: 4, name: "Dynamo Squad", wins: 6, losses: 5, points: 720, winRate: 54.5 },
      { rank: 5, name: "Victory United", wins: 5, losses: 6, points: 680, winRate: 45.5 },
      { rank: 6, name: "Elite Kickers", wins: 3, losses: 8, points: 590, winRate: 27.3 },
    ]
  },
  "volleyball": {
    name: "Volleyball",
    icon: "🏐",
    teams: [
      { rank: 1, name: "Spike Masters", wins: 14, losses: 1, points: 1450, winRate: 93.3 },
      { rank: 2, name: "Net Warriors", wins: 12, losses: 3, points: 1320, winRate: 80.0 },
      { rank: 3, name: "Block Busters", wins: 10, losses: 5, points: 1180, winRate: 66.7 },
      { rank: 4, name: "Serve Aces", wins: 8, losses: 7, points: 1050, winRate: 53.3 },
      { rank: 5, name: "Court Kings", wins: 6, losses: 9, points: 920, winRate: 40.0 },
      { rank: 6, name: "Jump Squad", wins: 4, losses: 11, points: 780, winRate: 26.7 },
    ]
  },
  "tennis": {
    name: "Tennis",
    icon: "🎾",
    teams: [
      { rank: 1, name: "Ace Smashers", wins: 16, losses: 2, points: 1680, winRate: 88.9 },
      { rank: 2, name: "Baseline Pros", wins: 14, losses: 4, points: 1540, winRate: 77.8 },
      { rank: 3, name: "Net Players", wins: 12, losses: 6, points: 1420, winRate: 66.7 },
      { rank: 4, name: "Spin Masters", wins: 10, losses: 8, points: 1280, winRate: 55.6 },
      { rank: 5, name: "Volley Kings", wins: 8, losses: 10, points: 1140, winRate: 44.4 },
      { rank: 6, name: "Court Crushers", wins: 6, losses: 12, points: 980, winRate: 33.3 },
    ]
  },
  "swimming": {
    name: "Swimming",
    icon: "🏊",
    teams: [
      { rank: 1, name: "Wave Riders", wins: 8, losses: 0, points: 920, winRate: 100.0 },
      { rank: 2, name: "Aqua Sharks", wins: 7, losses: 1, points: 850, winRate: 87.5 },
      { rank: 3, name: "Splash Squad", wins: 5, losses: 3, points: 720, winRate: 62.5 },
      { rank: 4, name: "Tide Breakers", wins: 3, losses: 5, points: 580, winRate: 37.5 },
      { rank: 5, name: "Pool Masters", wins: 2, losses: 6, points: 480, winRate: 25.0 },
    ]
  },
  "track-&-field": {
    name: "Track & Field",
    icon: "🏃",
    teams: [
      { rank: 1, name: "Speed Demons", wins: 15, losses: 1, points: 1620, winRate: 93.8 },
      { rank: 2, name: "Sprint Kings", wins: 13, losses: 3, points: 1480, winRate: 81.3 },
      { rank: 3, name: "Jump Squad", wins: 11, losses: 5, points: 1340, winRate: 68.8 },
      { rank: 4, name: "Relay Runners", wins: 9, losses: 7, points: 1180, winRate: 56.3 },
      { rank: 5, name: "Field Stars", wins: 7, losses: 9, points: 1020, winRate: 43.8 },
      { rank: 6, name: "Track Titans", wins: 5, losses: 11, points: 860, winRate: 31.3 },
    ]
  }
}

export default function SportPage() {
  const params = useParams()
  const router = useRouter()
  const sportSlug = params.sport as string
  const sportData = sportsData[sportSlug]
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!sportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sport Not Found</h1>
          <p className="text-gray-600 mb-8">The sport you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-all hover:gap-3 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Sports</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`py-12 px-4 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Sport Header with Gradient Background */}
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="text-8xl md:text-9xl transform hover:scale-110 transition-transform duration-300 filter drop-shadow-2xl">
                {sportData.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold text-white">Season 2024-2025</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">
                  {sportData.name}
                </h1>
                <p className="text-xl md:text-2xl text-green-100 font-medium">
                  Overall Standings & Team Rankings
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="group bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl hover:border-green-500 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Teams</p>
                <p className="text-4xl font-black text-gray-900">{sportData.teams.length}</p>
              </div>
            </div>

            <div className="group bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <Flame className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Matches</p>
                <p className="text-4xl font-black text-gray-900">
                  {sportData.teams.reduce((acc: number, team: any) => acc + team.wins + team.losses, 0)}
                </p>
              </div>
            </div>

            <div className="group bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <Award className="w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Current Leader</p>
                <p className="text-lg font-black text-gray-900 truncate">{sportData.teams[0].name}</p>
              </div>
            </div>

            <div className="group bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-2xl hover:border-purple-500 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <Star className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Active Season</p>
                <p className="text-2xl font-black text-gray-900">2024-25</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standings Table */}
      <section className={`pb-24 px-4 relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-2xl overflow-hidden">
            {/* Table Header */}
            <div className="p-8 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
              <div className="relative flex items-center gap-3">
                <Trophy className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-black text-white">Team Standings</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Wins
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Losses
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Win Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sportData.teams.map((team: any, index: number) => (
                    <tr
                      key={index}
                      className={`hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-all duration-300 group ${
                        team.rank <= 3 ? 'bg-gradient-to-r from-green-50/30 to-transparent' : ''
                      }`}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {team.rank === 1 && (
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Trophy className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {team.rank === 2 && (
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Trophy className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {team.rank === 3 && (
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <Trophy className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {team.rank > 3 && (
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors duration-300">
                              <span className="text-lg font-bold text-gray-600">{team.rank}</span>
                            </div>
                          )}
                          {team.rank <= 3 && (
                            <span className="text-xl font-black text-gray-900">{team.rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                            {team.name}
                          </span>
                          {team.rank === 1 && (
                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full">
                              LEADER
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-green-100 text-green-700 text-base font-bold rounded-lg">
                          {team.wins}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-red-100 text-red-700 text-base font-bold rounded-lg">
                          {team.losses}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <span className="text-xl font-black text-gray-900">{team.points}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                team.winRate >= 80
                                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                                  : team.winRate >= 60
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                  : team.winRate >= 40
                                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                  : 'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              style={{ width: `${team.winRate}%` }}
                            ></div>
                          </div>
                          <span className="text-base font-black text-gray-900 min-w-[3.5rem]">
                            {team.winRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
