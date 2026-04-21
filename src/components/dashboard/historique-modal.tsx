"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Clock, User } from "lucide-react"

interface Demande {
  id: string
  numeroEnregistrement: string | null
  type: string
  titre: string
  statut: string
  historique?: {
    action: string
    details: string | null
    ancienStatut: string | null
    nouveauStatut: string
    createdAt: string
    user: { nom: string; prenom: string; role: string }
  }[]
}

interface HistoriqueModalProps {
  demande: Demande
  onClose: () => void
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

const roleLabels: Record<string, string> = {
  AGENT: "Agent",
  SERVICE_COURRIER: "Service Courrier",
  SECRETARIAT_DRH: "Secrétariat DRH",
  DRH: "Directeur RH",
  ADMIN: "Administrateur"
}

export function HistoriqueModal({ demande, onClose }: HistoriqueModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Historique de la demande</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {demande.numeroEnregistrement} - {demande.titre}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {!demande.historique || demande.historique.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucun historique disponible
            </p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              {/* Timeline items */}
              <div className="space-y-4">
                {demande.historique.map((h, index) => (
                  <div key={index} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className={`absolute left-2 top-2 w-4 h-4 rounded-full ${statusColors[h.nouveauStatut] || "bg-gray-400"} border-2 border-white`} />
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {statusLabels[h.nouveauStatut]}
                        </Badge>
                        {h.ancienStatut && h.ancienStatut !== h.nouveauStatut && (
                          <>
                            <span className="text-xs text-gray-400">←</span>
                            <span className="text-xs text-gray-500">
                              {statusLabels[h.ancienStatut]}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <p className="font-medium text-sm">{h.action}</p>
                      
                      {h.details && (
                        <p className="text-sm text-gray-600 mt-1">{h.details}</p>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {h.user.prenom} {h.user.nom} ({roleLabels[h.user.role]})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(h.createdAt).toLocaleString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
