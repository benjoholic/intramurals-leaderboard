import Image from 'next/image'
import { Trophy, Calendar, Clock, MapPin } from 'lucide-react'
import React from 'react'

export default function DefaultCard({ m, ev, teamA, teamB, formattedDate, formattedTime, status, evtStyle, onView, onDelete }: any) {
  const scoreA = typeof m.score_a === 'number' ? m.score_a : (m.score_a ? Number(m.score_a) : null)
  const scoreB = typeof m.score_b === 'number' ? m.score_b : (m.score_b ? Number(m.score_b) : null)
  let resultA: string | null = null
  let resultB: string | null = null
  if (scoreA !== null && scoreB !== null) {
    if (scoreA > scoreB) {
      resultA = 'Win'
      resultB = 'Lose'
    } else if (scoreA < scoreB) {
      resultA = 'Lose'
      resultB = 'Win'
    } else {
      resultA = 'Draw'
      resultB = 'Draw'
    }
  }
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className={`${evtStyle.header} text-white px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-semibold">{ev?.event_type ?? 'Event'}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status ? status : 'bg-gray-400'} text-white/95 bg-white/10 border-white/20`}>{status?.charAt(0).toUpperCase() + (status?.slice ? status.slice(1) : '')}</span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {teamA?.logo ? (
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image src={teamA.logo} alt={`${teamA.name} logo`} width={48} height={48} className="w-12 h-12 object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-semibold text-lg">{(teamA?.name||'').split(' ').map((s:any)=>s[0]).slice(0,2).join('').toUpperCase()}</div>
            )}
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900 truncate">{teamA?.name}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {resultA ? (
              <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${resultA === 'Win' ? 'bg-emerald-100 text-emerald-800' : resultA === 'Lose' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{resultA}</span>
            ) : (
              <div className="text-lg font-extrabold text-gray-900">{scoreA !== null ? String(scoreA) : '--:--'}</div>
            )}
          </div>
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
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-semibold text-lg">{(teamB?.name||'').split(' ').map((s:any)=>s[0]).slice(0,2).join('').toUpperCase()}</div>
            )}
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900 truncate">{teamB?.name}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {resultB ? (
              <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${resultB === 'Win' ? 'bg-emerald-100 text-emerald-800' : resultB === 'Lose' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{resultB}</span>
            ) : (
              <div className="text-lg font-extrabold text-gray-900">{scoreB !== null ? String(scoreB) : '--:--'}</div>
            )}
          </div>
        </div>


          <div className="mt-4 h-px bg-gray-100" />

          <div className="mt-4 text-sm text-gray-600">
            <div className="bg-transparent">
              <div className="flex items-center gap-3 py-2 px-2"><Calendar className="w-4 h-4 text-green-600" /><span>{formattedDate}</span></div>
              <div className="flex items-center gap-3 py-2 px-2"><Clock className="w-4 h-4 text-green-600" /><span>{formattedTime}</span></div>
              <div className="flex items-center gap-3 py-2 px-2"><MapPin className="w-4 h-4 text-green-600" /><span>{m.location ?? ev?.location ?? ''}</span></div>
            </div>

            <div className="mt-6 px-0 flex gap-3">
              <button onClick={onView} className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-sm">View Details</button>
              <button onClick={onDelete} className="flex-0 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-semibold border border-red-100">Delete</button>
            </div>
          </div>
      </div>
    </div>
  )
}
