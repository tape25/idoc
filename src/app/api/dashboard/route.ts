import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const role = session.user.role
    const userId = session.user.id

    let stats: Record<string, unknown> = {}
    let demandes: unknown[] = []

    switch (role) {
      case "AGENT":
        // Stats pour l'agent
        const agentDemandes = await db.demande.findMany({
          where: { agentId: userId },
          include: {
            piecesJointes: true,
            historique: {
              include: { user: { select: { nom: true, prenom: true, role: true } } },
              orderBy: { createdAt: "desc" },
              take: 10
            }
          },
          orderBy: { createdAt: "desc" }
        })

        stats = {
          total: agentDemandes.length,
          soumis: agentDemandes.filter(d => d.statut === "SOUMIS").length,
          enCours: agentDemandes.filter(d => 
            ["EN_VERIFICATION", "VALIDEE_COURRIER", "EN_COURS_TRAITEMENT", "EN_ATTENTE_SIGNATURE"].includes(d.statut)
          ).length,
          signes: agentDemandes.filter(d => d.statut === "SIGNE").length,
          disponibles: agentDemandes.filter(d => d.statut === "DISPONIBLE").length,
          rejetes: agentDemandes.filter(d => d.statut === "REJETE_COURRIER").length,
        }
        demandes = agentDemandes
        break

      case "SERVICE_COURRIER":
        // Stats pour le service courrier
        const courrierDemandes = await db.demande.findMany({
          where: { 
            statut: { in: ["SOUMIS", "EN_VERIFICATION", "VALIDEE_COURRIER", "REJETE_COURRIER", "TRANSMIS_COURRIER", "DISPONIBLE"] }
          },
          include: {
            agent: { select: { nom: true, prenom: true, matricule: true, email: true } },
            piecesJointes: true
          },
          orderBy: { createdAt: "desc" }
        })

        stats = {
          aVerifier: courrierDemandes.filter(d => d.statut === "SOUMIS").length,
          enCours: courrierDemandes.filter(d => d.statut === "EN_VERIFICATION").length,
          valides: courrierDemandes.filter(d => d.statut === "VALIDEE_COURRIER").length,
          rejete: courrierDemandes.filter(d => d.statut === "REJETE_COURRIER").length,
          aNotifier: courrierDemandes.filter(d => d.statut === "TRANSMIS_COURRIER").length,
          disponibles: courrierDemandes.filter(d => d.statut === "DISPONIBLE").length,
        }
        demandes = courrierDemandes
        break

      case "SECRETARIAT_DRH":
        // Stats pour le secrétariat DRH
        const secretariatDemandes = await db.demande.findMany({
          where: { 
            statut: { in: ["VALIDEE_COURRIER", "EN_COURS_TRAITEMENT", "EN_ATTENTE_SIGNATURE", "SIGNE", "RETOUR_SECRETARIAT"] }
          },
          include: {
            agent: { select: { nom: true, prenom: true, matricule: true, email: true } },
            piecesJointes: true
          },
          orderBy: { createdAt: "desc" }
        })

        stats = {
          aTraiter: secretariatDemandes.filter(d => d.statut === "VALIDEE_COURRIER").length,
          enCours: secretariatDemandes.filter(d => d.statut === "EN_COURS_TRAITEMENT").length,
          enAttenteSignature: secretariatDemandes.filter(d => d.statut === "EN_ATTENTE_SIGNATURE").length,
          signes: secretariatDemandes.filter(d => d.statut === "SIGNE").length,
          retours: secretariatDemandes.filter(d => d.statut === "RETOUR_SECRETARIAT").length,
        }
        demandes = secretariatDemandes
        break

      case "DRH":
        // Stats pour le DRH
        const drhDemandes = await db.demande.findMany({
          where: { 
            statut: { in: ["EN_ATTENTE_SIGNATURE", "SIGNE", "RETOUR_SECRETARIAT"] }
          },
          include: {
            agent: { select: { nom: true, prenom: true, matricule: true, email: true } },
            traitePar: { select: { nom: true, prenom: true } },
            piecesJointes: true
          },
          orderBy: { createdAt: "desc" }
        })

        stats = {
          aSigner: drhDemandes.filter(d => d.statut === "EN_ATTENTE_SIGNATURE").length,
          signes: drhDemandes.filter(d => d.statut === "SIGNE").length,
          retours: drhDemandes.filter(d => d.statut === "RETOUR_SECRETARIAT").length,
        }
        demandes = drhDemandes
        break

      case "ADMIN":
        // Stats globales pour l'admin
        const allDemandes = await db.demande.findMany({
          include: {
            agent: { select: { nom: true, prenom: true, matricule: true, email: true } },
            piecesJointes: true
          },
          orderBy: { createdAt: "desc" },
          take: 50
        })

        const totalUsers = await db.user.count()
        const usersByRole = await db.user.groupBy({
          by: ["role"],
          _count: { id: true }
        })

        stats = {
          totalDemandes: allDemandes.length,
          totalUsers,
          usersByRole,
          parStatut: {
            soumis: allDemandes.filter(d => d.statut === "SOUMIS").length,
            enCours: allDemandes.filter(d => 
              ["EN_VERIFICATION", "VALIDEE_COURRIER", "EN_COURS_TRAITEMENT", "EN_ATTENTE_SIGNATURE"].includes(d.statut)
            ).length,
            signes: allDemandes.filter(d => d.statut === "SIGNE").length,
            disponibles: allDemandes.filter(d => d.statut === "DISPONIBLE").length,
            rejetes: allDemandes.filter(d => d.statut === "REJETE_COURRIER").length,
          },
          parType: {
            congeMaternite: allDemandes.filter(d => d.type === "CONGE_MATERNITE").length,
            arretMaladie: allDemandes.filter(d => d.type === "ARRET_MALADIE").length,
            permission: allDemandes.filter(d => d.type === "PERMISSION").length,
            attestation: allDemandes.filter(d => d.type === "ATTESTATION").length,
            certificat: allDemandes.filter(d => d.type === "CERTIFICAT").length,
          }
        }
        demandes = allDemandes
        break
    }

    return NextResponse.json({ stats, demandes })
  } catch (error) {
    console.error("Erreur dashboard:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    )
  }
}
