import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

// API pour initialiser les utilisateurs de démonstration
export async function GET() {
  try {
    // Vérifier si des utilisateurs existent déjà
    const existingUsers = await db.user.count()
    
    if (existingUsers > 0) {
      return NextResponse.json({ 
        message: "Les utilisateurs existent déjà",
        count: existingUsers 
      })
    }

    const hashedPassword = await bcrypt.hash("admin123", 10)
    const agentPassword = await bcrypt.hash("agent123", 10)
    const courrierPassword = await bcrypt.hash("courrier123", 10)
    const secretariatPassword = await bcrypt.hash("secret123", 10)
    const drhPassword = await bcrypt.hash("drh123", 10)

    // Créer les utilisateurs de démonstration
    const users = await Promise.all([
      db.user.create({
        data: {
          email: "admin@sports.gouv.ci",
          password: hashedPassword,
          nom: "Admin",
          prenom: "Système",
          role: "ADMIN",
          matricule: "ADM001",
          service: "DSI",
          fonction: "Administrateur Système"
        }
      }),
      db.user.create({
        data: {
          email: "agent@sports.gouv.ci",
          password: agentPassword,
          nom: "Kouassi",
          prenom: "Jean-Baptiste",
          role: "AGENT",
          matricule: "AGT001",
          service: "Direction Technique",
          fonction: "Entraîneur National"
        }
      }),
      db.user.create({
        data: {
          email: "courrier@sports.gouv.ci",
          password: courrierPassword,
          nom: "Diallo",
          prenom: "Fatou",
          role: "SERVICE_COURRIER",
          matricule: "COUR001",
          service: "Service Courrier",
          fonction: "Agent de Courrier"
        }
      }),
      db.user.create({
        data: {
          email: "secretariat@sports.gouv.ci",
          password: secretariatPassword,
          nom: "Kone",
          prenom: "Aminata",
          role: "SECRETARIAT_DRH",
          matricule: "SEC001",
          service: "Secrétariat DRH",
          fonction: "Secrétaire Administrative"
        }
      }),
      db.user.create({
        data: {
          email: "drh@sports.gouv.ci",
          password: drhPassword,
          nom: "Ouattara",
          prenom: "Dr. Moussa",
          role: "DRH",
          matricule: "DRH001",
          service: "Direction RH",
          fonction: "Directeur des Ressources Humaines"
        }
      })
    ])

    return NextResponse.json({ 
      message: "Utilisateurs de démonstration créés avec succès",
      count: users.length,
      users: users.map(u => ({ email: u.email, role: u.role, nom: u.nom }))
    })
  } catch (error) {
    console.error("Erreur lors de la création des utilisateurs:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création des utilisateurs" },
      { status: 500 }
    )
  }
}
