"use client"

import { useSession } from "next-auth/react"
import { LoginPage } from "./login-page"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { LandingPage } from "./landing-page"
import { useEffect, useState } from "react"
import { Loader2, ArrowLeft } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const [showLogin, setShowLogin] = useState(false)

  // Wait until we know the session status to avoid flickering the Landing/Dashboard
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-ivoire">
        <div className="relative">
          <div className="absolute -inset-4 bg-ivorange-500/20 rounded-full blur-xl animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-ivorange-500 relative z-10" />
        </div>
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
            className="flex items-center gap-2 text-ivgreen-700 hover:text-ivgreen-900 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_4px_20px_-4px_rgba(0,158,96,0.15)] transition-all hover:scale-105 border border-ivgreen-100 font-semibold text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
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
