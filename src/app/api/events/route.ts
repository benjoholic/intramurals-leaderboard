import { NextResponse } from "next/server"

async function getSupabaseClient() {
  try {
    const mod = await import("@/lib/supabase")
    return { ok: true, supabase: (mod as any).supabase }
  } catch (err: any) {
    return { ok: false, error: err }
  }
}

export async function GET() {
  const res = await getSupabaseClient()
  if (!res.ok) {
    console.error("Failed to import supabase client:", res.error)
    return NextResponse.json({ error: "Failed to initialize Supabase client", detail: String(res.error) }, { status: 500 })
  }

  const supabase = res.supabase
  try {
    // Try to order by `time` (newer schema). If ordering fails (missing column or similar),
    // fall back to returning rows without ordering to avoid referencing a non-existent `date` column.
    try {
      const r = await supabase.from("events").select("*").order("time", { ascending: true })
      if (r.error) {
        console.warn('ordering by time failed, returning events without ordering', r.error)
        const r2 = await supabase.from("events").select("*")
        if (r2.error) {
          console.error("Supabase error (events GET):", r2.error)
          return NextResponse.json({ error: r2.error.message || String(r2.error), details: r2.error }, { status: 500 })
        }
        return NextResponse.json(r2.data || [], { status: 200 })
      }

      return NextResponse.json(r.data || [], { status: 200 })
    } catch (e: any) {
      console.error('Unexpected supabase exception (events GET):', e)
      // Try a plain select as a last resort
      try {
        const r3 = await supabase.from("events").select("*")
        if (r3.error) {
          console.error('Fallback select also failed (events GET):', r3.error)
          return NextResponse.json({ error: r3.error.message || String(r3.error), details: r3.error }, { status: 500 })
        }
        return NextResponse.json(r3.data || [], { status: 200 })
      } catch (e2: any) {
        console.error('Final fallback failed (events GET):', e2)
        return NextResponse.json({ error: e2?.message || String(e2) }, { status: 500 })
      }
    }
  } catch (err: any) {
    console.error("Unexpected error (events GET):", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const res = await getSupabaseClient()
  if (!res.ok) {
    console.error("Failed to import supabase client:", res.error)
    return NextResponse.json({ error: "Failed to initialize Supabase client", detail: String(res.error) }, { status: 500 })
  }

  const supabase = res.supabase
  try {
    const body = (await req.json()) as unknown as {
      event_type?: string
      name?: string
      title?: string
      time?: string
      location?: string | null
      matchup?: string | null
      points?: number | null
      points_breakdown?: any | null
      first_point?: number | null
      second_point?: number | null
      third_point?: number | null
      team_a_id?: string | number | null
      team_b_id?: string | number | null
    }
    // Prefer new `event_type` field, fall back to `name` or legacy `title`
    const event_type = String(body.event_type || body.name || body.title || "").trim()
    const time = String(body.time || "").trim()
    const location = body.location ? String(body.location) : null
    let matchup = body.matchup ? String(body.matchup) : null
    // accept points_breakdown (object with first/second/third) from client
    const points_breakdown = body.points_breakdown ?? null
    // Coerce team ids to numbers if possible (frontend should send numbers)
    const team_a_id = body.team_a_id != null && body.team_a_id !== '' ? Number(body.team_a_id) : null
    const team_b_id = body.team_b_id != null && body.team_b_id !== '' ? Number(body.team_b_id) : null

    if (!event_type) {
      return NextResponse.json({ error: "Event type is required" }, { status: 400 })
    }

    // If matchup is missing but team ids are provided, try to look up team names
    try {
      if ((!matchup || matchup === "") && (team_a_id || team_b_id)) {
        const ids = [team_a_id, team_b_id].filter(Boolean)
        if (ids.length > 0) {
          const r = await supabase.from('teams').select('id, name').in('id', ids as number[])
          if (!r.error && Array.isArray(r.data)) {
            const map = new Map<string, string>()
            r.data.forEach((t: { id: number | string; name: string }) => map.set(String(t.id), String(t.name)))
            const aName = team_a_id ? map.get(String(team_a_id)) : null
            const bName = team_b_id ? map.get(String(team_b_id)) : null
            if (aName && bName) matchup = `${aName} vs ${bName}`
            else if (aName && !bName) matchup = aName
            else if (!aName && bName) matchup = bName
          }
        }
      }
    } catch (errLookup) {
      console.error('Failed to lookup team names for matchup:', errLookup)
    }

    // Also populate legacy fields for compatibility: title (from name) and date (from time)
    let date: string | null = null
    try {
      if (time) {
        // derive YYYY-MM-DD
        date = new Date(time).toISOString().slice(0, 10)
      }
    } catch (e) {
      date = null
    }

    const insertPayload: {
      event_type?: string
      time?: string
      date?: string | null
      location?: string | null
      matchup?: string | null
      team_a_id?: number | null
      team_b_id?: number | null
      points?: number | null
      first_point?: number | null
      second_point?: number | null
      third_point?: number | null
    } = {}
    // store the new column `event_type` only — do not write legacy `title` or `name`
    insertPayload.event_type = event_type
    if (time) insertPayload.time = time
    if (date) insertPayload.date = date
    if (matchup) insertPayload.matchup = matchup
    if (team_a_id != null) insertPayload.team_a_id = team_a_id
    if (team_b_id != null) insertPayload.team_b_id = team_b_id
    // legacy `points` column removed from DB; do not attempt to insert it
    // accept explicit separate point columns from client
    if (body.first_point != null) insertPayload.first_point = Number(body.first_point)
    if (body.second_point != null) insertPayload.second_point = Number(body.second_point)
    if (body.third_point != null) insertPayload.third_point = Number(body.third_point)

    // Try inserting; if we get a UUID parsing error (apps may send numeric team IDs
    // while the DB column is uuid), retry without team id fields so the event still creates.
    let insertResult: any = null
    try {
      const r = await supabase.from("events").insert([insertPayload]).select().single()
      insertResult = r
    } catch (e) {
      // fallthrough to error handling below
      insertResult = e as any
    }

    if (insertResult && insertResult.error) {
      const err: any = insertResult.error
      // If it's a UUID parse error (22P02) try again without team id fields
      const isUuidParse = (err?.message || "").includes('invalid input syntax for type uuid') || err?.code === '22P02'
      if (isUuidParse && (insertPayload.team_a_id || insertPayload.team_b_id)) {
        console.warn('UUID parse error inserting team ids; retrying insert without team_a_id/team_b_id to preserve event creation')
        delete insertPayload.team_a_id
        delete insertPayload.team_b_id
        const r2 = await supabase.from("events").insert([insertPayload]).select().single()
        if (r2.error) {
          console.error("Supabase error (events POST) retry without team ids:", r2.error)
          return NextResponse.json({ error: r2.error.message, details: r2.error }, { status: 500 })
        }
        return NextResponse.json(r2.data, { status: 201 })
      }

      // If insert failed due to missing `time` NOT NULL constraint, retry with a fallback timestamp
      const msg = String(err?.message || '')
      const isTimeNotNull = msg.includes('null value') && msg.includes('time')
      if (isTimeNotNull && !insertPayload.time) {
        console.warn('Insert failed due to missing time column; retrying with fallback timestamp')
        insertPayload.time = new Date().toISOString()
        try {
          const r3 = await supabase.from('events').insert([insertPayload]).select().single()
          if (!r3.error) return NextResponse.json(r3.data, { status: 201 })
          // if still error, fallthrough to return below
          console.error('Retry with fallback time also failed:', r3.error)
          return NextResponse.json({ error: r3.error.message, details: r3.error }, { status: 500 })
        } catch (e) {
          console.error('Unexpected error during retry with fallback time:', e)
          return NextResponse.json({ error: String(e) }, { status: 500 })
        }
      }

      console.error("Supabase error (events POST):", err)
      return NextResponse.json({ error: err.message || String(err), details: err }, { status: 500 })
    }

    const data = insertResult.data
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error("Unexpected error (events POST):", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as unknown as {
      id?: number | string
      event_type?: string
      name?: string
      time?: string
      location?: string | null
      matchup?: string | null
      points?: number | null
      first_point?: number | null
      second_point?: number | null
      third_point?: number | null
      team_a_id?: string | number | null
      team_b_id?: string | number | null
    }
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const payload: {
      event_type?: string
      time?: string
      location?: string | null
      matchup?: string | null
      team_a_id?: number | null | string
      team_b_id?: number | null | string
      date?: string
      points?: number | null
      first_point?: number | null
      second_point?: number | null
      third_point?: number | null
    } = {}
    // accept new `event_type` field, fall back to `name` for compatibility
    if (body.event_type) payload.event_type = body.event_type
    if (body.name && !body.event_type) payload.event_type = body.name
    if (body.time) payload.time = body.time
    if (body.location) payload.location = body.location
    if (body.matchup) payload.matchup = body.matchup
    // legacy `points` column removed from DB; do not attempt to update it
    if (body.first_point != null) payload.first_point = Number(body.first_point)
    if (body.second_point != null) payload.second_point = Number(body.second_point)
    if (body.third_point != null) payload.third_point = Number(body.third_point)

    // coerce team ids when provided
    if (body.team_a_id != null && body.team_a_id !== '') {
      const a = Number(body.team_a_id)
      if (!Number.isNaN(a)) payload.team_a_id = a
      else payload.team_a_id = body.team_a_id
    }
    if (body.team_b_id != null && body.team_b_id !== '') {
      const b = Number(body.team_b_id)
      if (!Number.isNaN(b)) payload.team_b_id = b
      else payload.team_b_id = body.team_b_id
    }

    // backfill legacy columns if event_type/time provided
    // do not set legacy `title` or `name` on updates; keep `event_type` as canonical
    if (payload.time) payload.date = payload.time

    // if matchup missing but team ids provided, try to resolve names
    if (!payload.matchup && (payload.team_a_id || payload.team_b_id)) {
      try {
        const supabase = (await getSupabaseClient()).supabase
        const idsToQuery: number[] = []
        if (payload.team_a_id) idsToQuery.push(Number(payload.team_a_id))
        if (payload.team_b_id) idsToQuery.push(Number(payload.team_b_id))
        const { data: tdata } = await supabase.from('teams').select('id,name').in('id', idsToQuery as number[])
        const a = tdata?.find((t: { id: number | string; name: string }) => String(t.id) === String(payload.team_a_id))
        const b = tdata?.find((t: { id: number | string; name: string }) => String(t.id) === String(payload.team_b_id))
        if (a && b) payload.matchup = `${a.name} vs ${b.name}`
      } catch (e) {
        // ignore
      }
    }

    const supabase = (await getSupabaseClient()).supabase
    const { data, error } = await supabase.from('events').update(payload).eq('id', id).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? {}, { status: 200 })
  } catch (err: any) {
    console.error('PATCH /api/events error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    // Try to read id from JSON body, but accept query param as a fallback
    let id: any = null
    try {
      const body = await req.json()
      id = body?.id ?? null
    } catch (e) {
      // ignore JSON parse errors and try query param
    }

    if (!id) {
      try {
        const url = new URL(req.url)
        id = url.searchParams.get('id')
      } catch (e) {
        // ignore
      }
    }

    if (!id && id !== 0) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // coerce numeric ids when appropriate. If id isn't numeric, don't pass it to DB (bigint columns will error).
    const idStr = String(id)
    const isNumeric = /^-?\d+$/.test(idStr)
    if (!isNumeric) {
      console.warn('DELETE called with non-numeric id:', id)
      return NextResponse.json({ error: `Invalid id format for deletion: ${idStr}` }, { status: 400 })
    }
    const finalId: number = Number(idStr)

    const supabase = (await getSupabaseClient()).supabase
    const { data, error } = await supabase.from('events').delete().eq('id', finalId).select().maybeSingle()
    if (error) {
      console.error('DELETE /api/events supabase error:', error)
      return NextResponse.json({ error: error.message || String(error), details: error }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ id: data?.id ?? finalId }, { status: 200 })
  } catch (err: any) {
    console.error('DELETE /api/events error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
