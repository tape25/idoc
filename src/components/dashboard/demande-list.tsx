"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  Check, 
  X, 
  Send, 
  PenTool,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react"

interface Demande {
  id: string
  numeroEnregistrement: string | null
  type: string
  titre: string
  motif: string | null
  statut: string
  dateSoumission: string
  dateDebut: string | null
  dateFin: string | null
  agent?: {
    nom: string
    prenom: string
    matricule: string | null
    email: string
    service: string | null
  }
  piecesJointes?: { nom: string; chemin: string }[]
  historique?: {
    action: string
    details: string | null
    ancienStatut: string | null
    nouveauStatut: string
    createdAt: string
    user: { nom: string; prenom: string; role: string }
  }[]
}

interface DemandeListProps {
  demandes: Demande[]
  userRole: string
  onAction: (id: string, action: string, commentaire?: string) => void
  onViewHistorique: (demande: Demande) => void
}

const statusLabels: Record<string, string> = {
  SOUMIS: "Soumis",
  EN_VERIFICATION: "En vérification",
  REJETE_COURRIER: "Rejeté",
  VALIDEE_COURRIER: "Validé (Courrier)",
  EN_COURS_TRAITEMENT: "En cours de traitement",
  EN_ATTENTE_SIGNATURE: "En attente de signature",
  SIGNE: "Signé",
  RETOUR_SECRETARIAT: "Retour secrétariat",
  TRANSMIS_COURRIER: "Transmis au courrier",
  DISPONIBLE: "Disponible",
  RETIRE: "Retiré"
}

const statusColors: Record<string, string> = {
  SOUMIS: "bg-blue-500",
  EN_VERIFICATION: "bg-yellow-500",
  REJETE_COURRIER: "bg-red-500",
  VALIDEE_COURRIER: "bg-green-500",
  EN_COURS_TRAITEMENT: "bg-orange-500",
  EN_ATTENTE_SIGNATURE: "bg-purple-500",
  SIGNE: "bg-emerald-600",
  RETOUR_SECRETARIAT: "bg-amber-500",
  TRANSMIS_COURRIER: "bg-teal-500",
  DISPONIBLE: "bg-green-600",
  RETIRE: "bg-gray-500"
}

const typeLabels: Record<string, string> = {
  CONGE_MATERNITE: "Congé de maternité",
  ARRET_MALADIE: "Arrêt maladie",
  PERMISSION: "Permission",
  ATTESTATION: "Attestation",
  CERTIFICAT: "Certificat",
  AUTRE: "Autre"
}

export function DemandeList({ demandes, userRole, onAction, onViewHistorique }: DemandeListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  const handleAction = async (id: string, action: string) => {
    setProcessing(id)
    await onAction(id, action)
    setProcessing(null)
  }

  const getActionsForRole = (demande: Demande) => {
    const actions: { action: string; label: string; icon: React.ReactNode; variant: "default" | "destructive" | "outline" }[] = []

    switch (userRole) {
      case "SERVICE_COURRIER":
        if (demande.statut === "SOUMIS") {
          actions.push({ action: "VALIDER_COURRIER", label: "Valider", icon: <Check className="h-4 w-4" />, variant: "default" })
          actions.push({ action: "REJETER_COURRIER", label: "Rejeter", icon: <X className="h-4 w-4" />, variant: "destructive" })
        }
        if (demande.statut === "VALIDEE_COURRIER") {
          actions.push({ action: "TRANSMETTRE_SECRETARIAT", label: "Transmettre au secrétariat", icon: <Send className="h-4 w-4" />, variant: "default" })
        }
        if (demande.statut === "TRANSMIS_COURRIER") {
          actions.push({ action: "NOTIFIER", label: "Notifier l'agent", icon: <Send className="h-4 w-4" />, variant: "default" })
        }
        break

      case "SECRETARIAT_DRH":
        if (demande.statut === "VALIDEE_COURRIER" || demande.statut === "EN_COURS_TRAITEMENT") {
          actions.push({ action: "TRAITER", label: "Transmettre pour signature", icon: <Send className="h-4 w-4" />, variant: "default" })
        }
        if (demande.statut === "SIGNE") {
          actions.push({ action: "TRANSMETTRE_COURRIER", label: "Transmettre au courrier", icon: <Send className="h-4 w-4" />, variant: "default" })
        }
        if (demande.statut === "RETOUR_SECRETARIAT") {
          actions.push({ action: "TRAITER", label: "Retraiter", icon: <FileText className="h-4 w-4" />, variant: "outline" })
        }
        break

      case "DRH":
        if (demande.statut === "EN_ATTENTE_SIGNATURE") {
          actions.push({ action: "SIGNER", label: "Signer", icon: <PenTool className="h-4 w-4" />, variant: "default" })
        }
        if (demande.statut === "SIGNE") {
          actions.push({ action: "RETOURNER_SECRETARIAT", label: "Retourner au secrétariat", icon: <Send className="h-4 w-4" />, variant: "outline" })
        }
        break

      case "AGENT":
        if (demande.statut === "DISPONIBLE") {
          actions.push({ action: "RETIRER", label: "Confirmer le retrait", icon: <Check className="h-4 w-4" />, variant: "default" })
        }
        break
    }

    return actions
  }

  if (demandes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Aucune demande à afficher</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {demandes.map((demande) => {
        const isExpanded = expandedId === demande.id
        const actions = getActionsForRole(demande)
        const isProcessing = processing === demande.id

        return (
          <Card key={demande.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${statusColors[demande.statut]} text-white`}>
                      {statusLabels[demande.statut]}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {demande.numeroEnregistrement}
                    </span>
                  </div>
                  <CardTitle className="text-base">{demande.titre}</CardTitle>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{typeLabels[demande.type] || demande.type}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(demande.dateSoumission).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(isExpanded ? null : demande.id)}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  {/* Info agent */}
                  {demande.agent && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Agent</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{demande.agent.prenom} {demande.agent.nom}</p>
                        <p>Matricule: {demande.agent.matricule || "-"}</p>
                        <p>Service: {demande.agent.service || "-"}</p>
                        <p>Email: {demande.agent.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Détails demande */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Détails</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Motif: {demande.motif || "-"}</p>
                      {demande.dateDebut && (
                        <p>Du: {new Date(demande.dateDebut).toLocaleDateString("fr-FR")}</p>
                      )}
                      {demande.dateFin && (
                        <p>Au: {new Date(demande.dateFin).toLocaleDateString("fr-FR")}</p>
                      )}
                    </div>
                  </div>

                  {/* Pièces jointes */}
                  {demande.piecesJointes && demande.piecesJointes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Pièces jointes</h4>
                      <div className="text-sm text-gray-600">
                        {demande.piecesJointes.map((pj, i) => (
                          <p key={i}>{pj.nom}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewHistorique(demande)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Historique
                  </Button>
                  
                  {actions.map((action, i) => (
                    <Button
                      key={i}
                      variant={action.variant}
                      size="sm"
                      onClick={() => handleAction(demande.id, action.action)}
                      disabled={isProcessing}
                    >
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
