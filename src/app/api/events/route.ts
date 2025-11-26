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
    const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })
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
    const title = String(body.title || "").trim()
    const date = String(body.date || "").trim()
    const location = body.location ? String(body.location) : null

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("events").insert([{ title, date, location }]).select().single()
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
