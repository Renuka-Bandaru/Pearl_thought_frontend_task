"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { auth } from "@/lib/firebase"

import doclogo from "../public/doclogo.png"

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"mobile" | "email">("mobile")
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)

  // 🔥 Send OTP Function
  const sendOtp = async () => {
    if (!phone) {
      alert("Please enter phone number")
      return
    }

    try {
      setLoading(true)

      // ✅ Create reCAPTCHA only once
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        )
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaRef.current
      )

      // Save globally
      ;(window as any).confirmationResult = confirmationResult

      router.push("/otp")
    } catch (error: any) {
      console.error("OTP Error:", error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-300">
        <CardContent className="p-6 space-y-6">

          <div className="flex justify-center">
            <div className="w-40 h-28 flex items-center justify-center">
              <img src={doclogo.src} alt="Logo" className="w-40 h-auto" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-emerald-900 text-center">
              Login
            </h2>

            <div className="flex justify-center gap-6 pt-4">
              <button
                onClick={() => setLoginType("mobile")}
                className={`text-sm font-medium pb-1 cursor-pointer ${
                  loginType === "mobile"
                    ? "text-emerald-900 border-b-2 border-emerald-900"
                    : "text-gray-600"
                }`}
              >
                Mobile
              </button>

              <button
                onClick={() => setLoginType("email")}
                className={`text-sm font-medium pb-1 cursor-pointer ${
                  loginType === "email"
                    ? "text-emerald-900 border-b-2 border-emerald-900"
                    : "text-gray-600"
                }`}
              >
                Email
              </button>
            </div>
          </div>

          {loginType === "mobile" && (
            <Input
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-400 rounded-xl px-3 py-2"
            />
          )}

          {loginType === "email" && (
            <>
              <Input type="email" placeholder="Enter your email" />

              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>
            <button className="text-red-500 hover:underline">
              Forgot Password
            </button>
          </div>

          <Button
            onClick={loginType === "mobile" ? sendOtp : undefined}
            className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? "Sending OTP..." : "Login"}
          </Button>

          {/* ✅ Important */}
          <div id="recaptcha-container"></div>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              Or login With
            </span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full rounded-xl flex items-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-gray-800 pt-4">
            Don’t have an account?{" "}
            <span className="text-cyan-800 cursor-pointer hover:underline">
              Sign Up
            </span>
          </p>

        </CardContent>
      </Card>
    </div>
  )
}