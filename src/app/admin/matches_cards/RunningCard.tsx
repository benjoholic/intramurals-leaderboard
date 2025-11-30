import Image from 'next/image'
import { Calendar, Clock, MapPin } from 'lucide-react'
import React from 'react'

export default function RunningCard({ m, ev, teamA, teamB, formattedDate, formattedTime, status, evtStyle, onView, onDelete }: any) {
  // Build leaderboard entries from participants if provided, otherwise fall back to teamA/teamB
  const entries: Array<any> = []
  if (m.participants && Array.isArray(m.participants) && m.participants.length > 0) {
    for (const name of m.participants) {
      entries.push({ team: { name }, value: undefined })
    }
  } else {
    if (teamA) entries.push({ team: teamA, value: m.score_a })
    if (teamB) entries.push({ team: teamB, value: m.score_b })
  }

  const hasValues = entries.some(e => typeof e.value === 'number')
  // sort by numeric value if present (ascending = better time), otherwise keep order
  const sorted = hasValues ? entries.slice().sort((a, b) => (a.value ?? Infinity) - (b.value ?? Infinity)) : entries

  const placeLabel = (i: number) => {
    switch (i) {
      case 0: return '1st'
      case 1: return '2nd'
      case 2: return '3rd'
      default: return `${i+1}th`
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className={`${evtStyle.header} text-white px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-semibold">{ev?.event_type ?? 'Event'}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status ? status : 'bg-gray-400'} text-white/95 bg-white/10 border-white/20`}>{status?.charAt(0).toUpperCase() + (status?.slice ? status.slice(1) : '')}</span>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-gray-900">Leaderboard</h4>
          <p className="text-sm text-gray-500">Top finishers for this running event</p>
        </div>

        <div className="space-y-3">
          {sorted.length === 0 && (
            <div className="text-sm text-gray-500">No entrants yet</div>
          )}
          {sorted.map((ent, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center font-bold text-sky-700">{placeLabel(idx)}</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{ent.team?.name}</div>
                  <div className="text-xs text-gray-500">{ent.team?.college ?? ''}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900">{typeof ent.value === 'number' ? ent.value : '--:--'}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <div className="flex items-center gap-3 py-2 px-2"><Calendar className="w-4 h-4 text-green-600" /><span>{formattedDate}</span></div>
          <div className="flex items-center gap-3 py-2 px-2"><Clock className="w-4 h-4 text-green-600" /><span>{formattedTime}</span></div>
          <div className="flex items-center gap-3 py-2 px-2"><MapPin className="w-4 h-4 text-green-600" /><span>{m.location ?? ev?.location ?? ''}</span></div>
        </div>

        <div className="mt-6 px-0 flex gap-3">
          <button onClick={onView} className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold shadow-sm">View Details</button>
          <button onClick={onDelete} className="flex-0 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-semibold border border-red-100">Delete</button>
        </div>
      </div>
    </div>
  )
}
