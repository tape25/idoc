"use client"

import { useSession } from "next-auth/react"
import { LoginPage } from "./login-page"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { useEffect, useState } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const [initialized, setInitialized] = useState(false)
  const [seedError, setSeedError] = useState("")

  useEffect(() => {
    // Initialiser les utilisateurs de démonstration au premier chargement
    fetch("/api/seed")
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          console.error("Seed error:", data)
          setSeedError(data.details || data.error || "Erreur d'initialisation")
        } else {
          console.log("Seed:", data.message)
        }
      })
      .catch((err) => {
        console.error("Seed fetch error:", err)
        setSeedError("Impossible de contacter le serveur")
      })
      .finally(() => setInitialized(true))
  }, [])

  if (status === "loading" || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!session) {
    return <LoginPage seedError={seedError} />
  }

  return <MainDashboard />
}
