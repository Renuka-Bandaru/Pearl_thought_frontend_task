"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { useState } from "react"
import { useRouter } from "next/navigation"
import doclogo from "../public/doclogo.png"

export default function DoctorLoginForm({ onClose }: { onClose?: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<any>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: any = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = () => {
    if (!validateForm()) return

    const doctorsStr = localStorage.getItem("doctors")
    if (!doctorsStr) {
      setErrors({ email: "No doctor accounts found. Please sign up." })
      return
    }

    const doctors = JSON.parse(doctorsStr)
    const doctor = doctors.find((d: any) => d.email === email)

    if (!doctor) {
      setErrors({ email: "Email not registered as doctor" })
      return
    }

    if (doctor.password !== password) {
      setErrors({ password: "Incorrect password" })
      return
    }

    localStorage.setItem("currentDoctor", JSON.stringify({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      licenseNumber: doctor.licenseNumber,
      hospital: doctor.hospital,
    }))

    onClose?.()
    router.push("/doctor-dashboard")
  }

  return (
    <Card className="w-lg h-full rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-blue-300">
      <CardContent className="p-6 space-y-6">

        <div className="flex justify-center">
          <div className="w-40 h-28 flex items-center justify-center">
            <img src={doclogo.src} alt="Logo" className="w-40 h-auto" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-blue-900 text-center">Doctor Login</h2>
          <p className="text-center text-gray-600 text-sm mt-2">Access your doctor dashboard</p>
        </div>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 rounded-xl px-3 py-2"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label htmlFor="remember">Remember Me</label>
        </div>

        <Button onClick={handleLogin} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700">
          Login
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account? <span className="text-blue-600 font-semibold">Sign up as doctor</span>
        </p>
      </CardContent>
    </Card>
  )
}
