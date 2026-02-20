"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OtpPage() {
  const [otp, setOtp] = useState("")
  const router = useRouter()

  const verifyOtp = async () => {
    try {
      await window.confirmationResult.confirm(otp)
      alert("Login Successful")
      router.push("/dashboard")
    } catch (error) {
      alert("Invalid OTP")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">

      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">
        OTP Code Verification
      </h2>

      {/* OTP Box */}
      <div className="border-2 border-yellow-400 p-6 rounded-lg space-y-6">

        <p className="text-sm text-gray-600">
          Code has been sent to +91 ******99
        </p>

        {/* OTP Input */}
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full text-center text-2xl tracking-widest p-3 border rounded-lg"
        />

        <p className="text-sm text-gray-600 text-center">
          Resend code in <span className="text-blue-500">55 s</span>
        </p>
      </div>

      {/* Verify Button */}
      <button
        onClick={verifyOtp}
        className="mt-6 bg-cyan-500 text-white py-3 rounded-lg"
      >
        Verify
      </button>
    </div>
  )
}