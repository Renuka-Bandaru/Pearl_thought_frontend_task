"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

import { useAppDispatch, useAppSelector } from "@/ReduxStore/hooks"
import { fetchDoctors } from "@/ReduxSlices/doctorSlice"

export default function SingleDocDetails() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { doctors, loading } = useAppSelector(
    (state) => state.doctors
  )
  const [localDoctors, setLocalDoctors] = useState<any[]>([])

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors())
    }
    const stored = localStorage.getItem("doctors")
    setLocalDoctors(stored ? JSON.parse(stored) : [])
  }, [dispatch, doctors.length])

  // attempt to find in API data first, fall back to local doctors
  let doctor = doctors.find(
    (doc) => doc.id === parseInt(params.id as string)
  )
  if (!doctor) {
    doctor = localDoctors.find(
      (doc) => doc.id === params.id || doc.id === parseInt(params.id as string)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Doctor not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white pt-24 px-4 mb-10">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-700 mb-6 hover:text-blue-900 transition text-lg font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Doctor Header Card */}
        <Card className="rounded-3xl shadow-xl border border-blue-100 bg-gradient-to-r from-blue-600 to-blue-500 text-white mb-8">
          <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-center">

            <Avatar className="h-36 w-36 rounded-3xl border-4 border-white shadow-lg">
              <AvatarImage src="https://i.pravatar.cc/150?img=12" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">
                {doctor.name}
              </h2>

              <p className="mt-2 text-lg">
                {doctor.specialty}
              </p>

              <p className="mt-2 text-blue-100">
                {doctor.qualification}
              </p>

              <p className="text-blue-100">
                {doctor.fellowship}
              </p>

              <Badge className="mt-4 bg-white text-blue-600">
                Available Today
              </Badge>
            </div>

          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="rounded-2xl shadow-md bg-blue-50 border border-blue-100 text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-900">
                {doctor.patients}
              </p>
              <p className="text-md text-blue-700">Patients</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md bg-blue-50 border border-blue-100 text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-900">
                {doctor.experience}
              </p>
              <p className="text-md text-blue-700">Years Exp.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md bg-blue-50 border border-blue-100 text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-900">
                {doctor.rating}
              </p>
              <p className="text-md text-blue-700">Rating</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md bg-blue-50 border border-blue-100 text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-900">
                {doctor.reviews}
              </p>
              <p className="text-md text-blue-700">Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="rounded-3xl shadow-md bg-blue-50 border border-blue-100 mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              About Doctor
            </h3>
            <p className="text-blue-900 leading-relaxed text-md">
              {doctor.description}
            </p>
          </CardContent>
        </Card>

        {/* Service Section */}
        <Card className="rounded-3xl shadow-md bg-blue-50 border border-blue-100 mb-6">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-blue-800">
              Service & Specialization
            </h3>

            <div className="flex justify-between text-blue-900">
              <span>Service</span>
              <span className="font-medium">{doctor.service}</span>
            </div>

            <div className="flex justify-between text-blue-900">
              <span>Specialization</span>
              <span className="font-medium">{doctor.specialty}</span>
            </div>
          </CardContent>
        </Card>

        {/* Availability (API fields or local slots) */}
        <Card className="rounded-3xl shadow-md bg-blue-50 border border-blue-100 mb-10">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              Availability
            </h3>
            {doctor.availabilityDays || doctor.availabilityTime ? (
              <div className="flex justify-between text-blue-900">
                <span>{doctor.availabilityDays}</span>
                <span>{doctor.availabilityTime}</span>
              </div>
            ) : (
              // show slots from local storage
              <ul className="space-y-1">
                {(JSON.parse(localStorage.getItem("availability")||"[]")
                  .filter((a:any)=>a.doctorName===doctor.name)
                  .map((a:any)=>`${a.date} ${a.slot} (${a.type})`)
                  .map((txt:string, idx:number)=>(
                    <li key={idx} className="text-blue-900">{txt}</li>
                  ))
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Book Button */}
        <button
          onClick={() => router.push(`/book/${doctor.id}`)}
          className="w-full sm:w-auto px-10 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg hover:scale-105 transition duration-300"
        >
          Book Appointment
        </button>

      </div>
    </div>
  )
}