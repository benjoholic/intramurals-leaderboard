'use client';

import { Trophy } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Overall Leaderboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated: Just now</span>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-4">
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
            className="grid grid-cols-12 gap-4 items-center bg-white hover:bg-gray-50 rounded-xl p-3 transition-colors"
          >
            {/* Rank */}
            <div className="col-span-1 flex items-center justify-center">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                team.rank === 1 ? 'bg-yellow-100 text-yellow-800' : 
                team.rank === 2 ? 'bg-gray-100 text-gray-800' : 
                team.rank === 3 ? 'bg-amber-100 text-amber-800' : 
                'bg-gray-50 text-gray-600'
              } font-bold`}>
                {team.rank}
              </span>
            </div>
            
            {/* Team Info */}
            <div className="col-span-5 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl mr-3">
                {team.avatar}
              </div>
              <div>
                <div className="font-medium text-gray-900">{team.team}</div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    team.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {team.trend === 'up' ? '↑' : '↓'} {team.change}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="col-span-1 text-center text-gray-700">{team.matches}</div>
            <div className="col-span-1 text-center text-gray-700">{team.wins}</div>
            <div className="col-span-1 text-center text-gray-700">{team.draws}</div>
            <div className="col-span-1 text-center text-gray-700">{team.losses}</div>
            
            {/* Points */}
            <div className="col-span-2 text-right">
              <div className="font-bold text-gray-900">{team.points}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Button */}
      <div className="mt-6 flex justify-center">
        <button className="flex items-center text-sm font-medium text-green-600 hover:text-green-800">
          View all standings
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}