"use client"

import { useSession } from "next-auth/react"
import { LoginPage } from "./login-page"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { useEffect, useState } from "react"

export default function Home() {
  const { data: session, status } = useSession()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initialiser les utilisateurs de démonstration au premier chargement
    fetch("/api/seed").then(() => setInitialized(true))
  }, [])

  if (status === "loading" || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

  return <MainDashboard />
}
