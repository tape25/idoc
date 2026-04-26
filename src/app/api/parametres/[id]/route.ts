import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()
    const { valeur, description } = data

    const updatedParam = await db.parametre.update({
      where: { id },
      data: { valeur, description }
    })

    return NextResponse.json({ success: true, parametre: updatedParam })
  } catch (error) {
    console.error("Erreur PUT /api/parametres/[id]:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
