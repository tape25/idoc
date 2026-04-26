import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// Endpoint de diagnostic temporaire - à supprimer après résolution
export async function GET() {
  const results: Record<string, unknown> = {}

  // 1. Test connexion DB
  try {
    const count = await db.user.count()
    results.dbConnection = "OK"
    results.userCount = count
  } catch (e) {
    results.dbConnection = "FAILED"
    results.dbError = e instanceof Error ? e.message : String(e)
    return NextResponse.json(results, { status: 500 })
  }

  // 2. Cherche l'admin
  try {
    const user = await db.user.findUnique({
      where: { email: "admin@sports.gouv.ci" }
    })
    if (!user) {
      results.userFound = false
      return NextResponse.json(results)
    }
    results.userFound = true
    results.userActive = user.actif
    results.userRole = user.role
    results.passwordHashStart = user.password.substring(0, 10)

    // 3. Test bcrypt
    const match = await bcrypt.compare("admin123", user.password)
    results.passwordMatch = match
    results.verdict = match && user.actif ? "LOGIN_SHOULD_WORK" : "LOGIN_WILL_FAIL"

  } catch (e) {
    results.queryError = e instanceof Error ? e.message : String(e)
  }

  // 4. Env vars (masquées)
  results.hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
  results.nextAuthUrl = process.env.NEXTAUTH_URL || "NOT_SET"
  results.nodeEnv = process.env.NODE_ENV

  return NextResponse.json(results)
}
