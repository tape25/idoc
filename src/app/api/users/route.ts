import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        matricule: true,
        service: true,
        actif: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Erreur GET /api/users:", error)
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
    const { email, nom, prenom, role, password, matricule, service } = data

    if (!email || !nom || !prenom || !role || !password) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await db.user.create({
      data: {
        email,
        nom,
        prenom,
        role,
        password: hashedPassword,
        matricule: matricule || null,
        service: service || null,
      }
    })

    return NextResponse.json({ success: true, user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Erreur POST /api/users:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
