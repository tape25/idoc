import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DRH")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const parametres = await db.parametre.findMany({
      orderBy: { cle: "asc" }
    })

    return NextResponse.json({ parametres })
  } catch (error) {
    console.error("Erreur GET /api/parametres:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const data = await req.json()
    const { cle, valeur, description } = data

    if (!cle || !valeur) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }

    const newParam = await db.parametre.create({
      data: { cle, valeur, description }
    })

    return NextResponse.json({ success: true, parametre: newParam }, { status: 201 })
  } catch (error) {
    console.error("Erreur POST /api/parametres:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
