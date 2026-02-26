"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/ReduxStore/hooks"
import { fetchDoctors } from "@/ReduxSlices/doctorSlice"

export default function BookAppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const doctorId = parseInt(params.id as string)

  const { doctors } = useAppSelector((state) => state.doctors)

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [selectedType, setSelectedType] = useState<"single" | "group" | "">("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [availSlots, setAvailSlots] = useState<any[]>([])

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors())
    }
  }, [dispatch, doctors.length])

  // doctor state to avoid accessing localStorage during render
  const [doctor, setDoctor] = useState<any>(null)

  useEffect(() => {
    // try redux list first
    let found = doctors.find((doc) => doc.id === doctorId)
    if (!found && typeof window !== "undefined") {
      const local = JSON.parse(localStorage.getItem("doctors") || "[]")
      found = local.find((d: any) => d.id === params.id || d.id === doctorId)
    }
    setDoctor(found || null)
  }, [doctors, doctorId, params.id])
  // compute available slots when date or doctor changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailSlots([])
      return
    }
    const allAvail = JSON.parse(localStorage.getItem("availability") || "[]")
    const slots = allAvail.filter(
      (a: any) =>
        a.doctorName === doctor?.name &&
        a.date === selectedDate
    )
    setAvailSlots(slots)
  }, [selectedDate, doctor])
  // fallback slots but availability takes precedence
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ]

  const handleBooking = () => {
    setError("")
    setSuccess("")

    if (!selectedDate) {
      setError("Please select a date")
      return
    }

    if (!selectedSlot) {
      setError("Please select a time slot")
      return
    }

    // find and store selected type
    const slotInfo = availSlots.find((s) => s.slot === selectedSlot)
    const type = slotInfo ? slotInfo.type : "single"
    setSelectedType(type)

    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      setError("Please login first")
      return
    }

    const user = JSON.parse(currentUser)

    const existingBookings =
      JSON.parse(localStorage.getItem("appointments") || "[]")

    // prevent double-booking: if any existing appointment matches doctor, date and slot
    const slotBooked = existingBookings.find(
      (b: any) =>
        b.doctorName === doctor?.name &&
        b.date === selectedDate &&
        b.slot === selectedSlot
    )
    if (slotBooked) {
      setError("This slot is already booked. Please choose another.")
      return
    }

    const newBooking = {
      id: Date.now(),
      doctorId,
      doctorName: doctor?.name,
      userId: user.id,
      date: selectedDate,
      slot: selectedSlot,
      type: slotInfo ? slotInfo.type : "single",
    }

    localStorage.setItem(
      "appointments",
      JSON.stringify([...existingBookings, newBooking])
    )

    setSuccess("Appointment booked successfully 🎉")

    setTimeout(() => {
      router.push("/book/user")
    }, 1500)
  }

  // Check which slots are available for the selected date
  const getBookedSlots = () => {
    if (!selectedDate) return []
    const existingBookings =
      JSON.parse(localStorage.getItem("appointments") || "[]")
    return existingBookings
      .filter(
        (b: any) => b.doctorName === doctor?.name && b.date === selectedDate
      )
      .map((b: any) => b.slot)
  }

  const bookedSlots = getBookedSlots()

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading doctor details...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-300 px-4 pt-24 pb-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Doctor Details Card */}
        <Card className="rounded-2xl shadow-xl border border-emerald-200">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">

            <Avatar className="h-24 w-24 border-4 border-blue-200">
              <AvatarImage src="https://i.pravatar.cc/150?img=12" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-blue-800">
                {doctor.name}
              </h2>
              <p className="text-blue-600 font-medium">
                {doctor.specialty}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {doctor.experience} Years Experience
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Booking Card */}
        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-2xl">
            <CardTitle className="text-center text-2xl">
              Book Appointment
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 space-y-6">

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={`${error && !selectedDate ? "border-red-500" : ""}`}
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Select Time Slot
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availSlots.length === 0 && (
                  <p className="col-span-full text-center text-gray-500">
                    No availability set for this date. Please check later.
                  </p>
                )}
                {(availSlots.length > 0 ? availSlots : timeSlots.map((t) => ({ slot: t, type: "single" }))).map((s) => {
                  const slot = typeof s === "string" ? s : s.slot || s
                  const type = (s as any).type || "single"

                  // bookedSlots is an array of slot strings
                  const isBooked = bookedSlots.includes(slot)
                  const isSelected = selectedSlot === slot

                  return (
                    <button
                      key={slot}
                      onClick={() => !isBooked && setSelectedSlot(slot)}
                      disabled={isBooked}
                      className={`py-2 rounded-xl border transition ${
                        isBooked
                          ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50 cursor-pointer"
                      }`}
                    >
                      {slot}
                      <div className="text-xs">{type === "group" ? "(Group)" : ""}</div>
                      {isBooked && <div className="text-xs">Booked</div>}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {success && (
              <p className="text-green-600 text-sm">{success}</p>
            )}

            <Button
              onClick={handleBooking}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl"
            >
              Book Now
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}