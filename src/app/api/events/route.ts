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
    // Try to order by `time` (newer schema). If that column doesn't exist, fall back to `date`.
    let data: any = null
    let error: any = null
    try {
      const r = await supabase.from("events").select("*").order("time", { ascending: true })
      data = r.data
      error = r.error
    } catch (e) {
      // ignore and fallback
    }

    if (error) {
      const r2 = await supabase.from("events").select("*").order("date", { ascending: true })
      data = r2.data
      error = r2.error
    }

    if (error) {
      console.error("Supabase error (events GET):", error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json(data || [], { status: 200 })
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
      team_a_id?: string | number | null
      team_b_id?: string | number | null
    }
    // Prefer new `event_type` field, fall back to `name` or legacy `title`
    const event_type = String(body.event_type || body.name || body.title || "").trim()
    const time = String(body.time || "").trim()
    const location = body.location ? String(body.location) : null
    let matchup = body.matchup ? String(body.matchup) : null
    // Coerce team ids to numbers if possible (frontend should send numbers)
    const team_a_id = body.team_a_id != null && body.team_a_id !== '' ? Number(body.team_a_id) : null
    const team_b_id = body.team_b_id != null && body.team_b_id !== '' ? Number(body.team_b_id) : null

    if (!event_type || !time) {
      return NextResponse.json({ error: "Event type and time are required" }, { status: 400 })
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
      time: string
      date?: string | null
      location?: string | null
      matchup?: string | null
      team_a_id?: number | null
      team_b_id?: number | null
    } = { time, location }
    // store the new column `event_type` only — do not write legacy `title` or `name`
    insertPayload.event_type = event_type
    if (date) insertPayload.date = date
    if (matchup) insertPayload.matchup = matchup
    if (team_a_id != null) insertPayload.team_a_id = team_a_id
    if (team_b_id != null) insertPayload.team_b_id = team_b_id

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

      console.error("Supabase error (events POST):", err)
      return NextResponse.json({ error: err.message, details: err }, { status: 500 })
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
    } = {}
    // accept new `event_type` field, fall back to `name` for compatibility
    if (body.event_type) payload.event_type = body.event_type
    if (body.name && !body.event_type) payload.event_type = body.name
    if (body.time) payload.time = body.time
    if (body.location) payload.location = body.location
    if (body.matchup) payload.matchup = body.matchup

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
    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const supabase = (await getSupabaseClient()).supabase
    const { data, error } = await supabase.from('events').delete().eq('id', id).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ id: data?.id ?? id }, { status: 200 })
  } catch (err: any) {
    console.error('DELETE /api/events error', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
