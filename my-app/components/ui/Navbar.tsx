"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/LoginForm"
import SignupForm from "@/components/SignupForm"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem("currentUser")
      setIsLoggedIn(!!user)
    }

    // Check on mount
    checkLoginStatus()

    // Listen for changes from other tabs
    window.addEventListener("storage", checkLoginStatus)

    // 👇 Fix for same-tab login (OTP or Email)
    window.addEventListener("focus", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
      window.removeEventListener("focus", checkLoginStatus)
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("currentUser")
    setIsLoggedIn(false)
    setIsOpen(false)
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/doclogo.png"
              alt="Hospital Logo"
              width={60}
              height={60}
              priority
            />
            <span className="text-2xl font-bold text-blue-700">
              MediCare+
            </span>
          </Link>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-lg font-medium">

            <Link href="/" className="text-blue-900 hover:text-blue-600">
              Home
            </Link>

            {isLoggedIn && (
              <Link
                href="/doctorsList"
                className="text-blue-900 hover:text-blue-600"
              >
                Doctors
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-blue-900 hover:text-blue-600"
                >
                  Login
                </button>

                <button
                  onClick={() => setShowSignupModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow-md transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow-md transition"
              >
                Sign Out
              </button>
            )}

          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-4 space-y-4 border-t border-blue-100 text-lg font-medium">

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block text-blue-900 hover:text-blue-600"
            >
              Home
            </Link>

            {isLoggedIn && (
              <Link
                href="/doctorsList"
                onClick={() => setIsOpen(false)}
                className="block text-blue-900 hover:text-blue-600"
              >
                Doctors
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => { setIsOpen(false); setShowLoginModal(true) }}
                  className="block text-blue-900 hover:text-blue-600"
                >
                  Login
                </button>

                <button
                  onClick={() => { setIsOpen(false); setShowSignupModal(true) }}
                  className="block bg-blue-600 text-white px-4 py-2 rounded-xl text-center hover:bg-blue-700 shadow-md transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-md transition"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowLoginModal(false)} />
            <div className="relative z-10 p-4">
              <button className="absolute -top-2 -right-2 rounded-full p-1 shadow-md" onClick={() => setShowLoginModal(false)}>✕</button>
              <LoginForm onClose={() => setShowLoginModal(false)} />
            </div>
          </div>
        )}
        {showSignupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowSignupModal(false)} />
            <div className="relative z-10 p-4">
              <button className="absolute -top-2 -right-2 rounded-full p-1 shadow-md" onClick={() => setShowSignupModal(false)}>✕</button>
              <SignupForm onClose={() => setShowSignupModal(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}