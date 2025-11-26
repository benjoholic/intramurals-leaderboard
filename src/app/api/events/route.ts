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
    const body = await req.json()
    const name = String(body.name || "").trim()
    const time = String(body.time || "").trim()
    const location = body.location ? String(body.location) : null
    const matchup = body.matchup ? String(body.matchup) : null

    if (!name || !time) {
      return NextResponse.json({ error: "Name and time are required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("events").insert([{ name, time, location, matchup }]).select().single()
    if (error) {
      console.error("Supabase error (events POST):", error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error("Unexpected error (events POST):", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
