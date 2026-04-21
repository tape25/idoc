import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Récupérer une demande spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    const demande = await db.demande.findUnique({
      where: { id },
      include: {
        agent: { 
          select: { id: true, nom: true, prenom: true, matricule: true, email: true, service: true, telephone: true } 
        },
        traitePar: { select: { nom: true, prenom: true, role: true } },
        piecesJointes: true,
        historique: {
          include: { user: { select: { nom: true, prenom: true, role: true } } },
          orderBy: { createdAt: "desc" }
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    })

    if (!demande) {
      return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 })
    }

    // Vérifier les droits d'accès
    if (session.user.role === "AGENT" && demande.agentId !== session.user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    return NextResponse.json(demande)
  } catch (error) {
    console.error("Erreur récupération demande:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la demande" },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le statut d'une demande (workflow)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, commentaire } = body

    const demande = await db.demande.findUnique({
      where: { id },
      include: { agent: true }
    })

    if (!demande) {
      return NextResponse.json({ error: "Demande non trouvée" }, { status: 404 })
    }

    let nouveauStatut = demande.statut
    let actionDescription = ""
    let notificationTitre = ""
    let notificationMessage = ""

    // Définir les transitions de statut selon le rôle et l'action
    switch (action) {
      case "VERIFIER":
        if (session.user.role !== "SERVICE_COURRIER") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "EN_VERIFICATION"
        actionDescription = "Vérification en cours"
        break

      case "VALIDER_COURRIER":
        if (session.user.role !== "SERVICE_COURRIER") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "VALIDEE_COURRIER"
        actionDescription = "Validé par le service courrier"
        notificationTitre = "Nouvelle demande validée"
        notificationMessage = `La demande ${demande.numeroEnregistrement} a été validée et nécessite un traitement`
        break

      case "REJETER_COURRIER":
        if (session.user.role !== "SERVICE_COURRIER") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "REJETE_COURRIER"
        actionDescription = "Rejeté par le service courrier"
        notificationTitre = "Demande rejetée"
        notificationMessage = `Votre demande ${demande.numeroEnregistrement} a été rejetée: ${commentaire || "Dossier incomplet"}`
        break

      case "TRANSMETTRE_SECRETARIAT":
        if (session.user.role !== "SERVICE_COURRIER") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "EN_COURS_TRAITEMENT"
        actionDescription = "Transmis au secrétariat DRH"
        notificationTitre = "Nouvelle demande à traiter"
        notificationMessage = `La demande ${demande.numeroEnregistrement} nécessite un traitement`
        break

      case "TRAITER":
        if (session.user.role !== "SECRETARIAT_DRH") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "EN_ATTENTE_SIGNATURE"
        actionDescription = "Traité et transmis pour signature"
        notificationTitre = "Demande en attente de signature"
        notificationMessage = `La demande ${demande.numeroEnregistrement} est en attente de votre signature`
        break

      case "SIGNER":
        if (session.user.role !== "DRH") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "SIGNE"
        actionDescription = "Signé par le DRH"
        notificationTitre = "Document signé"
        notificationMessage = `Le document ${demande.numeroEnregistrement} a été signé`
        break

      case "RETOURNER_SECRETARIAT":
        if (session.user.role !== "DRH") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "RETOUR_SECRETARIAT"
        actionDescription = "Retourné au secrétariat"
        break

      case "TRANSMETTRE_COURRIER":
        if (session.user.role !== "SECRETARIAT_DRH") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "TRANSMIS_COURRIER"
        actionDescription = "Transmis au service courrier pour notification"
        notificationTitre = "Document à notifier"
        notificationMessage = `Le document ${demande.numeroEnregistrement} est prêt pour notification`
        break

      case "NOTIFIER":
        if (session.user.role !== "SERVICE_COURRIER") {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "DISPONIBLE"
        actionDescription = "Agent notifié, document disponible"
        notificationTitre = "Document disponible"
        notificationMessage = `Votre document ${demande.numeroEnregistrement} est disponible pour retrait`
        break

      case "RETIRER":
        if (session.user.role !== "AGENT" || demande.agentId !== session.user.id) {
          return NextResponse.json({ error: "Action non autorisée" }, { status: 403 })
        }
        nouveauStatut = "RETIRE"
        actionDescription = "Document retiré par l'agent"
        break

      default:
        return NextResponse.json({ error: "Action inconnue" }, { status: 400 })
    }

    // Mettre à jour la demande
    const updatedDemande = await db.demande.update({
      where: { id },
      data: {
        statut: nouveauStatut,
        commentaires: commentaire || demande.commentaires,
        traiteParId: session.user.id,
        dateValidation: nouveauStatut === "VALIDEE_COURRIER" ? new Date() : demande.dateValidation,
        dateSignature: nouveauStatut === "SIGNE" ? new Date() : demande.dateSignature,
        dateDisponibilite: nouveauStatut === "DISPONIBLE" ? new Date() : demande.dateDisponibilite,
        dateRetrait: nouveauStatut === "RETIRE" ? new Date() : demande.dateRetrait,
        historique: {
          create: {
            action: actionDescription,
            details: commentaire,
            ancienStatut: demande.statut,
            nouveauStatut,
            userId: session.user.id
          }
        }
      },
      include: {
        agent: true,
        historique: {
          include: { user: { select: { nom: true, prenom: true, role: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    })

    // Créer des notifications si nécessaire
    if (notificationTitre) {
      let notificationUsers: string[] = []

      switch (nouveauStatut) {
        case "VALIDEE_COURRIER":
        case "EN_COURS_TRAITEMENT":
          const secretariatUsers = await db.user.findMany({
            where: { role: "SECRETARIAT_DRH", actif: true },
            select: { id: true }
          })
          notificationUsers = secretariatUsers.map(u => u.id)
          break

        case "EN_ATTENTE_SIGNATURE":
          const drhUsers = await db.user.findMany({
            where: { role: "DRH", actif: true },
            select: { id: true }
          })
          notificationUsers = drhUsers.map(u => u.id)
          break

        case "SIGNE":
        case "REJETE_COURRIER":
        case "DISPONIBLE":
          notificationUsers = [demande.agentId]
          break

        case "TRANSMIS_COURRIER":
          const courrierUsers = await db.user.findMany({
            where: { role: "SERVICE_COURRIER", actif: true },
            select: { id: true }
          })
          notificationUsers = courrierUsers.map(u => u.id)
          break
      }

      if (notificationUsers.length > 0) {
        await db.notification.createMany({
          data: notificationUsers.map(userId => ({
            titre: notificationTitre,
            message: notificationMessage,
            type: "in_app",
            userId,
            demandeId: id
          }))
        })
      }
    }

    return NextResponse.json(updatedDemande)
  } catch (error) {
    console.error("Erreur mise à jour demande:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la demande" },
      { status: 500 }
    )
  }
}
