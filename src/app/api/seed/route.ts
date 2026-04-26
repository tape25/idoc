import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// API pour initialiser/réinitialiser les utilisateurs de démonstration
// GET /api/seed        → crée si vide
// GET /api/seed?reset=true → supprime tout et recrée
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reset = searchParams.get("reset") === "true"

    if (reset) {
      console.log("Seed: Suppression de tous les utilisateurs existants...")
      await db.user.deleteMany({})
      console.log("Seed: Utilisateurs supprimés.")
    } else {
      const existingUsers = await db.user.count()
      if (existingUsers > 0) {
        console.log(`Seed: ${existingUsers} utilisateurs existent déjà. Utilisez ?reset=true pour réinitialiser.`)
        return NextResponse.json({
          message: "Les utilisateurs existent déjà",
          count: existingUsers,
          tip: "Utilisez /api/seed?reset=true pour supprimer et recréer tous les utilisateurs"
        })
      }
    }

    console.log("Seed: Création des utilisateurs de démonstration...")

    const users = [
      {
        email: "admin@sports.gouv.ci",
        password: "admin123",
        nom: "Admin",
        prenom: "Système",
        role: "ADMIN" as const,
        matricule: "ADM001",
        service: "DSI",
        fonction: "Administrateur Système",
      },
      {
        email: "agent@sports.gouv.ci",
        password: "agent123",
        nom: "Kouassi",
        prenom: "Jean-Baptiste",
        role: "AGENT" as const,
        matricule: "AGT001",
        service: "Direction Technique",
        fonction: "Entraîneur National",
      },
      {
        email: "courrier@sports.gouv.ci",
        password: "courrier123",
        nom: "Diallo",
        prenom: "Fatou",
        role: "SERVICE_COURRIER" as const,
        matricule: "COUR001",
        service: "Service Courrier",
        fonction: "Agent de Courrier",
      },
      {
        email: "secretariat@sports.gouv.ci",
        password: "secret123",
        nom: "Kone",
        prenom: "Aminata",
        role: "SECRETARIAT_DRH" as const,
        matricule: "SEC001",
        service: "Secrétariat DRH",
        fonction: "Secrétaire Administrative",
      },
      {
        email: "drh@sports.gouv.ci",
        password: "drh123",
        nom: "Ouattara",
        prenom: "Dr. Moussa",
        role: "DRH" as const,
        matricule: "DRH001",
        service: "Direction RH",
        fonction: "Directeur des Ressources Humaines",
      },
    ]

    const created = []
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await db.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          nom: userData.nom,
          prenom: userData.prenom,
          role: userData.role,
          matricule: userData.matricule,
          service: userData.service,
          fonction: userData.fonction,
        }
      })
      console.log(`Seed: Créé → ${user.email} (${user.role})`)
      created.push({ email: user.email, role: user.role, nom: user.nom })
    }

    return NextResponse.json({
      message: "Utilisateurs de démonstration créés avec succès",
      count: created.length,
      users: created,
      credentials: [
        { email: "admin@sports.gouv.ci", password: "admin123", role: "ADMIN" },
        { email: "agent@sports.gouv.ci", password: "agent123", role: "AGENT" },
        { email: "courrier@sports.gouv.ci", password: "courrier123", role: "SERVICE_COURRIER" },
        { email: "secretariat@sports.gouv.ci", password: "secret123", role: "SECRETARIAT_DRH" },
        { email: "drh@sports.gouv.ci", password: "drh123", role: "DRH" },
      ]
    })
  } catch (error) {
    console.error("Seed: ERREUR:", error)
    return NextResponse.json(
      {
        error: "Erreur lors de la création des utilisateurs",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
