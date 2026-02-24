"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"
import LoginForm from "@/components/LoginForm"

export default function HomePage() {
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-300 flex flex-col">

      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-5 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-emerald-900">
          MediCare+
        </h1>

        <div className="space-x-4">
          <Button
            variant="outline"
            className="border-cyan-800 text-cyan-800 hover:bg-cyan-50"
            onClick={() => setShowLogin(true)}
          >
            Login
          </Button>

          <Button
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => router.push("/signup")}
          >
            Create Account
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl">

          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 leading-tight">
              Book Trusted Doctors <br /> Anytime, Anywhere
            </h2>

            <p className="text-lg text-emerald-800">
              MediCare+ helps you find experienced doctors,
              schedule appointments instantly, and manage your
              medical visits with ease — all in one secure platform.
            </p>

            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={() => router.push("/signup")}
              >
                Get Started
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-cyan-800 text-cyan-800 hover:bg-cyan-50"
                onClick={() => setShowLogin(true)}
              >
                Login
              </Button>
            </div>
          </div>

          {/* Right Card Info */}
          <Card className="shadow-xl border-emerald-200">
            <CardContent className="p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-emerald-900">
                Why Choose MediCare+?
              </h3>

              <ul className="space-y-4 text-emerald-700">
                <li>✔️ Verified and experienced doctors</li>
                <li>✔️ Instant appointment booking</li>
                <li>✔️ Secure medical records</li>
                <li>✔️ 24/7 support assistance</li>
              </ul>

              <Button
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white mt-4"
                onClick={() => router.push("/signup")}
              >
                Create Free Account
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 bg-cyan-600 text-white text-sm">
        © {new Date().getFullYear()} MediCare+. All rights reserved.
      </footer>
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLogin(false)}
          />

          <div className="relative z-10 p-4">
            <button
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
              onClick={() => setShowLogin(false)}
              aria-label="Close login"
            >
              ✕
            </button>
            <LoginForm onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

















