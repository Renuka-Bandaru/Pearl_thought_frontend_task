"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/ReduxStore/hooks"
import { fetchDoctors } from "@/ReduxSlices/doctorSlice"

export default function UserPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { doctors } = useAppSelector((state) => state.doctors)

  const [appointments, setAppointments] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchDoctors())

    const userStr = localStorage.getItem("currentUser")
    if (!userStr) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userStr)
    setCurrentUser(user)

    const allAppointments =
      JSON.parse(localStorage.getItem("appointments") || "[]")

    const userAppointments = allAppointments.filter(
      (a: any) => a.userId === user.id
    )

    setAppointments(userAppointments)
  }, [dispatch, router])

  const handleCancel = (id: number) => {
    const updatedAppointments = appointments.filter(
      (a) => a.id !== id
    )

    const allAppointments =
      JSON.parse(localStorage.getItem("appointments") || "[]")

    const updatedAll = allAppointments.filter(
      (a: any) => a.id !== id
    )

    localStorage.setItem("appointments", JSON.stringify(updatedAll))
    setAppointments(updatedAppointments)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 pt-24 pb-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-blue-800">
          My Appointments
        </h1>

        {appointments.length === 0 ? (
          <Card className="rounded-2xl shadow-md text-center p-10">
            <p className="text-gray-600 mb-4">
              You have no appointments yet.
            </p>
            <Button
              onClick={() => router.push("/doctorsList")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book Appointment
            </Button>
          </Card>
        ) : (
          appointments.map((appointment) => {
            const doctor = doctors.find(
              (doc) => doc.id === appointment.doctorId
            )

            return (
              <Card
                key={appointment.id}
                className="rounded-2xl shadow-lg border border-blue-100"
              >
                <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-6">

                  {/* Doctor Info */}
                  <div className="flex items-center gap-5">
                    <Avatar className="h-20 w-20 border-4 border-blue-200">
                      <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>

                    <div>
                      <h2 className="text-xl font-bold text-blue-800">
                        {doctor?.name || appointment.doctorName}
                      </h2>
                      <p className="text-blue-600">
                        {doctor?.specialty}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {appointment.date} at {appointment.slot}
                      </p>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <Button
                    onClick={() => handleCancel(appointment.id)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Cancel
                  </Button>

                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}