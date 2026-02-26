"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, CalendarDays, FileText, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/ReduxStore/hooks"
import { Doctor, fetchDoctors } from "@/ReduxSlices/doctorSlice"

export default function Home() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")
  const [userName, setUserName] = useState("")

  const { doctors } = useAppSelector((state) => state.doctors)
  const [localDoctors, setLocalDoctors] = useState<Doctor[]>([])
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    dispatch(fetchDoctors())

    const stored = localStorage.getItem("doctors")
    setLocalDoctors(stored ? JSON.parse(stored) : [])
  }, [dispatch])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserName(parsedUser.name?.substring(0, 6) || "")
    }
  }, [])

  // combine API + locally registered doctors
  useEffect(() => {
    const combined = [...doctors]
    // avoid duplicates by id
    localDoctors.forEach((ld) => {
      if (!combined.find((d) => d.id === ld.id)) {
        combined.push(ld)
      }
    })
    setAllDoctors(combined)
  }, [doctors, localDoctors])

  const specialties = [
    "All",
    ...new Set(allDoctors.map((doc: Doctor) => doc.specialty)),
  ]

  const filteredDoctors = allDoctors.filter((doc: Doctor) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesSpecialty =
      selectedSpecialty === "All" ||
      doc.specialty === selectedSpecialty

    return matchesSearch && matchesSpecialty
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-300 pt-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">
            Hello, {userName || "User"} 👋
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Find your trusted doctor easily
          </p>
        </div>

        {/* Search Section */}
        <Card className="rounded-3xl shadow-lg border-0 bg-white mb-6">
          <CardContent className="p-6">

            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search doctors by name..."
                className="pl-12 h-12 rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-cyan-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Specialty Chips */}
            <div className="flex gap-3 overflow-x-auto mt-5 pb-2 scrollbar-hide">
              {specialties.map((spec, idx) => (
                <button
                  key={`${spec}-${idx}`}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-5 py-2 text-sm rounded-full font-medium whitespace-nowrap transition-all duration-300
                    ${
                      selectedSpecialty === spec
                        ? "bg-cyan-600 text-white shadow-md"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                >
                  {spec}
                </button>
              ))}
            </div>

          </CardContent>
        </Card>

       
       {/* Doctors Grid */}
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {filteredDoctors.map((doctor) => {
    // compute availability count
    const avail = JSON.parse(localStorage.getItem("availability") || "[]").filter((a: any) => a.doctorName === doctor.name)
    return (
    <Card
      key={doctor.id}
      className="rounded-3xl border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white"
    >
      <CardContent className="p-6">

        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 rounded-2xl border">
            <AvatarImage src="https://i.pravatar.cc/150?img=12" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-semibold text-lg text-emerald-900">
              {doctor.name}
            </h3>
            {avail.length > 0 && (
              <p className="text-xs text-indigo-600 mt-1">
                {avail.length} slot{avail.length > 1 ? "s" : ""} available
              </p>
            )}
            <p className="text-sm text-emerald-700 mt-1">
              Senior {doctor.specialty}
            </p>

            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {doctor.description}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => router.push(`/doctorsList/${doctor.id}`)}
            className="flex-1 border border-cyan-800 text-cyan-800 py-2 rounded-xl text-sm font-medium hover:bg-cyan-50 transition"
          >
            Find Details
          </button>

          <button
            onClick={() => router.push(`/book/${doctor.id}`)}
            className="flex-1 bg-cyan-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-cyan-700 transition"
          >
            Book Now
          </button>
        </div>

      </CardContent>
    </Card>
  )})}
</div>

      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t sm:hidden">
        <div className="flex justify-around py-3 text-xs">
          <div className="flex flex-col items-center text-blue-600">
            <Search className="w-5 h-5 mb-1" />
            Find
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <CalendarDays className="w-5 h-5 mb-1" />
            Appoint.
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <FileText className="w-5 h-5 mb-1" />
            Records
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <User className="w-5 h-5 mb-1" />
            Profile
          </div>
        </div>
      </div>

    </div>
  )
}