"use client"

import { useState } from "react"

type Team = {
  id: string
  name: string
  color?: string
  image?: string
  department?: string
  event?: string
}

export default function AddTeamClient({ onAdd }: { onAdd: (team: Team) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState("#16a34a")
  const [imageData, setImageData] = useState<string | null>(null)
  const [department, setDepartment] = useState<string>("")
  const [eventName, setEventName] = useState<string>("Basketball")

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageData(String(reader.result || ""))
    }
    reader.readAsDataURL(file)
  }

  function reset() {
    setName("")
    setColor("#16a34a")
    setImageData(null)
    setDepartment("")
    setEventName("Basketball")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const newTeam: Team = {
      id: String(Date.now()),
      name: name.trim(),
      color,
      image: imageData || undefined,
      department: department || undefined,
      event: eventName || undefined,
    }

    onAdd(newTeam)
    reset()
    setOpen(false)
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow hover:shadow-lg transition"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Team
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add Team</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  placeholder="Eagles, Tigers, Blue Team..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Logo / Image</label>
                <input type="file" accept="image/*" onChange={handleFile} className="mt-1" />
                {imageData && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Preview</p>
                    <img src={imageData} alt="logo preview" className="w-20 h-20 object-cover rounded-md border" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Team Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2"
                  placeholder="Department (e.g. Men, Women, Coed, Marketing)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Event / Sport</label>
                <select value={eventName} onChange={(e) => setEventName(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2">
                  <option>Basketball</option>
                  <option>Volleyball</option>
                  <option>Soccer</option>
                  <option>Baseball</option>
                  <option>Tennis</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => { setOpen(false); reset(); }} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
