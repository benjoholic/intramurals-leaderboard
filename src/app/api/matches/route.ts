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
    const { data, error } = await supabase.from('matches').select('*').order('time', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [], { status: 200 })
  } catch (err: any) {
    console.error('Unexpected error (matches GET):', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
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
      event_id?: string | number | null
      team_a_id?: string | number | null
      team_b_id?: string | number | null
      time?: string
      location?: string | null
      score_a?: number | null
      score_b?: number | null
    }

    const { event_id, team_a_id, team_b_id, time, location, score_a, score_b } = body

    if (!time) return NextResponse.json({ error: 'Missing time for match' }, { status: 400 })

    const payload: {
      event_id?: number | null
      team_a_id?: number | null
      team_b_id?: number | null
      time: string
      location?: string | null
      score_a?: number | null
      score_b?: number | null
    } = { time }

    if (event_id != null && event_id !== '') {
      const e = Number(event_id)
      payload.event_id = Number.isNaN(e) ? null : e
    }
    if (team_a_id != null && team_a_id !== '') {
      const a = Number(team_a_id)
      payload.team_a_id = Number.isNaN(a) ? null : a
    }
    if (team_b_id != null && team_b_id !== '') {
      const b = Number(team_b_id)
      payload.team_b_id = Number.isNaN(b) ? null : b
    }
    // validate teams are different
    if (payload.team_a_id != null && payload.team_b_id != null && String(payload.team_a_id) === String(payload.team_b_id)) {
      return NextResponse.json({ error: 'team_a_id and team_b_id must be different' }, { status: 400 })
    }
    if (location) payload.location = String(location)
    if (typeof score_a === 'number') payload.score_a = score_a
    if (typeof score_b === 'number') payload.score_b = score_b

    const { data, error } = await supabase.from('matches').insert([payload]).select().single()
    if (error) return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error('Unexpected error (matches POST):', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const res = await getSupabaseClient()
  if (!res.ok) {
    console.error("Failed to import supabase client:", res.error)
    return NextResponse.json({ error: "Failed to initialize Supabase client", detail: String(res.error) }, { status: 500 })
  }
  const supabase = res.supabase

  try {
    const body = (await req.json()) as unknown as {
      id?: string | number
      event_id?: string | number | null
      team_a_id?: string | number | null
      team_b_id?: string | number | null
      time?: string
      location?: string | null
      score_a?: number | null
      score_b?: number | null
    }
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const payload: any = {}
    if (body.event_id != null) {
      const e = Number(body.event_id)
      payload.event_id = Number.isNaN(e) ? null : e
    }
    if (body.team_a_id != null) {
      const a = Number(body.team_a_id)
      payload.team_a_id = Number.isNaN(a) ? null : a
    }
    if (body.team_b_id != null) {
      const b = Number(body.team_b_id)
      payload.team_b_id = Number.isNaN(b) ? null : b
    }
    // server-side validation: ensure teams are different
    if (payload.team_a_id != null && payload.team_b_id != null && String(payload.team_a_id) === String(payload.team_b_id)) {
      return NextResponse.json({ error: 'team_a_id and team_b_id must be different' }, { status: 400 })
    }
    if (body.time) payload.time = body.time
    if (body.location) payload.location = body.location
    if (typeof body.score_a === 'number') payload.score_a = body.score_a
    if (typeof body.score_b === 'number') payload.score_b = body.score_b

    const { data, error } = await supabase.from('matches').update(payload).eq('id', id).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    return NextResponse.json(data ?? {}, { status: 200 })
  } catch (err: any) {
    console.error('Unexpected error (matches PATCH):', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const res = await getSupabaseClient()
  if (!res.ok) {
    console.error("Failed to import supabase client:", res.error)
    return NextResponse.json({ error: "Failed to initialize Supabase client", detail: String(res.error) }, { status: 500 })
  }
  const supabase = res.supabase

  try {
    const body = (await req.json()) as unknown as { id?: string | number }
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const { data, error } = await supabase.from('matches').delete().eq('id', id).select().maybeSingle()
    if (error) return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    return NextResponse.json({ id: data?.id ?? id }, { status: 200 })
  } catch (err: any) {
    console.error('Unexpected error (matches DELETE):', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
