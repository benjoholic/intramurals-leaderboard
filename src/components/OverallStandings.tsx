'use client';

const leaderboardData = [
  {
    rank: 1,
    team: 'Thunderbolts',
    avatar: '⚡',
    points: 1560,
    trend: 'up',
    change: '+2',
    matches: 12,
    wins: 10,
    draws: 2,
    losses: 0,
  },
  {
    rank: 2,
    team: 'Phoenix Rising',
    avatar: '🔥',
    points: 1480,
    trend: 'down',
    change: '1',
    matches: 12,
    wins: 9,
    draws: 1,
    losses: 2,
  },
  {
    rank: 3,
    team: 'Titans',
    avatar: '🛡️',
    points: 1420,
    trend: 'up',
    change: '+3',
    matches: 12,
    wins: 8,
    draws: 3,
    losses: 1,
  },
  {
    rank: 4,
    team: 'Storm Chasers',
    avatar: '🌪️',
    points: 1350,
    trend: 'down',
    change: '1',
    matches: 12,
    wins: 7,
    draws: 4,
    losses: 1,
  },
  {
    rank: 5,
    team: 'Avalanche',
    avatar: '🏔️',
    points: 1280,
    trend: 'up',
    change: '+2',
    matches: 12,
    wins: 6,
    draws: 5,
    losses: 1,
  },
];

export default function OverallStandings() {
  return (
    <div className="relative bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40 rounded-3xl shadow-2xl border border-green-100/50 p-8 w-full max-w-4xl mx-auto overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/10 to-green-400/10 rounded-full blur-3xl -z-10"></div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-1">Overall Leaderboard</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Live</span>
          </div>
          <button className="p-2 rounded-xl hover:bg-green-100 transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 text-xs font-bold text-green-700 uppercase tracking-wider mb-5 px-5 py-3 bg-gradient-to-r from-green-100/50 via-emerald-50/50 to-green-100/50 rounded-xl border border-green-200/30">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Team</div>
        <div className="col-span-1 text-center">P</div>
        <div className="col-span-1 text-center">W</div>
        <div className="col-span-1 text-center">D</div>
        <div className="col-span-1 text-center">L</div>
        <div className="col-span-2 text-right">PTS</div>
      </div>
      
      {/* Teams List */}
      <div className="space-y-3">
        {leaderboardData.map((team, index) => (
          <div 
            key={team.rank} 
            className="grid grid-cols-12 gap-4 items-center bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:scale-[1.02] rounded-2xl p-4 transition-all duration-300 border border-green-100/50 group"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Rank */}
            <div className="col-span-1 flex items-center justify-center">
              <span className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg shadow-md transition-all duration-300 group-hover:scale-110 ${
                team.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white ring-2 ring-yellow-300 shadow-yellow-200' : 
                team.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white ring-2 ring-gray-300 shadow-gray-200' : 
                team.rank === 3 ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white ring-2 ring-amber-300 shadow-amber-200' : 
                'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border border-green-200'
              }`}>
                {team.rank}
              </span>
            </div>
            
            {/* Team Info */}
            <div className="col-span-5 flex items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-2xl mr-4 shadow-md border border-green-200/50 group-hover:scale-110 transition-transform duration-300">
                  {team.avatar}
                </div>
              </div>
              <div>
                <div className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{team.team}</div>
                <div className="flex items-center mt-1.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm ${
                    team.trend === 'up' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                  }`}>
                    {team.trend === 'up' ? '↑' : '↓'} {team.change}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="col-span-1 text-center font-semibold text-gray-700 group-hover:text-green-700 transition-colors">{team.matches}</div>
            <div className="col-span-1 text-center font-semibold text-green-600">{team.wins}</div>
            <div className="col-span-1 text-center font-semibold text-gray-500">{team.draws}</div>
            <div className="col-span-1 text-center font-semibold text-red-500">{team.losses}</div>
            
            {/* Points */}
            <div className="col-span-2 text-right">
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-lg shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                {team.points}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Button */}
      <div className="mt-8 flex justify-center">
        <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <span>View All Standings</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}