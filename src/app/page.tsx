"use client"

import { useSession } from "next-auth/react"
import { LoginPage } from "./login-page"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { LandingPage } from "./landing-page"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const [showLogin, setShowLogin] = useState(false)

  // Wait until we know the session status to avoid flickering the Landing/Dashboard
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (session) {
    return <MainDashboard />
  }

  if (showLogin) {
    return (
      <div className="relative min-h-screen w-full">
        <div className="absolute top-6 left-6 z-50">
          <button 
            onClick={() => setShowLogin(false)}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md transition-all hover:scale-105"
          >
            ← Retour à l'accueil
          </button>
        </div>
        {/* We move seed logic into LoginPage itself to not block anything here */}
        <LoginPageWithSeed />
      </div>
    )
  }

  return <LandingPage onLoginClick={() => setShowLogin(true)} />
}

function LoginPageWithSeed() {
  const [seedError, setSeedError] = useState("")

  useEffect(() => {
    fetch("/api/seed")
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          console.error("Seed error:", data)
          setSeedError(data.details || data.error || "Erreur d'initialisation")
        }
      })
      .catch((err) => {
        console.error("Seed fetch error:", err)
        setSeedError("Impossible de contacter le serveur")
      })
  }, [])

  return <LoginPage seedError={seedError} />
}
