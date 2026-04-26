import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()
    const { nom, prenom, role, password, matricule, service, actif } = data

    const updateData: any = {
      nom,
      prenom,
      role,
      matricule: matricule || null,
      service: service || null,
    }

    if (actif !== undefined) {
      updateData.actif = actif
    }

    if (password && password.trim().length > 0) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("Erreur PUT /api/users/[id]:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
