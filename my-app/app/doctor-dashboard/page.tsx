"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DoctorDashboard() {
  const router = useRouter()
  const [doctor, setDoctor] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])

  // availability state
  const [availDate, setAvailDate] = useState("")
  const [availSlot, setAvailSlot] = useState("")
  const [availType, setAvailType] = useState<"single" | "group">("single")
  const [availability, setAvailability] = useState<any[]>([])

  useEffect(() => {
    const doctorStr = localStorage.getItem("currentDoctor")
    if (!doctorStr) {
      router.push("/")
      return
    }

    const currentDoc = JSON.parse(doctorStr)
    setDoctor(currentDoc)

    // Fetch all doctors from localStorage to get doctor details
    const doctorsStr = localStorage.getItem("doctors")
    if (doctorsStr) {
      setDoctors(JSON.parse(doctorsStr))
    }

    // Fetch all appointments
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    // Filter by doctor name since registered doctors won't have doctorId from mock API
    const doctorAppointments = allAppointments.filter(
      (a: any) => a.doctorName === currentDoc.name
    )
    setAppointments(doctorAppointments)

    // Load availability
    const allAvail = JSON.parse(localStorage.getItem("availability") || "[]")
    const myAvail = allAvail.filter((a: any) => a.doctorName === currentDoc.name)
    setAvailability(myAvail)
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("currentDoctor")
    router.push("/")
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-24 pb-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900">Doctor Dashboard</h1>
          {/* <Button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sign Out
          </Button> */}
        </div>

        {/* Doctor Profile Card */}
        <Card className="rounded-2xl shadow-lg border border-blue-200 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <Avatar className="h-32 w-32 border-4 border-blue-200">
                <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-3xl font-bold text-blue-900">
                  Dr. {doctor.name}
                </h2>
                <p className="text-blue-600 font-semibold text-lg mt-2">
                  {doctor.specialization}
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Hospital:</span> {doctor.hospital}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">License:</span> {doctor.licenseNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Management */}
        <Card className="rounded-2xl shadow-md bg-white border border-blue-100 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Manage Availability
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={availDate}
                  onChange={(e) => setAvailDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time Slot</label>
                <select
                  value={availSlot}
                  onChange={(e) => setAvailSlot(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select slot</option>
                  {[
                    "09:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "12:00 PM",
                    "02:00 PM",
                    "03:00 PM",
                    "04:00 PM",
                  ].map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={availType}
                  onChange={(e) =>
                    setAvailType(e.target.value as "single" | "group")
                  }
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="single">Single</option>
                  <option value="group">Group</option>
                </select>
              </div>
            </div>
            <Button
              onClick={() => {
                if (!availDate || !availSlot) return
                const newAvail = {
                  id: Date.now(),
                  doctorName: doctor?.name,
                  date: availDate,
                  slot: availSlot,
                  type: availType,
                }
                const allAvail = JSON.parse(localStorage.getItem("availability") || "[]")
                localStorage.setItem(
                  "availability",
                  JSON.stringify([...allAvail, newAvail])
                )
                setAvailability([...availability, newAvail])
                setAvailDate("")
                setAvailSlot("")
                setAvailType("single")
              }}
              className="mt-4 bg-blue-600 text-white"
            >
              Add Slot
            </Button>

            {availability.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium mb-2">Existing Slots</h4>
                <ul className="space-y-2">
                  {availability.map((a) => (
                    <li key={a.id} className="flex justify-between">
                      <span>{a.date} - {a.slot} ({a.type})</span>
                      <button
                        className="text-red-500 text-sm"
                        onClick={() => {
                          const updated = availability.filter(x => x.id !== a.id)
                          setAvailability(updated)
                          const allAvail2 = JSON.parse(localStorage.getItem("availability") || "[]")
                          localStorage.setItem(
                            "availability",
                            JSON.stringify(allAvail2.filter((x: any) => x.id !== a.id))
                          )
                        }}
                      >Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card className="rounded-2xl shadow-md bg-blue-50 border border-blue-100">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-blue-900">{appointments.length}</p>
              <p className="text-blue-600 mt-2">Total Appointments</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md bg-green-50 border border-green-100">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-green-900">
                {appointments.filter(a => new Date(a.date) >= new Date()).length}
              </p>
              <p className="text-green-600 mt-2">Upcoming Appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <Card className="rounded-2xl shadow-lg border border-blue-200">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">
              Your Appointments
            </h3>

            {appointments.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No appointments yet.
              </p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border border-blue-100 rounded-lg bg-blue-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-blue-900">
                        {appointment.date} at {appointment.slot}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Patient ID: {appointment.userId}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        new Date(appointment.date) >= new Date()
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}>
                        {new Date(appointment.date) >= new Date() ? "Upcoming" : "Completed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
