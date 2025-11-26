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
    const { data, error } = await supabase.from("teams").select("*").order("id", { ascending: false })
    if (error) {
      console.error("Supabase error (teams GET):", error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }
    return NextResponse.json(data || [], { status: 200 })
  } catch (err: any) {
    console.error("Unexpected error (teams GET):", err)
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
    const color = body.color ? String(body.color) : null
    const logo = body.logo ? String(body.logo) : null
    const department = body.department ? String(body.department) : null
    const event = body.event ? String(body.event) : null

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("teams").insert([{ name, color, logo, department, event }]).select().single()
    if (error) {
      console.error("Supabase error (teams POST):", error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error("Unexpected error (teams POST):", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
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
    const body = await req.json()
    const id = body.id
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const { data, error } = await supabase.from("teams").delete().eq("id", id).select().single()
    if (error) {
      console.error("Supabase error (teams DELETE):", error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }
    return NextResponse.json({ deleted: data }, { status: 200 })
  } catch (err: any) {
    console.error("Unexpected error (teams DELETE):", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
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
    const body = await req.json()
    const id = body.id
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const updates: any = {}
    if (body.name !== undefined) updates.name = String(body.name)
    if (body.color !== undefined) updates.color = String(body.color)
    if (body.logo !== undefined) updates.logo = body.logo === null ? null : String(body.logo)
    if (body.department !== undefined) updates.department = body.department === null ? null : String(body.department)
    if (body.event !== undefined) updates.event = body.event === null ? null : String(body.event)

    const { data, error } = await supabase.from("teams").update(updates).eq("id", id).select().single()
    if (error) {
      console.error("Supabase error (teams PATCH):", error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("Unexpected error (teams PATCH):", err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
