"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { useState } from "react"

import doclogo from "../public/doclogo.png"



export default function LoginPage() {
const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-300
">
        <CardContent className="p-6 space-y-6">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-40 h-28 rounded-3xl flex items-center justify-center text-lg font-semibold text-gray-700">
              <img src={doclogo.src} alt="Logo" className="w-40 h-auto" />
            </div>
          </div>

          {/* Login Title */}
          <div>
            <h2 className="text-2xl font-bold text-emerald-900">Login</h2>
           
            <p className="text-center text-sm text-gray-800 pt-4">
              Mobile / Email
            </p>
          </div>

          {/* Input */}
          <Input className="border border-gray-400 rounded-xl px-3 py-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:border-emerald-500 transition-all"
placeholder="Login with Mobile or Email" />
          

           <div className="relative w-full">
          <Input className="border border-gray-400 rounded-xl px-3 py-2 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:border-emerald-500 transition-all"
 placeholder="Enter your password" type={showPassword ? "text" : "password"} onChange={()=>setShowPassword(!showPassword)}/>
          <span className="absolute right-3 top-3 cursor-pointer">
            {showPassword ? <FiEyeOff onClick={()=>setShowPassword(false)} /> : <FiEye  onClick={()=>setShowPassword(true)} />}
          </span>
          </div>
          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-gray-400"/>
              <label htmlFor="remember" className="text-gray-800">
                Remember Me
              </label>
            </div>
            <button className="text-red-500 hover:underline">
              Forgot Password
            </button>
          </div>

          {/* Login Button */}
          <Button className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-700">
            Login
          </Button>

          {/* Separator */}
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              Or login With
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Google Button */}
          
          <Button
  variant="outline"
  className="w-full rounded-xl flex items-center gap-2"
>
  <FcGoogle className="w-5 h-5" />
  Continue with Google
</Button>


          {/* Sign Up */}
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