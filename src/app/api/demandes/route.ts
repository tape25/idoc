import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Récupérer les demandes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statut = searchParams.get("statut")
    const type = searchParams.get("type")

    let whereClause: Record<string, unknown> = {}

    // Filtrer par rôle
    if (session.user.role === "AGENT") {
      whereClause.agentId = session.user.id
    }

    // Filtrer par statut
    if (statut) {
      whereClause.statut = statut
    }

    // Filtrer par type
    if (type) {
      whereClause.type = type
    }

    const demandes = await db.demande.findMany({
      where: whereClause,
      include: {
        agent: { 
          select: { id: true, nom: true, prenom: true, matricule: true, email: true, service: true } 
        },
        traitePar: { select: { nom: true, prenom: true, role: true } },
        piecesJointes: true,
        historique: {
          include: { user: { select: { nom: true, prenom: true, role: true } } },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(demandes)
  } catch (error) {
    console.error("Erreur récupération demandes:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes" },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle demande
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { type, titre, motif, dateDebut, dateFin, piecesJointes } = body

    // Générer un numéro d'enregistrement
    const count = await db.demande.count()
    const annee = new Date().getFullYear()
    const numeroEnregistrement = `DRH-${annee}-${String(count + 1).padStart(5, "0")}`

    const demande = await db.demande.create({
      data: {
        numeroEnregistrement,
        type,
        titre,
        motif,
        dateDebut: dateDebut ? new Date(dateDebut) : null,
        dateFin: dateFin ? new Date(dateFin) : null,
        agentId: session.user.id,
        statut: "SOUMIS",
        historique: {
          create: {
            action: "Création de la demande",
            details: `Demande soumise par ${session.user.prenom} ${session.user.nom}`,
            nouveauStatut: "SOUMIS",
            userId: session.user.id
          }
        }
      },
      include: {
        agent: { select: { nom: true, prenom: true, matricule: true } }
      }
    })

    // Créer les pièces jointes si fournies
    if (piecesJointes && piecesJointes.length > 0) {
      await db.pieceJointe.createMany({
        data: piecesJointes.map((pj: { nom: string; chemin: string; type: string; taille: number }) => ({
          nom: pj.nom,
          chemin: pj.chemin,
          type: pj.type,
          taille: pj.taille,
          demandeId: demande.id
        }))
      })
    }

    // Créer une notification pour le service courrier
    const courrierUsers = await db.user.findMany({
      where: { role: "SERVICE_COURRIER", actif: true }
    })

    await db.notification.createMany({
      data: courrierUsers.map(user => ({
        titre: "Nouvelle demande soumise",
        message: `Une nouvelle demande (${demande.numeroEnregistrement}) a été soumise par ${session.user.prenom} ${session.user.nom}`,
        type: "in_app",
        userId: user.id,
        demandeId: demande.id
      }))
    })

    return NextResponse.json(demande, { status: 201 })
  } catch (error) {
    console.error("Erreur création demande:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande" },
      { status: 500 }
    )
  }
}
