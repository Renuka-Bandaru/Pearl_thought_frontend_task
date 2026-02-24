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
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors())
    }
  }, [dispatch, doctors.length])

  const doctor = doctors.find((doc) => doc.id === doctorId)

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

    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      setError("Please login first")
      return
    }

    const user = JSON.parse(currentUser)

    const existingBookings =
      JSON.parse(localStorage.getItem("appointments") || "[]")

    const alreadyBooked = existingBookings.find(
      (b: any) =>
        b.doctorId === doctorId &&
        b.date === selectedDate &&
        b.slot === selectedSlot
    )

    if (alreadyBooked) {
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
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-xl border transition ${
                      selectedSlot === slot
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
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